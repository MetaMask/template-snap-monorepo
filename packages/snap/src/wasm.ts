import { rpcErrors } from '@metamask/rpc-errors';

import { moduleBytes } from './module';

type InstanceMemorySlice = [number, number];
type WasmInstance = {
  alloc: (len: number) => number;
  dealloc: (ptr: number, len: number) => void;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  serialize_call: (txPtr: number, txLen: number, noncePtr: number) => number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  serialize_transaction: (
    pkPtr: number,
    pkLen: number,
    msgPtr: number,
    msgLen: number,
    signaturePtr: number,
    signatureLen: number,
  ) => number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  validate_transaction: (txPtr: number, txLen: number) => number;
  memory: Uint8Array;
};

export type AllocatedStruct = {
  bytes: Uint8Array;
  ptr: number;
};

export class SovWasm {
  // eslint-disable-next-line no-restricted-globals
  #instance: Webassembly.Instance;

  #instanceExports: WasmInstance;

  #allocs: InstanceMemorySlice[];

  // Constructor
  constructor() {
    this.#allocs = [];

    // eslint-disable-next-line no-restricted-globals
    this.#instance = new WebAssembly.Instance(
      // eslint-disable-next-line no-restricted-globals
      new WebAssembly.Module(moduleBytes),
      {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        wasi_snapshot_preview1: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          fd_write: (
            _fd: number,
            _iovsPtr: number,
            _iovsLen: number,
            _nwrittenPtr: number,
          ): number => {
            return 0;
          },
          // eslint-disable-next-line @typescript-eslint/naming-convention
          environ_get: (_environ: number, _environBuf: number): number => {
            return 0;
          },
          // eslint-disable-next-line @typescript-eslint/naming-convention
          environ_sizes_get: (
            _environCount: number,
            _environSize: number,
          ): number => {
            return 0;
          },
          // eslint-disable-next-line @typescript-eslint/naming-convention
          proc_exit: (exitCode: number) => {
            throw new Error(`exit with exit code ${exitCode}`);
          },
        },
      },
    );
    this.#instanceExports = this.#instance.exports as WasmInstance;
  }

  /**
   * Allocates memory into the WASM module.
   *
   * @param len - The number of bytes to allocate.
   * @returns The pointer address of the allocated memory.
   */
  public alloc(len: number): number {
    const ptr = this.#instanceExports.alloc(len);
    this.#allocs.push([ptr, len]);
    return ptr;
  }

  /**
   * Reads an allocated structure, returning its bytes.
   *
   * @param ptr - The pointer address of the allocated memory.
   * @returns The WASM allocated structure.
   * @throws If the pointer is invalid.
   */
  public allocatedStruct(ptr: number): AllocatedStruct {
    if (ptr === 0) {
      throw rpcErrors.internal('The structure pointer is invalid');
    }
    const len = new DataView(this.#instanceExports.memory.buffer).getUint32(
      ptr,
      true,
    );
    const arr = this.#instanceExports.memory.buffer.slice(
      ptr + 4,
      ptr + 4 + len,
    );
    this.#allocs.push([ptr, len + 4]);
    return {
      bytes: new Uint8Array(arr),
      ptr: ptr + 4,
    };
  }

  /**
   * Deallocates the previously allocated WASM memory.
   */
  public dealloc(): void {
    for (const pair of this.#allocs) {
      const [ptr, len] = pair;
      this.#instanceExports.dealloc(ptr, len);
    }
    this.#allocs = [];
  }

  /**
   * Deallocates the previously allocated WASM memory.
   *
   * @param message - The JSON call message to serialize.
   * @param nonce - The nonce for the transaction.
   * @returns The serialized call to be signed.
   * @throws If internal error.
   */
  public serializeCall(message: string, nonce: number): AllocatedStruct {
    const encoder = new TextEncoder();
    const encodedCall = encoder.encode(message);
    const callLen = encodedCall.length;
    const callPtr = this.alloc(callLen);
    const callMem = new Uint8Array(
      this.#instanceExports.memory.buffer,
      callPtr,
      callLen,
    );
    callMem.set(encodedCall);

    const nonceBuffer = new ArrayBuffer(8);
    const nonceDv = new DataView(nonceBuffer);
    nonceDv.setBigUint64(0, BigInt(nonce), true);
    const nonceArray = new Uint8Array(nonceBuffer);
    const noncePtr = this.alloc(8);
    const nonceMem = new Uint8Array(
      this.#instanceExports.memory.buffer,
      noncePtr,
      8,
    );
    nonceMem.set(nonceArray);

    const serializedCallPtr = this.#instanceExports.serialize_call(
      callPtr,
      callLen,
      noncePtr,
    );
    return this.allocatedStruct(serializedCallPtr);
  }

  /**
   * Serializes a transaction, validating it.
   *
   * @param publicKey - The public key to verify the signature.
   * @param signature - The cryptographic signature of the message.
   * @param call - The WASM allocated transaction call message.
   * @returns The serialized transaction.
   * @throws If the signature is invalid for the transaction
   */
  public serializeTransaction(
    publicKey: Uint8Array,
    signature: Uint8Array,
    call: AllocatedStruct,
  ): Uint8Array {
    const publicKeyPtr = this.alloc(publicKey.length);
    const publicKeyMem = new Uint8Array(
      this.#instanceExports.memory.buffer,
      publicKeyPtr,
      publicKey.length,
    );
    publicKeyMem.set(publicKey);

    const signaturePtr = this.alloc(signature.length);
    const signatureMem = new Uint8Array(
      this.#instanceExports.memory.buffer,
      signaturePtr,
      signature.length,
    );
    signatureMem.set(signature);

    const serializedTxPtr = this.#instanceExports.serialize_transaction(
      publicKeyPtr,
      publicKey.length,
      call.ptr,
      call.bytes.length,
      signaturePtr,
      signature.length,
    );
    const serializedTx = this.allocatedStruct(serializedTxPtr);

    const txVerification = this.#instanceExports.validate_transaction(
      serializedTx.ptr,
      serializedTx.bytes.length,
    );
    if (txVerification !== 0) {
      throw rpcErrors.internal('Error validating serialized transaction');
    }

    return serializedTx.bytes;
  }
}
