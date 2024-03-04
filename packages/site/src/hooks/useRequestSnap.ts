import { defaultSnapOrigin } from '../config';
import { useRequest } from './useRequest';

/**
 * Utility hook to wrap the `wallet_requestSnaps` method.
 *
 * @param snapId - The requested Snap ID. Defaults to the snap ID specified in the
 * config.
 * @param version - The requested version.
 * @returns The `wallet_requestSnaps` wrapper.
 */
export const useRequestSnap = (
  snapId = defaultSnapOrigin,
  version?: string,
) => {
  const request = useRequest();

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
  };

  return requestSnap;
};
