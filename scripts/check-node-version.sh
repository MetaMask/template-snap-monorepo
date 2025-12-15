```bash
#!/usr/bin/env bash
set -euo pipefail
```

# Checks that the current Node.js version roughly matches the one in .nvmrc.
# This is a small helper for contributors who don't use nvm directly.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT_DIR}"

if [ ! -f .nvmrc ]; then
  echo ".nvmrc not found in project root."
  exit 0
fi

EXPECTED_VERSION="$(tr -d ' \n' < .nvmrc)"
CURRENT_VERSION="$(node -v 2>/dev/null || echo "unknown")"

echo "Expected Node version (from .nvmrc): ${EXPECTED_VERSION}"
echo "Current Node version: ${CURRENT_VERSION}"

if [ "${CURRENT_VERSION}" = "unknown" ]; then
  echo "⚠️  Node.js is not available on PATH."
  exit 1
fi

if [ "${CURRENT_VERSION}" = "${EXPECTED_VERSION}" ]; then
  echo "✅ Node version matches .nvmrc."
else
  echo "⚠️  Node version differs from .nvmrc. Consider running 'nvm use'."
fi
