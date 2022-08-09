/**
 * Detect if the wallet injecting the ethereum object is Flask.
 */
export const isFlask = async () => {
  const provider = window.ethereum;

  const clientVersion = await provider?.request({
    method: 'web3_clientVersion',
  });

  const isFlaskDetected = (clientVersion as string[])?.includes('flask');

  return Boolean(provider && isFlaskDetected);
};
