#!/usr/bin/env bash

npx surya inheritance dist/ERC1363.dist.sol | dot -Tpng > analysis/inheritance-tree/ERC1363.png

npx surya graph dist/ERC1363.dist.sol | dot -Tpng > analysis/control-flow/ERC1363.png

npx surya mdreport analysis/description-table/ERC1363.md dist/ERC1363.dist.sol

npx sol2uml -hn dist/ERC1363.dist.sol -o analysis/uml/ERC1363.svg
