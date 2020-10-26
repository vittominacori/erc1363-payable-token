// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "../payment/ERC1363Payable.sol";

// mock class using ERC1363Payable
contract ERC1363PayableMock is ERC1363Payable {
    using SafeMath for uint256;

    uint256 public transferNumber;
    uint256 public approvalNumber;

    constructor(IERC1363 acceptedToken) ERC1363Payable(acceptedToken) {} // solhint-disable-line no-empty-blocks

    // solhint-disable-next-line no-unused-vars
    function _transferReceived(address /*operator*/, address /*from*/, uint256 /*value*/, bytes memory /*data*/) internal override {
        transferNumber = transferNumber.add(1);
    }

    // solhint-disable-next-line no-unused-vars
    function _approvalReceived(address /*owner*/, uint256 /*value*/, bytes memory /*data*/) internal override {
        approvalNumber = approvalNumber.add(1);
    }
}
