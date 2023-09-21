// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC165} from "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import {ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import {IERC1363} from "./IERC1363.sol";
import {IERC1363Receiver} from "./IERC1363Receiver.sol";
import {IERC1363Spender} from "./IERC1363Spender.sol";

/**
 * @title ERC1363
 * @dev Implementation of an ERC1363 interface.
 */
abstract contract ERC1363 is ERC20, IERC1363, ERC165 {
    /**
     * @dev See {IERC165-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return interfaceId == type(IERC1363).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @dev Transfer tokens to a specified address and then execute a callback on `to`.
     * @param to The address to transfer to.
     * @param amount The amount to be transferred.
     * @return A boolean that indicates if the operation was successful.
     */
    function transferAndCall(address to, uint256 amount) public virtual override returns (bool) {
        return transferAndCall(to, amount, "");
    }

    /**
     * @dev Transfer tokens to a specified address and then execute a callback on `to`.
     * @param to The address to transfer to
     * @param amount The amount to be transferred
     * @param data Additional data with no specified format
     * @return A boolean that indicates if the operation was successful.
     */
    function transferAndCall(address to, uint256 amount, bytes memory data) public virtual override returns (bool) {
        transfer(to, amount);
        _checkOnTransferReceived(_msgSender(), to, amount, data);
        return true;
    }

    /**
     * @dev Transfer tokens from one address to another and then execute a callback on `to`.
     * @param from The address which you want to send tokens from
     * @param to The address which you want to transfer to
     * @param amount The amount of tokens to be transferred
     * @return A boolean that indicates if the operation was successful.
     */
    function transferFromAndCall(address from, address to, uint256 amount) public virtual override returns (bool) {
        return transferFromAndCall(from, to, amount, "");
    }

    /**
     * @dev Transfer tokens from one address to another and then execute a callback on `to`.
     * @param from The address which you want to send tokens from
     * @param to The address which you want to transfer to
     * @param amount The amount of tokens to be transferred
     * @param data Additional data with no specified format
     * @return A boolean that indicates if the operation was successful.
     */
    function transferFromAndCall(
        address from,
        address to,
        uint256 amount,
        bytes memory data
    ) public virtual override returns (bool) {
        transferFrom(from, to, amount);
        _checkOnTransferReceived(from, to, amount, data);
        return true;
    }

    /**
     * @dev Approve spender to transfer tokens and then execute a callback on `spender`.
     * @param spender The address allowed to transfer to
     * @param amount The amount allowed to be transferred
     * @return A boolean that indicates if the operation was successful.
     */
    function approveAndCall(address spender, uint256 amount) public virtual override returns (bool) {
        return approveAndCall(spender, amount, "");
    }

    /**
     * @dev Approve spender to transfer tokens and then execute a callback on `spender`.
     * @param spender The address allowed to transfer to.
     * @param amount The amount allowed to be transferred.
     * @param data Additional data with no specified format.
     * @return A boolean that indicates if the operation was successful.
     */
    function approveAndCall(address spender, uint256 amount, bytes memory data) public virtual override returns (bool) {
        approve(spender, amount);
        _checkOnApprovalReceived(spender, amount, data);
        return true;
    }

    /**
     * @dev Private function to invoke {IERC1363Receiver-onTransferReceived} on a target address.
     * This will revert if the recipient doesn't accept the token transfer or if the target address is not a contract.
     * @param sender address Representing the previous owner of the given token amount
     * @param recipient address Target address that will receive the tokens
     * @param amount uint256 The amount mount of tokens to be transferred
     * @param data bytes Optional data to send along with the call
     */
    function _checkOnTransferReceived(address sender, address recipient, uint256 amount, bytes memory data) private {
        if (recipient.code.length == 0) {
            revert("ERC1363: transfer to non contract address");
        }

        try IERC1363Receiver(recipient).onTransferReceived(_msgSender(), sender, amount, data) returns (bytes4 retval) {
            require(retval == IERC1363Receiver.onTransferReceived.selector, "ERC1363: receiver returned wrong data");
        } catch (bytes memory reason) {
            if (reason.length == 0) {
                revert("ERC1363: transfer to non ERC1363Receiver implementer");
            } else {
                /// @solidity memory-safe-assembly
                assembly {
                    revert(add(32, reason), mload(reason))
                }
            }
        }
    }

    /**
     * @dev Private function to invoke {IERC1363Receiver-onApprovalReceived} on a target address.
     * This will revert if the recipient doesn't accept the token approval or if the target address is not a contract.
     * @param spender address The address which will spend the funds
     * @param amount uint256 The amount of tokens to be spent
     * @param data bytes Optional data to send along with the call
     */
    function _checkOnApprovalReceived(address spender, uint256 amount, bytes memory data) private {
        if (spender.code.length == 0) {
            revert("ERC1363: approve a non contract address");
        }

        try IERC1363Spender(spender).onApprovalReceived(_msgSender(), amount, data) returns (bytes4 retval) {
            require(retval == IERC1363Spender.onApprovalReceived.selector, "ERC1363: spender returned wrong data");
        } catch (bytes memory reason) {
            if (reason.length == 0) {
                revert("ERC1363: approve a non ERC1363Spender implementer");
            } else {
                /// @solidity memory-safe-assembly
                assembly {
                    revert(add(32, reason), mload(reason))
                }
            }
        }
    }
}
