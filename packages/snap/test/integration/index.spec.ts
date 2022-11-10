import path from 'path';
import {
  Dappeteer,
  initSnapEnv,
  DappeteerPage,
  DappeteerBrowser,
} from '@chainsafe/dappeteer';

describe('snap', function () {
  let dappeteer: Dappeteer;
  let browser: DappeteerBrowser;
  let connectedPage: DappeteerPage;
  let snapId: string;

  beforeAll(async function () {
    ({ dappeteer, snapId, browser } = await initSnapEnv({
      automation: 'playwright',
      browser: 'chrome',
      snapIdOrLocation: path.resolve(__dirname, '../..'),
      hasPermissions: true,
      hasKeyPermissions: false,
    }));
    connectedPage = await dappeteer.page.browser().newPage();
    await connectedPage.goto('https://google.com');
  });

  afterAll(async function () {
    browser.close();
  });

  test('snap invoke should be true if dialog accepted', async function () {
    const resultPromise = dappeteer.snaps.invokeSnap(
      connectedPage,
      snapId,
      'hello',
    );
    await dappeteer.snaps.acceptDialog();
    const result = await resultPromise;
    expect(result).toBeTruthy();
  });

  test('snap invoke should be true if dialog accepted', async function () {
    const resultPromise = dappeteer.snaps.invokeSnap(
      connectedPage,
      snapId,
      'hello',
    );
    await dappeteer.snaps.rejectDialog();
    const result = await resultPromise;
    expect(result).toBeFalsy();
  });

  test('snap invoke should error on non supported method', async function () {
    try {
      await dappeteer.snaps.invokeSnap(connectedPage, snapId, 'invalid');
    } catch (e) {
      console.error(e);
      expect(e.message).toContain('Method not found.');
    }
  });
});
