#!/bin/bash

set -u
set -o pipefail

rm .github/CODEOWNERS
rm .github/workflows/require-additional-reviewer.yml
rm -f scripts/cleanup.sh
git commit -am "Clean up undesired MetaMask GitHub files"
