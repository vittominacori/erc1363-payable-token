// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {IERC1363Receiver} from "../token/ERC1363/IERC1363Receiver.sol";

// mock class using IERC1363Receiver
contract ERC1363ReceiverMock is IERC1363Receiver {
    enum RevertType {
        None,
        RevertWithoutMessage,
        RevertWithMessage,
        RevertWithCustomError,
        Panic
    }

    bytes4 private _retval;
    RevertType private _err;

    event Received(address operator, address from, uint256 value, bytes data);
    error CustomError(bytes4);

    constructor() {
        _retval = IERC1363Receiver.onTransferReceived.selector;
        _err = RevertType.None;
    }

    function setUp(bytes4 retval, RevertType err) public {
        _retval = retval;
        _err = err;
    }

    function onTransferReceived(
        address operator,
        address from,
        uint256 value,
        bytes calldata data
    ) external returns (bytes4) {
        if (_err == RevertType.RevertWithoutMessage) {
            revert();
        } else if (_err == RevertType.RevertWithMessage) {
            revert("ERC1363ReceiverMock: reverting");
        } else if (_err == RevertType.RevertWithCustomError) {
            revert CustomError(_retval);
        } else if (_err == RevertType.Panic) {
            uint256 a = uint256(0) / uint256(0);
            a;
        }

        emit Received(operator, from, value, data);
        return _retval;
    }
}
