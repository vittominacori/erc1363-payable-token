// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC1363} from "../token/ERC1363/ERC1363.sol";

/**
 * @title ERC1363
 * @dev Very simple ERC1363 Token example, where all tokens are pre-assigned to the creator.
 */
contract ERC1363Mock is ERC1363 {
    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor(address initialAccount, uint256 initialBalance) ERC20("TEST", "TEST") {
        _mint(initialAccount, initialBalance);
    }
}
