module.exports = {
  cliOptions: {
    src: './src/index.ts',
    port: 8080,
  },
  bundlerCustomizer: (bundler) => {
    // eslint-disable-next-line node/global-require
    const through = require('through2');
    bundler.transform(function () {
      let data = '';
      return through(
        function (buf, _enc, cb) {
          data += buf;
          cb();
        },
        // eslint-disable-next-line consistent-return
        function (cb) {
          this.push("globalThis.Buffer = require('buffer/').Buffer;");
          this.push(data);
          cb();
        },
      );
    });
  },
};
