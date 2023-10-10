# Sovereign SDK MetaMask Snap

The Sovereign SDK MetaMask Snap enables transaction signing for users.

This Snap is configured to use the designated [coin type 1551](https://github.com/satoshilabs/slips/blob/master/slip-0044.md#registered-coin-types), allocated for the SDK-Sovereign SDK. In accordance with Metamask's Snap permissions design, the coin type is hardcoded. If you require a different coin type, you can fork this repository and modify the authorized path in the [Snap manifest](./packages/snap/snap.md).

## Methods

#### `getPublicKey`

Returns the public key of the wallet as hexadecimal string.

##### Params

- `path`: The BIP-32 derivation path of the wallet (`string[]`).
- `curve`: The curve of the public key (`secp256k1` or `ed25519`).

##### Example

```typescript
const response = await request({
  method: 'getPublicKey',
  params: {
    path: ['m', "44'", "1551'"],
    curve: 'ed25519',
  },
});
if (
  !response ===
  '0x00c9aaf347832dc3b1dbb7aab4f41e5e04c64446b819c0761571c27b9f90eacb27'
) {
  throw new Error('Invalid public key');
}
```

#### `signMessage`

Returns the signature of the message as hexadecimal string.

Will emit a confirmation dialog for the user.

##### Params

- `path`: The BIP-32 derivation path of the wallet (`string['m', "44'", "1551'", ...]`).
- `curve`: The curve of the public key (`secp256k1` or `ed25519`).
- `message`: The message to sign (`bigint | number | string | Uint8Array`).

##### Example

```typescript
const response = request({
  method: 'signMessage',
  params: {
    path: ['m', "44'", "1551'", "1'"],
    curve: 'ed25519',
    message: 'some message',
  },
});
if (
  !response ===
  '0x10804459eef93e52f9f01f38775ce4a21eb818d70cb637c602267f48c4e129fb2f68bc24bf74c84a1950227ea76d7c1ce860e4867941ef793c83399621c69c0d'
) {
  throw new Error('Invalid signature');
}
```

## Testing

To test the snap, run `yarn test` in this directory. This will use [`@metamask/snaps-jest`](https://github.com/MetaMask/snaps/tree/main/packages/snaps-jest) to run the tests in `src/index.test.ts`.

If a change to the snap code was performed, you will need to run `yarn build` before the tests.
