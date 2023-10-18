// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {IERC1363} from "../token/ERC1363/IERC1363.sol";
import {ERC1363Guardian} from "../examples/ERC1363Guardian.sol";

// mock class using ERC1363Guardian
contract ERC1363GuardianMock is ERC1363Guardian {
    uint256 public transferNumber;
    uint256 public approvalNumber;

    function _transferReceived(address operator, address from, uint256 value, bytes calldata data) internal override {
        transferNumber += 1;
        super._transferReceived(operator, from, value, data);
    }

    function _approvalReceived(address owner, uint256 value, bytes calldata data) internal override {
        approvalNumber += 1;
        super._approvalReceived(owner, value, data);
    }
}
