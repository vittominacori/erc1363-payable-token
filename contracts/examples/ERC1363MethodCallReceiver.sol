// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/ERC165.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165Checker.sol";

import "../token/ERC1363/IERC1363Receiver.sol";

/**
 * @title ERC1363MethodCallReceiver
 * @dev ERC1363MethodCallReceiver is an example contract allowing to test passing methods
 * via abi encoded function call.
 */
contract ERC1363MethodCallReceiver is IERC1363Receiver, ERC165 {
    using ERC165Checker for address;

    /**
     * Event for logging method call
     * @param method the function that has been called
     * @param param the function param
     */
    event MethodCall(string method, string param);

    constructor() {}

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165) returns (bool) {
        return interfaceId == type(IERC1363Receiver).interfaceId || super.supportsInterface(interfaceId);
    }

    /*
     * @dev Note: remember that the token contract address is always the message sender.
     * @param spender The address which called `transferAndCall` or `transferFromAndCall` function
     * @param sender The address which are token transferred from
     * @param amount The amount of tokens transferred
     * @param data Additional data with no specified format
     */
    function onTransferReceived(
        address /* spender */,
        address /* sender */,
        uint256 /* amount */,
        bytes memory data
    ) public override returns (bytes4) {
        (bool success, ) = address(this).call(data);

        require(success, "Low level call failed");

        return IERC1363Receiver.onTransferReceived.selector;
    }

    function methodWithoutParam() public {
        emit MethodCall("methodWithoutParam", "");
    }

    function methodWithParam(string memory param) public {
        emit MethodCall("methodWithParam", param);
    }
}
