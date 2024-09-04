// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {ERC1363, ERC1363Utils} from "../ERC1363.sol";

/**
 * @title ERC1363Mintable
 * @dev Extension of ERC-1363 that adds a `_mintAndCall` method.
 */
abstract contract ERC1363Mintable is ERC1363 {
    /**
     * @dev Creates a `value` amount of tokens and assigns them to `account`, by transferring it from address(0).
     * Then calls `IERC1363Receiver::onTransferReceived` on `account`.
     */
    function _mintAndCall(address account, uint256 value) internal {
        _mintAndCall(account, value, "");
    }

    /**
     * @dev Creates a `value` amount of tokens and assigns them to `account`, by transferring it from address(0).
     * Then calls `IERC1363Receiver::onTransferReceived` on `account` with additional data.
     */
    function _mintAndCall(address account, uint256 value, bytes memory data) internal {
        _mint(account, value);
        ERC1363Utils.checkOnERC1363TransferReceived(_msgSender(), address(0), account, value, data);
    }
}
