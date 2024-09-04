#!/usr/bin/env bash

echo "flattening code..."

npx hardhat flatten contracts/token/ERC1363/ERC1363.sol > dist/ERC1363.dist.sol
npx hardhat flatten contracts/token/ERC1363/extensions/ERC1363Mintable.sol > dist/ERC1363Mintable.dist.sol

echo "adjusting license..."

SEARCH="\/\/ SPDX-License-Identifier: MIT"
REPLACE=""

for contract in dist/*.sol; do 
    sed -i '' "s/$SEARCH/$REPLACE/g" $contract
    sed -i '' "1s;^;$SEARCH\n\n;" $contract
done
