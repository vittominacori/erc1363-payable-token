pragma solidity ^0.4.24;

// solium-disable-next-line max-len
import "openzeppelin-solidity/contracts/introspection/SupportsInterfaceWithLookup.sol";

import "../token/ERC1363/ERC1363BasicToken.sol";


/**
 * @title ERC1363Payable
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev Implementation proposal of a contract that wants to accept ERC1363 payments
 */
contract ERC1363Payable is SupportsInterfaceWithLookup, ERC1363Receiver, ERC1363Spender { // solium-disable-line max-len
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
  ERC1363 public acceptedToken;

  /**
   * @param _acceptedToken Address of the token being accepted
   */
  constructor(ERC1363 _acceptedToken) public {
    require(_acceptedToken != address(0));
    require(
      ERC1363BasicToken(_acceptedToken).supportsInterface(InterfaceId_ERC1363Transfer) &&
      ERC1363BasicToken(_acceptedToken).supportsInterface(InterfaceId_ERC1363Approve)
    );

    acceptedToken = _acceptedToken;

    // register the supported interface to conform to ERC1363Receiver and ERC1363Spender via ERC165
    _registerInterface(InterfaceId_ERC1363Receiver);
    _registerInterface(InterfaceId_ERC1363Spender);
  }

  function onTransferReceived(
    address _operator,
    address _from,
    uint256 _value,
    bytes _data
  )
    external
    returns (bytes4)
  {
    require(msg.sender == address(acceptedToken));

    emit TokensReceived(
      _operator,
      _from,
      _value,
      _data
    );

    transferReceived(
      _operator,
      _from,
      _value,
      _data
    );

    return InterfaceId_ERC1363Receiver;
  }

  function onApprovalReceived(
    address _owner,
    uint256 _value,
    bytes _data
  )
    external
    returns (bytes4)
  {
    require(msg.sender == address(acceptedToken));

    emit TokensApproved(
      _owner,
      _value,
      _data
    );

    approvalReceived(
      _owner,
      _value,
      _data
    );

    return InterfaceId_ERC1363Spender;
  }

  /**
   * @dev Called after validating a `onTransferReceived`. Override this method to
   *  make your stuffs within your contract.
   * @param _operator address The address which called `transferAndCall` or `transferFromAndCall` function
   * @param _from address The address which are token transferred from
   * @param _value uint256 The amount of tokens transferred
   * @param _data bytes Additional data with no specified format
   */
  function transferReceived(
    address _operator,
    address _from,
    uint256 _value,
    bytes _data
  )
    internal
  {
    // optional override
  }

  /**
   * @dev Called after validating a `onApprovalReceived`. Override this method to
   *  make your stuffs within your contract.
   * @param _owner address The address which called `approveAndCall` function
   * @param _value uint256 The amount of tokens to be spent
   * @param _data bytes Additional data with no specified format
   */
  function approvalReceived(
    address _owner,
    uint256 _value,
    bytes _data
  )
    internal
  {
    // optional override
  }
}
