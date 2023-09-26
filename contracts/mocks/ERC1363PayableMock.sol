// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {IERC1363} from "../token/ERC1363/IERC1363.sol";
import {ERC1363Payable} from "../payment/ERC1363Payable.sol";

// mock class using ERC1363Payable
contract ERC1363PayableMock is ERC1363Payable {
    uint256 public transferNumber;
    uint256 public approvalNumber;

    constructor(IERC1363 acceptedToken) ERC1363Payable(acceptedToken) {}

    function _transferReceived(address operator, address from, uint256 value, bytes calldata data) internal override {
        transferNumber += 1;
        super._transferReceived(operator, from, value, data);
    }

    function _approvalReceived(address owner, uint256 value, bytes calldata data) internal override {
        approvalNumber += 1;
        super._approvalReceived(owner, value, data);
    }
}
