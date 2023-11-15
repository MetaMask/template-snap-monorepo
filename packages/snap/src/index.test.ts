import { expect } from '@jest/globals';
import { installSnap } from '@metamask/snaps-jest';

describe('onRpcRequest', () => {
  it('throws an error if the requested method does not exist', async () => {
    const { request, close } = await installSnap();

    const response = await request({
      method: 'foo',
    });

    expect(response).toRespondWithError({
      code: -32603,
      message: 'Method not found.',
      stack: expect.any(String),
    });

    await close();
  });

  describe('getPublicKey', () => {
    it('returns a public key', async () => {
      const { request, close } = await installSnap();

      const response = await request({
        method: 'getPublicKey',
        params: {
          path: ['m', "44'", "1551'"],
        },
      });

      expect(response).toRespondWith(
        '0x00ff3c690d2a58db6d7f97e9ed0aa3455dd54a21246cf71492f36d60bb7c0a659f',
      );

      await close();
    });
  });

  describe('signTransaction', () => {
    it('returns a signed transaction', async () => {
      const { request, close } = await installSnap();

      const response = request({
        method: 'signTransaction',
        params: {
          path: ['m', "44'", "1551'"],
          transaction: {
            message:
              '{"bank":{"Freeze":{"token_address":"sov1lta047h6lta047h6lta047h6lta047h6lta047h6lta047h6ltaq5s0rwf"}}}',
            nonce: 0,
          },
        },
      });

      const ui = await response.getInterface();
      expect(ui.type).toBe('confirmation');

      await ui.ok();

      expect(await response).toRespondWith(
        '0x5168d0df9f83ae1cd4e7a55567ee9b854aae1a3d725d230c7595cc04e78d376013b15016a84a1674aee4d8758c9d879302048abef1735fdf3ea4000e8a4b720dff3c690d2a58db6d7f97e9ed0aa3455dd54a21246cf71492f36d60bb7c0a659f220000000004fafafafafafafafafafafafafafafafafafafafafafafafafafafafafafafafa0000000000000000',
      );

      await close();
    });
  });
});
