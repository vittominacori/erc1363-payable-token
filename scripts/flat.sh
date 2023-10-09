#!/usr/bin/env bash

echo "flattening code..."

npx hardhat flatten contracts/token/ERC1363/ERC1363.sol > dist/ERC1363.dist.sol

echo "adjusting license..."

SEARCH="\/\/ SPDX-License-Identifier: MIT"
REPLACE=""

sed -i '' "s/$SEARCH/$REPLACE/g" dist/ERC1363.dist.sol
sed -i '' "1s;^;$SEARCH\n\n;" dist/ERC1363.dist.sol
