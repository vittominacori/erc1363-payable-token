// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {IERC1363} from "../token/ERC1363/IERC1363.sol";
import {ERC1363Payable} from "../payment/ERC1363Payable.sol";

// mock class using ERC1363Payable
contract ERC1363PayableMock is ERC1363Payable {
    uint256 public transferNumber;
    uint256 public approvalNumber;

    constructor(IERC1363 acceptedToken) ERC1363Payable(acceptedToken) {}

    function _transferReceived(address spender, address sender, uint256 amount, bytes memory data) internal override {
        transferNumber += 1;
        super._transferReceived(spender, sender, amount, data);
    }

    function _approvalReceived(address sender, uint256 amount, bytes memory data) internal override {
        approvalNumber += 1;
        super._approvalReceived(sender, amount, data);
    }
}
