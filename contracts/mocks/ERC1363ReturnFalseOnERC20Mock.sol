// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {IERC20, ERC20, ERC1363} from "../token/ERC1363/ERC1363.sol";

// mock class testing an ERC-20 token that returns false
abstract contract ERC1363ReturnFalseOnERC20Mock is ERC1363 {
    function transfer(address, uint256) public pure override(IERC20, ERC20) returns (bool) {
        return false;
    }

    function transferFrom(address, address, uint256) public pure override(IERC20, ERC20) returns (bool) {
        return false;
    }

    function approve(address, uint256) public pure override(IERC20, ERC20) returns (bool) {
        return false;
    }
}
