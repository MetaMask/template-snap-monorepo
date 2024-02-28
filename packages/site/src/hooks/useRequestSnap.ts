import { defaultSnapOrigin } from '../config';
import { useMetaMask } from './useMetaMask';
import { useRequest } from './useRequest';

/**
 * Utility hook to wrap the `wallet_requestSnaps` method.
 * @param snapId - The requested Snap ID.
 * @param version - The requested version.
 * @returns The `wallet_requestSnaps` wrapper.
 */
export const useRequestSnap = (
  snapId = defaultSnapOrigin,
  version?: string,
) => {
  const request = useRequest();
  const { getSnap } = useMetaMask();

  /**
   * Request the Snap.
   */
  const requestSnap = async () => {
    await request({
      method: 'wallet_requestSnaps',
      params: {
        [snapId]: { version },
      },
    });

    await getSnap();
  };

  return requestSnap;
};
