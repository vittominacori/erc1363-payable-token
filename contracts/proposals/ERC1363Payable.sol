pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/introspection/ERC165Checker.sol";

import "../token/ERC1363/IERC1363.sol";
import "../token/ERC1363/ERC1363Receiver.sol";
import "../token/ERC1363/ERC1363Spender.sol";


/**
 * @title ERC1363Payable
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev Implementation proposal of a contract that wants to accept ERC1363 payments
 */
contract ERC1363Payable is ERC1363Receiver, ERC1363Spender, ERC165 { // solium-disable-line max-len
  using ERC165Checker for address;

  /**
   * @dev Magic value to be returned upon successful reception of ERC1363 tokens
   *  Equals to `bytes4(keccak256("onTransferReceived(address,address,uint256,bytes)"))`,
   *  which can be also obtained as `ERC1363Receiver(0).onTransferReceived.selector`
   */
  bytes4 internal constant InterfaceId_ERC1363Receiver = 0x88a7ca5c;

  /**
   * @dev Magic value to be returned upon successful approval of ERC1363 tokens
   *  Equals to `bytes4(keccak256("onApprovalReceived(address,uint256,bytes)"))`,
   *  which can be also obtained as `ERC1363Spender(0).onApprovalReceived.selector`
   */
  bytes4 internal constant InterfaceId_ERC1363Spender = 0x7b04a2d0;

  /*
   * Note: the ERC-165 identifier for the ERC1363 token transfer
   * 0x4bbee2df ===
   *   bytes4(keccak256('transferAndCall(address,uint256)')) ^
   *   bytes4(keccak256('transferAndCall(address,uint256,bytes)')) ^
   *   bytes4(keccak256('transferFromAndCall(address,address,uint256)')) ^
   *   bytes4(keccak256('transferFromAndCall(address,address,uint256,bytes)'))
   */
  bytes4 private constant InterfaceId_ERC1363Transfer = 0x4bbee2df;

  /*
   * Note: the ERC-165 identifier for the ERC1363 token approval
   * 0xfb9ec8ce ===
   *   bytes4(keccak256('approveAndCall(address,uint256)')) ^
   *   bytes4(keccak256('approveAndCall(address,uint256,bytes)'))
   */
  bytes4 private constant InterfaceId_ERC1363Approve = 0xfb9ec8ce;

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
    require(acceptedToken != address(0));
    require(
      acceptedToken.supportsInterface(InterfaceId_ERC1363Transfer) &&
      acceptedToken.supportsInterface(InterfaceId_ERC1363Approve)
    );

    _acceptedToken = acceptedToken;

    // register the supported interface to conform to ERC1363Receiver and ERC1363Spender via ERC165
    _registerInterface(InterfaceId_ERC1363Receiver);
    _registerInterface(InterfaceId_ERC1363Spender);
  }

  /*
   * @dev Note: remember that the token contract address is always the message sender.
   * @param operator address The address which called `transferAndCall` or `transferFromAndCall` function
   * @param from address The address which are token transferred from
   * @param value uint256 The amount of tokens transferred
   * @param data bytes Additional data with no specified format
   */
  function onTransferReceived(
    address operator,
    address from,
    uint256 value,
    bytes data
  )
    external
    returns (bytes4)
  {
    require(msg.sender == address(_acceptedToken));

    emit TokensReceived(
      operator,
      from,
      value,
      data
    );

    transferReceived(
      operator,
      from,
      value,
      data
    );

    return InterfaceId_ERC1363Receiver;
  }

  /*
   * @dev Note: remember that the token contract address is always the message sender.
   * @param owner address The address which called `approveAndCall` function
   * @param value uint256 The amount of tokens to be spent
   * @param data bytes Additional data with no specified format
   */
  function onApprovalReceived(
    address owner,
    uint256 value,
    bytes data
  )
    external
    returns (bytes4)
  {
    require(msg.sender == address(_acceptedToken));

    emit TokensApproved(
      owner,
      value,
      data
    );

    approvalReceived(
      owner,
      value,
      data
    );

    return InterfaceId_ERC1363Spender;
  }

  /**
   * @dev The ERC1363 token accepted
   */
  function acceptedToken() public view returns (IERC1363) {
    return _acceptedToken;
  }

  /**
   * @dev Called after validating a `onTransferReceived`. Override this method to
   *  make your stuffs within your contract.
   * @param operator address The address which called `transferAndCall` or `transferFromAndCall` function
   * @param from address The address which are token transferred from
   * @param value uint256 The amount of tokens transferred
   * @param data bytes Additional data with no specified format
   */
  function transferReceived(
    address operator,
    address from,
    uint256 value,
    bytes data
  )
    internal
  {
    // optional override
  }

  /**
   * @dev Called after validating a `onApprovalReceived`. Override this method to
   *  make your stuffs within your contract.
   * @param owner address The address which called `approveAndCall` function
   * @param value uint256 The amount of tokens to be spent
   * @param data bytes Additional data with no specified format
   */
  function approvalReceived(
    address owner,
    uint256 value,
    bytes data
  )
    internal
  {
    // optional override
  }
}
