// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import "./IERC1363.sol";
import "./IERC1363Receiver.sol";
import "./IERC1363Spender.sol";

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/introspection/ERC165Checker.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/introspection/ERC165.sol";

/**
 * @title ERC1363
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev Implementation of an ERC1363 interface
 */
contract ERC1363 is ERC20, IERC1363, ERC165 {
    using Address for address;

    /*
     * Note: the ERC-165 identifier for this interface is 0x4bbee2df.
     * 0x4bbee2df ===
     *   bytes4(keccak256('transferAndCall(address,uint256)')) ^
     *   bytes4(keccak256('transferAndCall(address,uint256,bytes)')) ^
     *   bytes4(keccak256('transferFromAndCall(address,address,uint256)')) ^
     *   bytes4(keccak256('transferFromAndCall(address,address,uint256,bytes)'))
     */
    bytes4 internal constant _INTERFACE_ID_ERC1363_TRANSFER = 0x4bbee2df;

    /*
     * Note: the ERC-165 identifier for this interface is 0xfb9ec8ce.
     * 0xfb9ec8ce ===
     *   bytes4(keccak256('approveAndCall(address,uint256)')) ^
     *   bytes4(keccak256('approveAndCall(address,uint256,bytes)'))
     */
    bytes4 internal constant _INTERFACE_ID_ERC1363_APPROVE = 0xfb9ec8ce;

    // Equals to `bytes4(keccak256("onTransferReceived(address,address,uint256,bytes)"))`
    // which can be also obtained as `IERC1363Receiver(0).onTransferReceived.selector`
    bytes4 private constant _ERC1363_RECEIVED = 0x88a7ca5c;

    // Equals to `bytes4(keccak256("onApprovalReceived(address,uint256,bytes)"))`
    // which can be also obtained as `IERC1363Spender(0).onApprovalReceived.selector`
    bytes4 private constant _ERC1363_APPROVED = 0x7b04a2d0;

    /**
     * @param name Name of the token
     * @param symbol A symbol to be used as ticker
     */
    constructor (string memory name, string memory symbol) ERC20(name, symbol) {
        // register the supported interfaces to conform to ERC1363 via ERC165
        _registerInterface(_INTERFACE_ID_ERC1363_TRANSFER);
        _registerInterface(_INTERFACE_ID_ERC1363_APPROVE);
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
    function transferAndCall(address recipient, uint256 amount, bytes memory data) public virtual override returns (bool) {
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
    function transferFromAndCall(address sender, address recipient, uint256 amount) public virtual override returns (bool) {
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
    function transferFromAndCall(address sender, address recipient, uint256 amount, bytes memory data) public virtual override returns (bool) {
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
    function approveAndCall(address spender, uint256 amount, bytes memory data) public virtual override returns (bool) {
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
    function _checkAndCallTransfer(address sender, address recipient, uint256 amount, bytes memory data) internal virtual returns (bool) {
        if (!recipient.isContract()) {
            return false;
        }
        bytes4 retval = IERC1363Receiver(recipient).onTransferReceived(
            _msgSender(), sender, amount, data
        );
        return (retval == _ERC1363_RECEIVED);
    }

    /**
     * @dev Internal function to invoke `onApprovalReceived` on a target address
     *  The call is not executed if the target address is not a contract
     * @param spender address The address which will spend the funds
     * @param amount uint256 The amount of tokens to be spent
     * @param data bytes Optional data to send along with the call
     * @return whether the call correctly returned the expected magic value
     */
    function _checkAndCallApprove(address spender, uint256 amount, bytes memory data) internal virtual returns (bool) {
        if (!spender.isContract()) {
            return false;
        }
        bytes4 retval = IERC1363Spender(spender).onApprovalReceived(
            _msgSender(), amount, data
        );
        return (retval == _ERC1363_APPROVED);
    }
}
