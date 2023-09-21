// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/**
 * @title IERC1363Errors Interface
 * @dev Standard ERC1363 Errors
 */
interface IERC1363Errors {
    /**
     * @dev Indicates a failure with the token `receiver` as it can't be an EOA. Used in transfers.
     * @param receiver Address to which tokens are being transferred.
     */
    error ERC1363EOAReceiver(address receiver);

    /**
     * @dev Indicates a failure with the token `spender` as it can't be an EOA. Used in approvals.
     * @param spender Address that may be allowed to operate on tokens without being their owner.
     */
    error ERC1363EOASpender(address spender);

    /**
     * @dev Indicates a failure with the token `receiver`. Used in transfers.
     * @param receiver Address to which tokens are being transferred.
     */
    error ERC1363InvalidReceiver(address receiver);

    /**
     * @dev Indicates a failure with the token `spender`. Used in approvals.
     * @param spender Address that may be allowed to operate on tokens without being their owner.
     */
    error ERC1363InvalidSpender(address spender);
}
