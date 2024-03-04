import type { Snap } from '../types';
import { isLocalSnap } from './snap';

export const shouldDisplayReconnectButton = (installedSnap: Snap | null) =>
  installedSnap && isLocalSnap(installedSnap?.id);
