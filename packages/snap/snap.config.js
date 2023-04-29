const through = require('through2');

module.exports = {
  cliOptions: {
    src: './src/index.ts',
    port: 8080,
  },
  bundlerCustomizer: (bundler) => {
    bundler.transform(function () {
      let data = '';
      return through(
        function (buffer, _encoding, callback) {
          data += buffer;
          callback();
        },
        function (cb) {
          this.push("globalThis.Buffer = require('buffer/').Buffer;");
          this.push(data);
          cb();
        },
      );
    });
  },
};
