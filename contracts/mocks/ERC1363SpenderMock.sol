// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {IERC1363Spender} from "../token/ERC1363/IERC1363Spender.sol";

// mock class using IERC1363Spender
contract ERC1363SpenderMock is IERC1363Spender {
    enum RevertType {
        None,
        RevertWithoutMessage,
        RevertWithMessage,
        RevertWithCustomError,
        Panic
    }

    bytes4 private _retval;
    RevertType private _err;

    event Approved(address owner, uint256 value, bytes data);
    error CustomError(bytes4);

    constructor() {
        _retval = IERC1363Spender.onApprovalReceived.selector;
        _err = RevertType.None;
    }

    function setUp(bytes4 retval, RevertType err) public {
        _retval = retval;
        _err = err;
    }

    function onApprovalReceived(address owner, uint256 value, bytes calldata data) external returns (bytes4) {
        if (_err == RevertType.RevertWithoutMessage) {
            revert();
        } else if (_err == RevertType.RevertWithMessage) {
            revert("ERC1363SpenderMock: reverting");
        } else if (_err == RevertType.RevertWithCustomError) {
            revert CustomError(_retval);
        } else if (_err == RevertType.Panic) {
            uint256 a = uint256(0) / uint256(0);
            a;
        }

        emit Approved(owner, value, data);
        return _retval;
    }
}
