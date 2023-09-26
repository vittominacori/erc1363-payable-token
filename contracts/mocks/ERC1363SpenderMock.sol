// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {IERC1363Spender} from "../token/ERC1363/IERC1363Spender.sol";

// mock class using IERC1363Spender
contract ERC1363SpenderMock is IERC1363Spender {
    bytes4 private _retval;
    bool private _reverts;

    event Approved(address owner, uint256 value, bytes data, uint256 gas);

    constructor(bytes4 retval, bool reverts) {
        _retval = retval;
        _reverts = reverts;
    }

    function onApprovalReceived(address owner, uint256 value, bytes calldata data) public override returns (bytes4) {
        require(!_reverts, "ERC1363SpenderMock: throwing");
        emit Approved(owner, value, data, gasleft());
        return _retval;
    }
}
