const fs = require('fs');

const inputBinaryFile = './external/sov-wasm/assets/sov-wasm.wasm';
const outputTsFile = 'packages/snap/src/module.ts';

const binaryData = fs.readFileSync(inputBinaryFile);
const byteArray = Array.from(binaryData);

const tsCode = `export const moduleBytes: Uint8Array = new Uint8Array(${JSON.stringify(
  byteArray,
)});`;

fs.writeFileSync(outputTsFile, tsCode);

console.log(`TypeScript file generated: ${outputTsFile}`);
