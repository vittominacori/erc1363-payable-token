// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {ERC1363Guardian} from "../examples/ERC1363Guardian.sol";

// mock class using ERC1363Guardian
contract ERC1363GuardianMock is ERC1363Guardian {
    uint256 public transferNumber;
    uint256 public approvalNumber;

    function _transferReceived(
        address token,
        address operator,
        address from,
        uint256 value,
        bytes calldata data
    ) internal override {
        transferNumber += 1;
        super._transferReceived(token, operator, from, value, data);
    }

    function _approvalReceived(address token, address owner, uint256 value, bytes calldata data) internal override {
        approvalNumber += 1;
        super._approvalReceived(token, owner, value, data);
    }
}
