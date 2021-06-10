// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import "./IERC1363.sol";
import "./IERC1363Receiver.sol";
import "./IERC1363Spender.sol";

/**
 * @title ERC1363
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev Implementation of an ERC1363 interface
 */
abstract contract ERC1363 is ERC20, IERC1363, ERC165 {
    using Address for address;

    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return interfaceId == type(IERC1363).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @dev Transfer tokens to a specified address and then execute a callback on recipient.
     * @param recipient The address to transfer to.
     * @param amount The amount to be transferred.
     * @return A boolean that indicates if the operation was successful.
     */
    function transferAndCall(address recipient, uint256 amount) public virtual override returns (bool) {
        return transferAndCall(recipient, amount, "");
    }

    /**
     * @dev Transfer tokens to a specified address and then execute a callback on recipient.
     * @param recipient The address to transfer to
     * @param amount The amount to be transferred
     * @param data Additional data with no specified format
     * @return A boolean that indicates if the operation was successful.
     */
    function transferAndCall(
        address recipient,
        uint256 amount,
        bytes memory data
    ) public virtual override returns (bool) {
        transfer(recipient, amount);
        require(_checkAndCallTransfer(_msgSender(), recipient, amount, data), "ERC1363: _checkAndCallTransfer reverts");
        return true;
    }

    /**
     * @dev Transfer tokens from one address to another and then execute a callback on recipient.
     * @param sender The address which you want to send tokens from
     * @param recipient The address which you want to transfer to
     * @param amount The amount of tokens to be transferred
     * @return A boolean that indicates if the operation was successful.
     */
    function transferFromAndCall(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual override returns (bool) {
        return transferFromAndCall(sender, recipient, amount, "");
    }

    /**
     * @dev Transfer tokens from one address to another and then execute a callback on recipient.
     * @param sender The address which you want to send tokens from
     * @param recipient The address which you want to transfer to
     * @param amount The amount of tokens to be transferred
     * @param data Additional data with no specified format
     * @return A boolean that indicates if the operation was successful.
     */
    function transferFromAndCall(
        address sender,
        address recipient,
        uint256 amount,
        bytes memory data
    ) public virtual override returns (bool) {
        transferFrom(sender, recipient, amount);
        require(_checkAndCallTransfer(sender, recipient, amount, data), "ERC1363: _checkAndCallTransfer reverts");
        return true;
    }

    /**
     * @dev Approve spender to transfer tokens and then execute a callback on recipient.
     * @param spender The address allowed to transfer to
     * @param amount The amount allowed to be transferred
     * @return A boolean that indicates if the operation was successful.
     */
    function approveAndCall(address spender, uint256 amount) public virtual override returns (bool) {
        return approveAndCall(spender, amount, "");
    }

    /**
     * @dev Approve spender to transfer tokens and then execute a callback on recipient.
     * @param spender The address allowed to transfer to.
     * @param amount The amount allowed to be transferred.
     * @param data Additional data with no specified format.
     * @return A boolean that indicates if the operation was successful.
     */
    function approveAndCall(
        address spender,
        uint256 amount,
        bytes memory data
    ) public virtual override returns (bool) {
        approve(spender, amount);
        require(_checkAndCallApprove(spender, amount, data), "ERC1363: _checkAndCallApprove reverts");
        return true;
    }

    /**
     * @dev Internal function to invoke `onTransferReceived` on a target address
     *  The call is not executed if the target address is not a contract
     * @param sender address Representing the previous owner of the given token value
     * @param recipient address Target address that will receive the tokens
     * @param amount uint256 The amount mount of tokens to be transferred
     * @param data bytes Optional data to send along with the call
     * @return whether the call correctly returned the expected magic value
     */
    function _checkAndCallTransfer(
        address sender,
        address recipient,
        uint256 amount,
        bytes memory data
    ) internal virtual returns (bool) {
        if (!recipient.isContract()) {
            return false;
        }
        bytes4 retval = IERC1363Receiver(recipient).onTransferReceived(_msgSender(), sender, amount, data);
        return (retval == IERC1363Receiver(recipient).onTransferReceived.selector);
    }

    /**
     * @dev Internal function to invoke `onApprovalReceived` on a target address
     *  The call is not executed if the target address is not a contract
     * @param spender address The address which will spend the funds
     * @param amount uint256 The amount of tokens to be spent
     * @param data bytes Optional data to send along with the call
     * @return whether the call correctly returned the expected magic value
     */
    function _checkAndCallApprove(
        address spender,
        uint256 amount,
        bytes memory data
    ) internal virtual returns (bool) {
        if (!spender.isContract()) {
            return false;
        }
        bytes4 retval = IERC1363Spender(spender).onApprovalReceived(_msgSender(), amount, data);
        return (retval == IERC1363Spender(spender).onApprovalReceived.selector);
    }
}
