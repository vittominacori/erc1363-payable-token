#!/usr/bin/env bash



echo "flattening code..."

npx hardhat flatten contracts/token/ERC1363/ERC1363.sol > flat/ERC1363.flat.sol

echo "adjusting license..."

SEARCH="\/\/ SPDX-License-Identifier: MIT"
REPLACE=""

sed -i '' "s/$SEARCH/$REPLACE/g" flat/ERC1363.flat.sol
sed -i '' "1s;^;$SEARCH\n\n;" flat/ERC1363.flat.sol
