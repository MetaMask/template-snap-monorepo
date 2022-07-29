export const getSnaps = async () => {
  return await window.ethereum.request({
    method: 'wallet_getSnaps',
  });
};

export const connectSnap = async (
  snapOrigin?: string,
  params: Record<'version' | string, unknown> = {},
) => {
  const snapId = snapOrigin ?? defaultSnapOrigin;
};
