import { MetaMaskInpageProvider } from '@metamask/providers';

/*
 * Window type extension to support ethereum
 */

/* eslint-disable @typescript-eslint/consistent-type-definitions  */
/* eslint-disable import/unambiguous */
declare global {
  interface Window {
    ethereum: MetaMaskInpageProvider;
  }
}
