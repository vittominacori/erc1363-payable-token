// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import "../token/ERC1363/ERC1363.sol";

// mock class using ERC1363
contract ERC1363Mock is ERC1363 {

    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor (
        string memory name,
        string memory symbol,
        address initialAccount,
        uint256 initialBalance
    ) ERC1363(name, symbol) {
        _mint(initialAccount, initialBalance);
    }
}
