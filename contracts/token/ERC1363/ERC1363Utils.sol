// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {IERC1363Receiver} from "./IERC1363Receiver.sol";
import {IERC1363Spender} from "./IERC1363Spender.sol";

library ERC1363Utils {
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

    /**
     * @dev Performs a call to `IERC1363Receiver::onTransferReceived` on a target address.
     * This will revert if the target doesn't implement the `IERC1363Receiver` interface or
     * if the target doesn't accept the token transfer or
     * if the target address is not a contract.
     *
     * @param operator The address which performed the call.
     * @param from Address representing the previous owner of the given token amount.
     * @param to Target address that will receive the tokens.
     * @param value The amount of tokens to be transferred.
     * @param data Optional data to send along with the call.
     */
    function checkOnERC1363TransferReceived(
        address operator,
        address from,
        address to,
        uint256 value,
        bytes memory data
    ) internal {
        if (to.code.length == 0) {
            revert ERC1363EOAReceiver(to);
        }

        try IERC1363Receiver(to).onTransferReceived(operator, from, value, data) returns (bytes4 retval) {
            if (retval != IERC1363Receiver.onTransferReceived.selector) {
                revert ERC1363InvalidReceiver(to);
            }
        } catch (bytes memory reason) {
            if (reason.length == 0) {
                revert ERC1363InvalidReceiver(to);
            } else {
                assembly {
                    revert(add(32, reason), mload(reason))
                }
            }
        }
    }

    /**
     * @dev Performs a call to `IERC1363Spender::onApprovalReceived` on a target address.
     * This will revert if the target doesn't implement the `IERC1363Spender` interface or
     * if the target doesn't accept the token approval or
     * if the target address is not a contract.
     *
     * @param operator The address which performed the call.
     * @param spender The address which will spend the funds.
     * @param value The amount of tokens to be spent.
     * @param data Optional data to send along with the call.
     */
    function checkOnERC1363ApprovalReceived(
        address operator,
        address spender,
        uint256 value,
        bytes memory data
    ) internal {
        if (spender.code.length == 0) {
            revert ERC1363EOASpender(spender);
        }

        try IERC1363Spender(spender).onApprovalReceived(operator, value, data) returns (bytes4 retval) {
            if (retval != IERC1363Spender.onApprovalReceived.selector) {
                revert ERC1363InvalidSpender(spender);
            }
        } catch (bytes memory reason) {
            if (reason.length == 0) {
                revert ERC1363InvalidSpender(spender);
            } else {
                assembly {
                    revert(add(32, reason), mload(reason))
                }
            }
        }
    }
}
