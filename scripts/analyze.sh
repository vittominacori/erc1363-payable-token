#!/usr/bin/env bash

npx surya inheritance flat/ERC1363.flat.sol | dot -Tpng > analysis/inheritance-tree/ERC1363.png

npx surya graph flat/ERC1363.flat.sol | dot -Tpng > analysis/control-flow/ERC1363.png

npx surya mdreport analysis/description-table/ERC1363.md flat/ERC1363.flat.sol

npx sol2uml -hn flat/ERC1363.flat.sol -o analysis/uml/ERC1363.svg
