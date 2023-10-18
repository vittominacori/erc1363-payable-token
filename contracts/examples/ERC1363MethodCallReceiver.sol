// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {IERC165, ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import {IERC1363Receiver} from "../token/ERC1363/IERC1363Receiver.sol";

/**
 * @title ERC1363MethodCallReceiver
 * @dev ERC1363MethodCallReceiver is an example contract allowing to test passing methods via abi encoded function call.
 */
contract ERC1363MethodCallReceiver is ERC165, IERC1363Receiver {
    /**
     * @dev Event for logging method call.
     * @param method The function that has been called.
     * @param param The function param.
     */
    event MethodCall(string method, string param);

    /**
     * @inheritdoc IERC165
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165) returns (bool) {
        return interfaceId == type(IERC1363Receiver).interfaceId || super.supportsInterface(interfaceId);
    }

    /*
     * @dev Whenever ERC1363 tokens are transferred to this contract via `transferAndCall` or `transferFromAndCall` this function is called.
     * In this example the abi encoded method passed in `data` is executed on this contract.
     */
    function onTransferReceived(address, address, uint256, bytes calldata data) public override returns (bytes4) {
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
