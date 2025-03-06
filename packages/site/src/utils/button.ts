import { isLocalSnap } from './snap';
import type { Snap } from '../types';

export const shouldDisplayReconnectButton = (installedSnap: Snap | null) =>
  installedSnap && isLocalSnap(installedSnap?.id);
