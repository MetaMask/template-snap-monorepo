import type { SnapConfig } from '@metamask/snaps-cli';
import { merge } from '@metamask/snaps-cli';
import { resolve } from 'path';
import { ProvidePlugin } from 'webpack';

const config: SnapConfig = {
  bundler: 'webpack',
  input: resolve(__dirname, 'src/index.ts'),
  server: {
    port: 8080,
  },
  customizeWebpackConfig: (defaultConfig) =>
    merge(defaultConfig, {
      resolve: {
        fallback: {
          stream: require.resolve('stream-browserify'),
        },
      },
      plugins: [
        new ProvidePlugin({
          Buffer: ['buffer/', 'Buffer'],
        }),
      ],
    }),
};

export default config;