import path from 'path';
import {
  Dappeteer,
  DappeteerBrowser,
  DappeteerPage,
  initSnapEnv,
} from '@chainsafe/dappeteer';

const DAPP_PAGE = 'https://example.org';

describe('snap', function () {
  let metaMask: Dappeteer;
  let browser: DappeteerBrowser;
  let connectedPage: DappeteerPage;
  let snapId: string;

  beforeAll(async function () {
    ({ metaMask, snapId, browser } = await initSnapEnv({
      automation: 'playwright',
      snapIdOrLocation: path.resolve(__dirname, '../..'),
      installationSnapUrl: DAPP_PAGE,
    }));

    connectedPage = await metaMask.page.browser().newPage();
    await connectedPage.goto(DAPP_PAGE);
  });

  afterAll(async function () {
    await browser.close();
  });

  test('snap invoke should be true if dialog accepted', async function () {
    const resultPromise = metaMask.snaps.invokeSnap(
      connectedPage,
      snapId,
      'hello',
    );
    await metaMask.snaps.dialog.accept();
    const result = await resultPromise;
    expect(result).toBeTruthy();
  });

  test('snap invoke should be true if dialog rejected', async function () {
    const resultPromise = metaMask.snaps.invokeSnap(
      connectedPage,
      snapId,
      'hello',
    );
    await metaMask.snaps.dialog.reject();
    const result = await resultPromise;
    expect(result).toBeFalsy();
  });

  test('snap invoke should error on non supported method', async function () {
    try {
      await metaMask.snaps.invokeSnap(connectedPage, snapId, 'invalid');
    } catch (e) {
      console.error(e);
      expect(e.message).toContain('Method not found.');
    }
  });
});
