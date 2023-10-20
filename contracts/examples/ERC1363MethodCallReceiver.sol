// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {IERC1363Receiver} from "../token/ERC1363/IERC1363Receiver.sol";

/**
 * @title ERC1363MethodCallReceiver
 * @dev Implementation example of a contract that allows to test passing methods via abi encoded function call.
 *
 * IMPORTANT: This contract is for testing purpose only. When inheriting or copying from this contract,
 * you must include a way to use the received tokens, otherwise they will be stuck into the contract.
 */
contract ERC1363MethodCallReceiver is IERC1363Receiver {
    /**
     * @dev Event for logging method call.
     * @param method The function that has been called.
     * @param param The function param.
     */
    event MethodCall(string method, string param);

    /*
     * @dev Whenever ERC-1363 tokens are transferred to this contract via `transferAndCall` or `transferFromAndCall` this function is called.
     * In this example the abi encoded method passed in `data` is executed on this contract.
     */
    function onTransferReceived(address, address, uint256, bytes calldata data) external override returns (bytes4) {
        (bool success, ) = address(this).call(data);

        require(success, "Low level call failed");

        return this.onTransferReceived.selector;
    }

    /*
     * @dev A simple method without parameters. Just for testing purpose.
     */
    function methodWithoutParam() public {
        emit MethodCall("methodWithoutParam", "");
    }

    /*
     * @dev A simple method accepting parameters. Just for testing purpose.
     */
    function methodWithParam(string calldata param) public {
        emit MethodCall("methodWithParam", param);
    }
}
