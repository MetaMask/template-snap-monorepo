import detectEthereumProvider from '@metamask/detect-provider';

export const isFlask = async () => {
  const provider = await detectEthereumProvider();
  // @ts-expect-error no provider type
  const clientVersion = await provider?.request({
    method: 'web3_clientVersion',
  });

  const isFlaskDetected = clientVersion?.includes('flask');

  return Boolean(provider && isFlaskDetected);
};
