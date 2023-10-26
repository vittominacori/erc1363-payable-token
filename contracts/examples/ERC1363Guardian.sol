// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {IERC1363Receiver} from "../token/ERC1363/IERC1363Receiver.sol";
import {IERC1363Spender} from "../token/ERC1363/IERC1363Spender.sol";

/**
 * @title ERC1363Guardian
 * @dev Implementation example of a contract that allows to accept ERC-1363 callbacks after transfers or approvals.
 *
 * IMPORTANT: This contract is for testing purpose only. When inheriting or copying from this contract,
 * you must include a way to use the received tokens, otherwise they will be stuck into the contract.
 */
contract ERC1363Guardian is IERC1363Receiver, IERC1363Spender {
    /**
     * @dev Emitted when a `value` amount of tokens `token` are moved from `from` to
     * this contract by `operator` using `transferAndCall` or `transferFromAndCall`.
     */
    event TokensReceived(
        address indexed token,
        address indexed operator,
        address indexed from,
        uint256 value,
        bytes data
    );

    /**
     * @dev Emitted when the allowance for token `token` of this contract for an `owner` is set by
     * a call to `approveAndCall`. `value` is the new allowance.
     */
    event TokensApproved(address indexed token, address indexed owner, uint256 value, bytes data);

    /*
     * @inheritdoc IERC1363Receiver
     */
    function onTransferReceived(
        address operator,
        address from,
        uint256 value,
        bytes calldata data
    ) external override returns (bytes4) {
        // The ERC-1363 contract is always the caller.
        address token = msg.sender;

        emit TokensReceived(token, operator, from, value, data);

        _transferReceived(token, operator, from, value, data);

        return this.onTransferReceived.selector;
    }

    /*
     * @inheritdoc IERC1363Spender
     */
    function onApprovalReceived(address owner, uint256 value, bytes calldata data) external override returns (bytes4) {
        // The ERC-1363 contract is always the caller.
        address token = msg.sender;

        emit TokensApproved(token, owner, value, data);

        _approvalReceived(token, owner, value, data);

        return this.onApprovalReceived.selector;
    }

    /**
     * @dev Called after validating a `onTransferReceived`. Override this method to make your stuff within your contract.
     * @param token The address of the token that was received.
     * @param operator The address which called `transferAndCall` or `transferFromAndCall` function.
     * @param from The address which are tokens transferred from.
     * @param value The amount of tokens transferred.
     * @param data Additional data with no specified format.
     */
    function _transferReceived(
        address token,
        address operator,
        address from,
        uint256 value,
        bytes calldata data
    ) internal virtual {
        // optional override
    }

    /**
     * @dev Called after validating a `onApprovalReceived`. Override this method to make your stuff within your contract.
     * @param token The address of the token that was approved.
     * @param owner The address which called `approveAndCall` function and previously owned the tokens.
     * @param value The amount of tokens to be spent.
     * @param data Additional data with no specified format.
     */
    function _approvalReceived(address token, address owner, uint256 value, bytes calldata data) internal virtual {
        // optional override
        // I.e. you could transfer the approved tokens into the `ERC1363Guardian` contract by doing:
        // IERC20(token).transferFrom(owner, address(this), value);
    }
}
