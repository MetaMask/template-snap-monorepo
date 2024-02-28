import { useEffect, useState } from 'react';

import { defaultSnapOrigin } from '../config';
import type { GetSnapsResponse, Snap } from '../types';
import { useMetaMaskContext } from './MetamaskContext';
import { useRequest } from './useRequest';

/**
 * A Hook to retrieve usefull data from MetaMask.
 * @returns The informations.
 */
export const useMetaMask = () => {
  const { provider } = useMetaMaskContext();
  const request = useRequest();

  const [isFlask, setIsFlask] = useState(false);
  const [snapsDetected, setSnapsDetected] = useState(false);
  const [installedSnap, setInstalledSnap] = useState<Snap | undefined>(
    undefined,
  );

  /**
   * Detect if the version of MetaMask is Flask.
   */
  const detectFlask = async () => {
    const clientVersion = await request({
      method: 'web3_clientVersion',
    });

    const isFlaskDetected = (clientVersion as string[])?.includes('flask');

    setIsFlask(isFlaskDetected);
  };

  /**
   * Detect if Snaps is available in MetaMask.
   */
  const detectSnaps = () => {
    setSnapsDetected(provider !== null);
  };

  /**
   * Get the Snap informations from MetaMask.
   */
  const getSnap = async () => {
    const snaps = (await provider?.request({
      method: 'wallet_getSnaps',
    })) as unknown as GetSnapsResponse;

    const value = Object.values(snaps).find(
      (snap) => snap.id === defaultSnapOrigin,
    );

    setInstalledSnap(value);
  };

  useEffect(() => {
    const detect = async () => {
      detectSnaps();

      if (provider) {
        await detectFlask();
        await getSnap();
      }
    };

    detect().catch(console.error);
  }, [provider]);

  return { isFlask, snapsDetected, installedSnap, getSnap };
};
