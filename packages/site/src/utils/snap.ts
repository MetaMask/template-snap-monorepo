import { defaultSnapOrigin } from '../config';
import { GetSnapsResponse } from '../types';

export const getSnaps = async (): Promise<GetSnapsResponse> => {
  return (await window.ethereum.request({
    method: 'wallet_getSnaps',
  })) as unknown as Promise<GetSnapsResponse>;
};

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
