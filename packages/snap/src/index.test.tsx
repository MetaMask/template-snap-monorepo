import { expect } from '@jest/globals';
import { installSnap } from '@metamask/snaps-jest';
import { Box, Text, Bold } from '@metamask/snaps-sdk/jsx';

describe('onRpcRequest', () => {
  describe('hello', () => {
    it('shows a confirmation dialog', async () => {
      const { request } = await installSnap();

      const origin = 'Jest';
      const response = request({
        method: 'hello',
        origin,
      });

      const ui = await response.getInterface();
      expect(ui.type).toBe('confirmation');
      expect(ui).toRender(
        <Box>
          <Text>
            Hello, <Bold>{origin}</Bold>!
          </Text>
          <Text>This custom confirmation is just for display purposes.</Text>
          <Text>
            But you can edit the snap source code to make it do something, if
            you want to!
          </Text>
        </Box>,
      );

      await ui.ok();

      expect(await response).toRespondWith(true);
    });
  });

  it('throws an error if the requested method does not exist', async () => {
    const { request } = await installSnap();

    const response = await request({
      method: 'foo',
    });

    expect(response).toRespondWithError({
      code: -32603,
      message: 'Method not found.',
      stack: expect.any(String),
    });
  });
});
