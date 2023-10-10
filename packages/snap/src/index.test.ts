import { installSnap } from '@metamask/snaps-jest';
import { expect } from '@jest/globals';
import { assert } from '@metamask/utils';

describe('onRpcRequest', () => {
  describe('getPublicKey', () => {
    it('returns a secp256k1 public key', async () => {
      const { request, close } = await installSnap();

      const response = await request({
        method: 'getPublicKey',
        params: {
          path: ['m', "44'", "1551'"],
          curve: 'secp256k1',
        },
      });

      expect(response).toRespondWith(
        '0x04237d3c3d7d80442704201691f8b05034cf7cff2e0f60afa77971f02ae640adb9654a5c736938c430fffccc883d42760eb1aaac3a2441485bfa817a089aae7ff5',
      );

      await close();
    });

    it('returns a ed25519 public key', async () => {
      const { request, close } = await installSnap();

      const response = await request({
        method: 'getPublicKey',
        params: {
          path: ['m', "44'", "1551'"],
          curve: 'ed25519',
        },
      });

      expect(response).toRespondWith(
        '0x00ff3c690d2a58db6d7f97e9ed0aa3455dd54a21246cf71492f36d60bb7c0a659f',
      );

      await close();
    });
  });

  describe('signMessage', () => {
    it('returns a secp256k1 signature', async () => {
      const { request, close } = await installSnap();

      const response = request({
        method: 'signMessage',
        params: {
          path: ['m', "44'", "1551'"],
          curve: 'secp256k1',
          message: 'some message',
        },
      });

      const ui = await response.getInterface();
      assert(ui.type === 'confirmation');
      await ui.ok();

      expect(await response).toRespondWith(
        '0x3044022037e40728bd555a0b18a9a60e56eb1c3ad3f691c13df947a95c177491a23e8a2f02206eb555dd3061ae3fb13292dc90f742111c4329397e2323746bfa2296a478e4f5',
      );

      await close();
    });

    it('returns a ed25519 signature', async () => {
      const { request, close } = await installSnap();

      const response = request({
        method: 'signMessage',
        params: {
          path: ['m', "44'", "1551'"],
          curve: 'ed25519',
          message: 'some message',
        },
      });

      const ui = await response.getInterface();
      assert(ui.type === 'confirmation');
      await ui.ok();

      expect(await response).toRespondWith(
        '0x83207c0ef4117e2cb70fdf6bcce4ed0b54ec2047332205f81f480744375b14ba1239738d0883c21285f96d60259070988b1095e45d7cbb6782393eba2dfdd903',
      );

      await close();
    });
  });
});
