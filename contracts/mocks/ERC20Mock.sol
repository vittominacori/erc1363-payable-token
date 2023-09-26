// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title ERC20Mock
 * @dev Very simple ERC20 Token example, where all tokens are pre-assigned to the creator.
 */
contract ERC20Mock is ERC20 {
    uint256 public constant INITIAL_SUPPLY = 10000 * (10 ** 18);

    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor() ERC20("TEST", "TEST") {
        _mint(_msgSender(), INITIAL_SUPPLY);
    }
}
