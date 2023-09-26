// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {IERC165, ERC165} from "@openzeppelin/contracts/utils/introspection/ERC165.sol";

import {IERC1363} from "../token/ERC1363/IERC1363.sol";
import {IERC1363Receiver} from "../token/ERC1363/IERC1363Receiver.sol";
import {IERC1363Spender} from "../token/ERC1363/IERC1363Spender.sol";

/**
 * @title ERC1363Payable
 * @dev Implementation example of a contract that wants to accept ERC1363 payments.
 */
contract ERC1363Payable is ERC165, IERC1363Receiver, IERC1363Spender {
    /**
     * @dev Emitted when a `value` amount of tokens are moved from `from` to
     * this contract by `operator` using `transferAndCall` or `transferFromAndCall`.
     */
    event TokensReceived(address indexed operator, address indexed from, uint256 value, bytes data);

    /**
     * @dev Emitted when the allowance of this contract for an `owner` is set by
     * a call to `approveAndCall`. `value` is the new allowance.
     */
    event TokensApproved(address indexed owner, uint256 value, bytes data);

    // The ERC1363 token accepted
    IERC1363 private _acceptedToken;

    /**
     * @param acceptedToken_ Address of the token being accepted
     */
    constructor(IERC1363 acceptedToken_) {
        require(address(acceptedToken_) != address(0), "ERC1363Payable: acceptedToken is zero address");
        require(acceptedToken_.supportsInterface(type(IERC1363).interfaceId));

        _acceptedToken = acceptedToken_;
    }

    /**
     * @inheritdoc IERC165
     */
    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165) returns (bool) {
        return
            interfaceId == type(IERC1363Receiver).interfaceId ||
            interfaceId == type(IERC1363Spender).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /*
     * NOTE: remember that the ERC1363 contract is always the caller.
     * @inheritdoc IERC1363Receiver
     */
    function onTransferReceived(
        address operator,
        address from,
        uint256 value,
        bytes calldata data
    ) public override returns (bytes4) {
        require(msg.sender == address(_acceptedToken), "ERC1363Payable: acceptedToken is not message sender");

        emit TokensReceived(operator, from, value, data);

        _transferReceived(operator, from, value, data);

        return this.onTransferReceived.selector;
    }

    /*
     * NOTE: remember that the ERC1363 contract is always the caller.
     * @inheritdoc IERC1363Spender
     */
    function onApprovalReceived(address owner, uint256 value, bytes calldata data) public override returns (bytes4) {
        require(msg.sender == address(_acceptedToken), "ERC1363Payable: acceptedToken is not message sender");

        emit TokensApproved(owner, value, data);

        _approvalReceived(owner, value, data);

        return this.onApprovalReceived.selector;
    }

    /**
     * @dev The ERC1363 token accepted
     */
    function acceptedToken() public view returns (IERC1363) {
        return _acceptedToken;
    }

    /**
     * @dev Called after validating a `onTransferReceived`. Override this method to
     * make your stuff within your contract.
     * @param operator The address which called `transferAndCall` or `transferFromAndCall` function
     * @param from The address which are tokens transferred from
     * @param value The amount of tokens transferred
     * @param data Additional data with no specified format
     */
    function _transferReceived(address operator, address from, uint256 value, bytes calldata data) internal virtual {
        // optional override
    }

    /**
     * @dev Called after validating a `onApprovalReceived`. Override this method to
     * make your stuff within your contract.
     * @param owner The address which called `approveAndCall` function and previously owned the tokens
     * @param value The amount of tokens to be spent
     * @param data Additional data with no specified format
     */
    function _approvalReceived(address owner, uint256 value, bytes calldata data) internal virtual {
        // optional override
    }
}
