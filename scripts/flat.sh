#!/usr/bin/env bash

echo "flattening code..."

npx hardhat flatten contracts/token/ERC1363/ERC1363.sol > dist/ERC1363.dist.sol

echo "adjusting license..."

SEARCH="\/\/ SPDX-License-Identifier: MIT"
REPLACE=""

cd dist

for contract in *.sol; do 
    sed -i '' "s/$SEARCH/$REPLACE/g" $contract
    sed -i '' "1s;^;$SEARCH\n\n;" $contract
done
