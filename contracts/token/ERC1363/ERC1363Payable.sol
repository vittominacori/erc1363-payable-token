pragma solidity ^0.4.24;

// solium-disable-next-line max-len
import "openzeppelin-solidity/contracts/introspection/SupportsInterfaceWithLookup.sol";

import "./ERC1363BasicToken.sol";


/**
 * @title ERC1363Payable
 * @author Vittorio Minacori (@vittominacori)
 * @dev Implementation of a contract that wants to accept ERC1363 payments
 */
contract ERC1363Payable is ERC1363Receiver, SupportsInterfaceWithLookup {
  /**
   * @dev Magic value to be returned upon successful reception of ERC1363 tokens
   *  Equals to `bytes4(keccak256("onERC1363Received(address,address,uint256,bytes)"))`,
   *  which can be also obtained as `ERC1363Receiver(0).onERC1363Received.selector`
   */
  bytes4 private constant InterfaceId_ERC1363Receiver = 0xb64ff699;

  /*
   * Note: the ERC-165 identifier for the ERC1363 token.
   * 0x4bbee2df ===
   *   bytes4(keccak256('transferAndCall(address,uint256)')) ^
   *   bytes4(keccak256('transferAndCall(address,uint256,bytes)')) ^
   *   bytes4(keccak256('transferFromAndCall(address,address,uint256)')) ^
   *   bytes4(keccak256('transferFromAndCall(address,address,uint256,bytes)'))
   */
  bytes4 private constant InterfaceId_ERC1363 = 0x4bbee2df;

  event TokensReceived(
    address indexed _operator,
    address indexed _from,
    uint256 _value,
    bytes _data
  );

  // The ERC1363 token accepted
  ERC1363 public acceptedToken;

  /**
   * @param _acceptedToken Address of the token being accepted
   */
  constructor(ERC1363 _acceptedToken) public {
    require(_acceptedToken != address(0));
    require(
      ERC1363BasicToken(_acceptedToken).supportsInterface(InterfaceId_ERC1363)
    );

    acceptedToken = _acceptedToken;

    // register the supported interface to conform to ERC1363Receiver via ERC165
    _registerInterface(InterfaceId_ERC1363Receiver);
  }

  function onERC1363Received(
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

  /**
   * @dev Called after validating a `onERC1363Received`. Override this method to
   *  make your stuffs within your contract.
   * @param _operator The address which called `transferAndCall` or `transferFromAndCall` function
   * @param _from The address which are token transferred from
   * @param _value The amount of tokens transferred
   * @param _data Additional data with no specified format
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
}
