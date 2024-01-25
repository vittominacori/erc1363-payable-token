// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

/**
 * @title IERC1363Errors
 * @dev Interface of the ERC-1363 custom errors following the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] rationale.
 */
interface IERC1363Errors {
    /**
     * @dev Indicates a failure with the token `receiver` as it can't be an EOA. Used in transfers.
     * @param receiver The address to which tokens are being transferred.
     */
    error ERC1363EOAReceiver(address receiver);

    /**
     * @dev Indicates a failure with the token `spender` as it can't be an EOA. Used in approvals.
     * @param spender The address which will spend the funds.
     */
    error ERC1363EOASpender(address spender);

    /**
     * @dev Indicates a failure with the token `receiver`. Used in transfers.
     * @param receiver The address to which tokens are being transferred.
     */
    error ERC1363InvalidReceiver(address receiver);

    /**
     * @dev Indicates a failure with the token `spender`. Used in approvals.
     * @param spender The address which will spend the funds.
     */
    error ERC1363InvalidSpender(address spender);

    /**
     * @dev Indicates a failure with the ERC-20 `transfer` during a `transferAndCall` operation. Used in transfers.
     * @param receiver The address to which tokens are being transferred.
     * @param value The amount of tokens to be transferred.
     */
    error ERC1363TransferFailed(address receiver, uint256 value);

    /**
     * @dev Indicates a failure with the ERC-20 `transferFrom` during a `transferFromAndCall` operation. Used in transfers.
     * @param sender The address from which to send tokens.
     * @param receiver The address to which tokens are being transferred.
     * @param value The amount of tokens to be transferred.
     */
    error ERC1363TransferFromFailed(address sender, address receiver, uint256 value);

    /**
     * @dev Indicates a failure with the ERC-20 `approve` during a `approveAndCall` operation. Used in approvals.
     * @param spender The address which will spend the funds.
     * @param value The amount of tokens to be spent.
     */
    error ERC1363ApproveFailed(address spender, uint256 value);
}
