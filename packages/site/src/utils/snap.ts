import { defaultSnapOrigin } from '../config';
import { GetSnapsResponse } from '../types';

/**
 * Get the installed snaps in MetaMask.
 *
 * @returns The snaps installed in MetaMask.
 */
export const getSnaps = async (): Promise<GetSnapsResponse> => {
  return (await window.ethereum.request({
    method: 'wallet_getSnaps',
  })) as unknown as GetSnapsResponse;
};

/**
 * Connect a snap to MetaMask.
 *
 * @param snapId - The ID of the snap.
 * @param params - The params to pass with the snap to connect.
 */
export const connectSnap = async (
  snapId: string = defaultSnapOrigin,
  params: Record<'version' | string, unknown> = {},
) => {
  await window.ethereum.request({
    method: 'wallet_enable',
    params: [
      {
        wallet_snap: {
          [snapId]: {
            ...params,
          },
        },
      },
    ],
  });
};

/**
 * Check if a snap is already installed in MetaMask.
 *
 * @param version - The version of the snap to install (optional).
 * @returns A boolean representing if the snap is installed in MetaMask.
 */
export const isSnapInstalled = async (version?: string): Promise<boolean> => {
  try {
    const snaps = await getSnaps();

    return Boolean(
      Object.values(snaps).find(
        (snap) =>
          snap.id === defaultSnapOrigin &&
          (!version || snap.version === version),
      ),
    );
  } catch (e) {
    console.log('Failed to obtain installed snaps', e);
    return false;
  }
};

/**
 * Invoke the "hello" method from the example snap.
 */

export const sendHello = async () => {
  await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: [
      defaultSnapOrigin,
      {
        method: 'hello',
      },
    ],
  });
};
