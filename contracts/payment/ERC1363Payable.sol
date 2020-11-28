// SPDX-License-Identifier: MIT

pragma solidity ^0.7.0;

import "../token/ERC1363/IERC1363.sol";
import "../token/ERC1363/IERC1363Receiver.sol";
import "../token/ERC1363/IERC1363Spender.sol";

import "@openzeppelin/contracts/introspection/ERC165Checker.sol";

import "@openzeppelin/contracts/GSN/Context.sol";
import "@openzeppelin/contracts/introspection/ERC165.sol";

/**
 * @title ERC1363Payable
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev Implementation proposal of a contract that wants to accept ERC1363 payments
 */
contract ERC1363Payable is IERC1363Receiver, IERC1363Spender, ERC165, Context {
    using ERC165Checker for address;

    /**
     * @dev Magic value to be returned upon successful reception of ERC1363 tokens
     *  Equals to `bytes4(keccak256("onTransferReceived(address,address,uint256,bytes)"))`,
     *  which can be also obtained as `IERC1363Receiver(0).onTransferReceived.selector`
     */
    bytes4 internal constant _INTERFACE_ID_ERC1363_RECEIVER = 0x88a7ca5c;

    /**
     * @dev Magic value to be returned upon successful approval of ERC1363 tokens.
     * Equals to `bytes4(keccak256("onApprovalReceived(address,uint256,bytes)"))`,
     * which can be also obtained as `IERC1363Spender(0).onApprovalReceived.selector`
     */
    bytes4 internal constant _INTERFACE_ID_ERC1363_SPENDER = 0x7b04a2d0;

    /*
     * Note: the ERC-165 identifier for the ERC1363 token transfer
     * 0x4bbee2df ===
     *   bytes4(keccak256('transferAndCall(address,uint256)')) ^
     *   bytes4(keccak256('transferAndCall(address,uint256,bytes)')) ^
     *   bytes4(keccak256('transferFromAndCall(address,address,uint256)')) ^
     *   bytes4(keccak256('transferFromAndCall(address,address,uint256,bytes)'))
     */
    bytes4 private constant _INTERFACE_ID_ERC1363_TRANSFER = 0x4bbee2df;

    /*
     * Note: the ERC-165 identifier for the ERC1363 token approval
     * 0xfb9ec8ce ===
     *   bytes4(keccak256('approveAndCall(address,uint256)')) ^
     *   bytes4(keccak256('approveAndCall(address,uint256,bytes)'))
     */
    bytes4 private constant _INTERFACE_ID_ERC1363_APPROVE = 0xfb9ec8ce;

    /**
     * @dev Emitted when `amount` tokens are moved from one account (`sender`) to
     * this by operator (`operator`) using {transferAndCall} or {transferFromAndCall}.
     */
    event TokensReceived(
        address indexed operator,
        address indexed sender,
        uint256 amount,
        bytes data
    );

    /**
     * @dev Emitted when the allowance of this for a `sender` is set by
     * a call to {approveAndCall}. `amount` is the new allowance.
     */
    event TokensApproved(
        address indexed sender,
        uint256 amount,
        bytes data
    );

    // The ERC1363 token accepted
    IERC1363 private _acceptedToken;

    /**
     * @param acceptedToken_ Address of the token being accepted
     */
    constructor(IERC1363 acceptedToken_) {
        require(address(acceptedToken_) != address(0), "ERC1363Payable: acceptedToken is zero address");
        require(
            acceptedToken_.supportsInterface(_INTERFACE_ID_ERC1363_TRANSFER) &&
            acceptedToken_.supportsInterface(_INTERFACE_ID_ERC1363_APPROVE)
        );

        _acceptedToken = acceptedToken_;

        // register the supported interface to conform to IERC1363Receiver and IERC1363Spender via ERC165
        _registerInterface(_INTERFACE_ID_ERC1363_RECEIVER);
        _registerInterface(_INTERFACE_ID_ERC1363_SPENDER);
    }

    /*
     * @dev Note: remember that the token contract address is always the message sender.
     * @param operator The address which called `transferAndCall` or `transferFromAndCall` function
     * @param sender The address which are token transferred from
     * @param amount The amount of tokens transferred
     * @param data Additional data with no specified format
     */
    function onTransferReceived(address operator, address sender, uint256 amount, bytes memory data) public override returns (bytes4) {
        require(_msgSender() == address(_acceptedToken), "ERC1363Payable: acceptedToken is not message sender");

        emit TokensReceived(operator, sender, amount, data);

        _transferReceived(operator, sender, amount, data);

        return _INTERFACE_ID_ERC1363_RECEIVER;
    }

    /*
     * @dev Note: remember that the token contract address is always the message sender.
     * @param sender The address which called `approveAndCall` function
     * @param amount The amount of tokens to be spent
     * @param data Additional data with no specified format
     */
    function onApprovalReceived(address sender, uint256 amount, bytes memory data) public override returns (bytes4) {
        require(_msgSender() == address(_acceptedToken), "ERC1363Payable: acceptedToken is not message sender");

        emit TokensApproved(sender, amount, data);

        _approvalReceived(sender, amount, data);

        return _INTERFACE_ID_ERC1363_SPENDER;
    }

    /**
     * @dev The ERC1363 token accepted
     */
    function acceptedToken() public view returns (IERC1363) {
        return _acceptedToken;
    }

    /**
     * @dev Called after validating a `onTransferReceived`. Override this method to
     * make your stuffs within your contract.
     * @param operator The address which called `transferAndCall` or `transferFromAndCall` function
     * @param sender The address which are token transferred from
     * @param amount The amount of tokens transferred
     * @param data Additional data with no specified format
     */
    function _transferReceived(address operator, address sender, uint256 amount, bytes memory data) internal virtual {
        // optional override
    }

    /**
     * @dev Called after validating a `onApprovalReceived`. Override this method to
     * make your stuffs within your contract.
     * @param sender The address which called `approveAndCall` function
     * @param amount The amount of tokens to be spent
     * @param data Additional data with no specified format
     */
    function _approvalReceived(address sender, uint256 amount, bytes memory data) internal virtual {
        // optional override
    }
}
