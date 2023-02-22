#!/bin/bash

set -u
set -o pipefail

rm .github/CODEOWNERS
rm .github/workflows/create-release-pr.yml
rm .github/workflows/publish-release.yml
rm -f scripts/cleanup.sh
git commit -am "Clean up undesired MetaMask GitHub files"
