// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {IERC20, ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {IERC165, ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import {IERC1363} from "./IERC1363.sol";
import {ERC1363Utils} from "./ERC1363Utils.sol";

/**
 * @title ERC1363
 * @dev Implementation of the ERC-1363 interface.
 *
 * Extension of ERC-20 tokens that supports executing code on a recipient contract after `transfer` or `transferFrom`, or code on a spender contract after `approve`, in a single transaction.
 */
abstract contract ERC1363 is ERC20, ERC165, IERC1363 {
    /**
     * @inheritdoc IERC165
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
        return interfaceId == type(IERC1363).interfaceId || super.supportsInterface(interfaceId);
    }

    /**
     * @inheritdoc IERC1363
     */
    function transferAndCall(address to, uint256 value) public virtual returns (bool) {
        return transferAndCall(to, value, "");
    }

    /**
     * @inheritdoc IERC1363
     */
    function transferAndCall(address to, uint256 value, bytes memory data) public virtual returns (bool) {
        if (!transfer(to, value)) {
            revert ERC1363Utils.ERC1363TransferFailed(to, value);
        }
        ERC1363Utils.checkOnERC1363TransferReceived(_msgSender(), _msgSender(), to, value, data);
        return true;
    }

    /**
     * @inheritdoc IERC1363
     */
    function transferFromAndCall(address from, address to, uint256 value) public virtual returns (bool) {
        return transferFromAndCall(from, to, value, "");
    }

    /**
     * @inheritdoc IERC1363
     */
    function transferFromAndCall(
        address from,
        address to,
        uint256 value,
        bytes memory data
    ) public virtual returns (bool) {
        if (!transferFrom(from, to, value)) {
            revert ERC1363Utils.ERC1363TransferFromFailed(from, to, value);
        }
        ERC1363Utils.checkOnERC1363TransferReceived(_msgSender(), from, to, value, data);
        return true;
    }

    /**
     * @inheritdoc IERC1363
     */
    function approveAndCall(address spender, uint256 value) public virtual returns (bool) {
        return approveAndCall(spender, value, "");
    }

    /**
     * @inheritdoc IERC1363
     */
    function approveAndCall(address spender, uint256 value, bytes memory data) public virtual returns (bool) {
        if (!approve(spender, value)) {
            revert ERC1363Utils.ERC1363ApproveFailed(spender, value);
        }
        ERC1363Utils.checkOnERC1363ApprovalReceived(_msgSender(), spender, value, data);
        return true;
    }
}
