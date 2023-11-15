import { SLIP10Node } from '@metamask/key-tree';
import { providerErrors } from '@metamask/rpc-errors';
import type { OnRpcRequestHandler } from '@metamask/snaps-types';
import { DialogType } from '@metamask/snaps-types';
import { copyable, heading, panel, text } from '@metamask/snaps-ui';
import { add0x, assert, bytesToHex, remove0x } from '@metamask/utils';
import { sign } from '@noble/ed25519';

import type { GetBip32PublicKeyParams, SignTransactionParams } from './types';
import { SovWasm } from './wasm';

const wasm = new SovWasm();

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of `snap_dialog`.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  switch (request.method) {
    // the return is a plain hex string
    // https://docs.metamask.io/snaps/reference/rpc-api/#returns-5
    case 'getPublicKey': {
      const { path, compressed } = request.params as GetBip32PublicKeyParams;

      return snap.request({
        method: 'snap_getBip32PublicKey',
        params: {
          path,
          compressed,
          curve: 'ed25519',
        },
      });
    }

    case 'signTransaction': {
      const { transaction, path } = request.params as SignTransactionParams;

      try {
        const call = wasm.serializeCall(transaction.message, transaction.nonce);
        const entropy = await snap.request({
          method: 'snap_getBip32Entropy',
          params: {
            curve: 'ed25519',
            path,
          },
        });

        // we define a SLIP-10 node from the response
        // https://docs.metamask.io/snaps/reference/rpc-api/#returns-4
        const node = await SLIP10Node.fromJSON(entropy);
        assert(node.privateKey);

        const approved = snap.request({
          method: 'snap_dialog',
          params: {
            type: DialogType.Confirmation,
            content: panel([
              heading('Signature request'),
              text(`Do you want to sign`),
              copyable(transaction.message),
              text(`with nonce`),
              copyable(transaction.nonce.toString()),
              text(`and the following public key?`),
              copyable(add0x(node.publicKey)),
            ]),
          },
        });

        if (!approved) {
          throw providerErrors.userRejectedRequest();
        }

        // skip the key byte flags prefix
        const publicKey = node.publicKeyBytes.slice(
          1,
          node.publicKeyBytes.length,
        );
        const privateKey = remove0x(node.privateKey);

        const signature = await sign(call.bytes, privateKey);
        const tx = wasm.serializeTransaction(publicKey, signature, call);
        const txHex = bytesToHex(tx);

        wasm.dealloc();

        return txHex;
      } catch (er) {
        wasm.dealloc();
        throw er;
      }
    }

    default:
      throw new Error('Method not found.');
  }
};
