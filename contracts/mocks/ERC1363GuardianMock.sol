// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {ERC1363Guardian} from "../presets/ERC1363Guardian.sol";

// mock class using ERC1363Guardian
contract ERC1363GuardianMock is ERC1363Guardian {
    uint256 public transferAmount;
    uint256 public approvalAmount;

    function _transferReceived(address, address, address, uint256 value, bytes calldata) internal override {
        transferAmount += value;
    }

    function _approvalReceived(address, address, uint256 value, bytes calldata) internal override {
        approvalAmount += value;
    }
}
