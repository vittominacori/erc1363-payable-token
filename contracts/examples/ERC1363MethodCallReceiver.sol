// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {IERC165, ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import {IERC1363Receiver} from "../token/ERC1363/IERC1363Receiver.sol";

/**
 * @title ERC1363MethodCallReceiver
 * @dev ERC1363MethodCallReceiver is an example contract allowing test passing methods
 * via abi encoded function call.
 */
contract ERC1363MethodCallReceiver is ERC165, IERC1363Receiver {
    /**
     * Event for logging method call
     * @param method the function that has been called
     * @param param the function param
     */
    event MethodCall(string method, string param);

    constructor() {}

    /**
     * @inheritdoc IERC165
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165) returns (bool) {
        return interfaceId == type(IERC1363Receiver).interfaceId || super.supportsInterface(interfaceId);
    }

    /*
     * NOTE: remember that the ERC1363 contract is always the caller.
     * @inheritdoc IERC1363Receiver
     */
    function onTransferReceived(
        address /* operator */,
        address /* from */,
        uint256 /* value */,
        bytes calldata data
    ) public override returns (bytes4) {
        (bool success, ) = address(this).call(data);

        require(success, "Low level call failed");

        return IERC1363Receiver.onTransferReceived.selector;
    }

    function methodWithoutParam() public {
        emit MethodCall("methodWithoutParam", "");
    }

    function methodWithParam(string calldata param) public {
        emit MethodCall("methodWithParam", param);
    }
}
