import { providerErrors, rpcErrors } from '@metamask/rpc-errors';
import { DialogType, OnRpcRequestHandler } from '@metamask/snaps-types';
import { copyable, heading, panel, text } from '@metamask/snaps-ui';
import { SLIP10Node } from '@metamask/key-tree';
import {
  add0x,
  assert,
  bytesToHex,
  remove0x,
  valueToBytes,
} from '@metamask/utils';
import { sign as signEd25519 } from '@noble/ed25519';
import { sign as signSecp256k1 } from '@noble/secp256k1';

import type { GetBip32PublicKeyParams, SignMessageParams } from './types';

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 * @param args.request - A validated JSON-RPC request object.
 * @returns The result of the method.
 * @throws If the request method is not valid for this snap.
 */
export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  switch (request.method) {
    // the return is a plain hex string
    // https://docs.metamask.io/snaps/reference/rpc-api/#returns-5
    case 'getPublicKey':
      return await snap.request({
        method: 'snap_getBip32PublicKey',
        params: request.params as unknown as GetBip32PublicKeyParams,
      });

    case 'signMessage': {
      const { message, curve, ...params } = request.params as SignMessageParams;
      const json = await snap.request({
        method: 'snap_getBip32Entropy',
        params: {
          ...params,
          curve,
        },
      });

      // we define a SLIP-10 node from the response
      // https://docs.metamask.io/snaps/reference/rpc-api/#returns-4
      const node = await SLIP10Node.fromJSON(json);

      // while SLIP-10 does support NIST P-256, Metamask doesn't under the claim of insufficient
      // demand.
      // https://github.com/satoshilabs/slips/blob/master/slip-0010.md#master-key-generation
      // https://github.com/MetaMask/key-tree/blob/main/README.md#usage
      assert(node.privateKey);
      assert(curve === 'ed25519' || curve === 'secp256k1');

      // assert the user's approval of the provided message. Note: this message will be a raw bytes
      // representation. A human-friendly format is currently not supported by the API as the
      // conversion is expected to be performed before the interaction with the Snap.
      //
      // For more information, refer to the tracking issue:
      // https://github.com/Sovereign-Labs/sovereign-sdk/issues/982
      const approved = await snap.request({
        method: 'snap_dialog',
        params: {
          type: DialogType.Confirmation,
          content: panel([
            heading('Signature request'),
            text(
              `Do you want to ${curve} sign "${message}" with the following public key?`,
            ),
            copyable(add0x(node.publicKey)),
          ]),
        },
      });

      if (!approved) {
        throw providerErrors.userRejectedRequest();
      }

      const messageBytes = valueToBytes(message);
      const privateKey = remove0x(node.privateKey);

      let signed;
      switch (curve) {
        case 'ed25519':
          signed = await signEd25519(messageBytes, privateKey);
          break;
        case 'secp256k1':
          signed = await signSecp256k1(messageBytes, privateKey);
          break;
        default:
          throw new Error(`Unsupported curve: ${String(curve)}.`);
      }

      return bytesToHex(signed);
    }

    default: {
      throw rpcErrors.methodNotFound({
        data: { method: request.method },
      });
    }
  }
};
