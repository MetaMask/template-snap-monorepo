import type { MetaMaskInpageProvider } from '@metamask/providers';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

import { getSnapsProvider } from '../utils';

type MetaMaskContextType = {
  provider: MetaMaskInpageProvider | null;
  error: Error | undefined;
  setError: (error: Error) => void;
};

export const MetaMaskContext = createContext<MetaMaskContextType | null>(null);

/**
 * MetaMask context provider to handle MetaMask and snap status.
 *
 * @param props - React Props.
 * @param props.children - React component to be wrapped by the Provider.
 * @returns JSX.
 */
export const MetaMaskProvider = ({ children }: { children: ReactNode }) => {
  if (typeof window === 'undefined') {
    return <>{children}</>;
  }

  const [provider, setProvider] = useState<MetaMaskInpageProvider | null>(null);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    getSnapsProvider().then(setProvider).catch(console.error);
  }, []);

  useEffect(() => {
    let timeoutId: number;

    if (error) {
      timeoutId = window.setTimeout(() => {
        setError(undefined);
      }, 10000);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [error]);

  return (
    <MetaMaskContext.Provider value={{ provider, error, setError }}>
      {children}
    </MetaMaskContext.Provider>
  );
};

/**
 * Utility hook to consume the MetaMask context.
 * @returns The MetaMask context.
 */
export function useMetaMaskContext() {
  return useContext(MetaMaskContext) as MetaMaskContextType;
}
