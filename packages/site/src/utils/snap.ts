/**
 * Check if a snap ID is a local snap ID.
 * @param snapId - The snap ID.
 * @returns True if it's a local Snap otherwise return false.
 */
export const isLocalSnap = (snapId: string) => snapId.startsWith('local:');
