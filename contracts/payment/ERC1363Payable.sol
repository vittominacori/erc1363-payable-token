pragma solidity ^0.5.9;

import "openzeppelin-solidity/contracts/introspection/ERC165Checker.sol";

import "../token/ERC1363/IERC1363.sol";
import "../token/ERC1363/IERC1363Receiver.sol";
import "../token/ERC1363/IERC1363Spender.sol";

/**
 * @title ERC1363Payable
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev Implementation proposal of a contract that wants to accept ERC1363 payments
 */
contract ERC1363Payable is IERC1363Receiver, IERC1363Spender, ERC165 {
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

    event TokensReceived(
        address indexed operator,
        address indexed from,
        uint256 value,
        bytes data
    );

    event TokensApproved(
        address indexed owner,
        uint256 value,
        bytes data
    );

    // The ERC1363 token accepted
    IERC1363 private _acceptedToken;

    /**
     * @param acceptedToken Address of the token being accepted
     */
    constructor(IERC1363 acceptedToken) public {
        require(address(acceptedToken) != address(0));
        require(
            acceptedToken.supportsInterface(_INTERFACE_ID_ERC1363_TRANSFER) &&
            acceptedToken.supportsInterface(_INTERFACE_ID_ERC1363_APPROVE)
        );

        _acceptedToken = acceptedToken;

        // register the supported interface to conform to IERC1363Receiver and IERC1363Spender via ERC165
        _registerInterface(_INTERFACE_ID_ERC1363_RECEIVER);
        _registerInterface(_INTERFACE_ID_ERC1363_SPENDER);
    }

    /*
     * @dev Note: remember that the token contract address is always the message sender.
     * @param operator address The address which called `transferAndCall` or `transferFromAndCall` function
     * @param from address The address which are token transferred from
     * @param value uint256 The amount of tokens transferred
     * @param data bytes Additional data with no specified format
     */
    function onTransferReceived(address operator, address from, uint256 value, bytes memory data) public returns (bytes4) { // solhint-disable-line  max-line-length
        require(msg.sender == address(_acceptedToken));

        emit TokensReceived(operator, from, value, data);

        _transferReceived(operator, from, value, data);

        return _INTERFACE_ID_ERC1363_RECEIVER;
    }

    /*
     * @dev Note: remember that the token contract address is always the message sender.
     * @param owner address The address which called `approveAndCall` function
     * @param value uint256 The amount of tokens to be spent
     * @param data bytes Additional data with no specified format
     */
    function onApprovalReceived(address owner, uint256 value, bytes memory data) public returns (bytes4) {
        require(msg.sender == address(_acceptedToken));

        emit TokensApproved(owner, value, data);

        _approvalReceived(owner, value, data);

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
     * @param operator address The address which called `transferAndCall` or `transferFromAndCall` function
     * @param from address The address which are token transferred from
     * @param value uint256 The amount of tokens transferred
     * @param data bytes Additional data with no specified format
     */
    function _transferReceived(address operator, address from, uint256 value, bytes memory data) internal {
        // solhint-disable-previous-line no-empty-blocks

        // optional override
    }

    /**
     * @dev Called after validating a `onApprovalReceived`. Override this method to
     * make your stuffs within your contract.
     * @param owner address The address which called `approveAndCall` function
     * @param value uint256 The amount of tokens to be spent
     * @param data bytes Additional data with no specified format
     */
    function _approvalReceived(address owner, uint256 value, bytes memory data) internal {
        // solhint-disable-previous-line no-empty-blocks

        // optional override
    }
}
