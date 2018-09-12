pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/AddressUtils.sol";
// solium-disable-next-line max-len
import "openzeppelin-solidity/contracts/introspection/SupportsInterfaceWithLookup.sol";
import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

import "./ERC1363.sol";
import "./ERC1363Receiver.sol";
import "./ERC1363Spender.sol";


/**
 * @title ERC1363BasicToken
 * @author Vittorio Minacori (@vittominacori)
 * @dev Implementation of an ERC1363 interface
 */
contract ERC1363BasicToken is SupportsInterfaceWithLookup, StandardToken, ERC1363 { // solium-disable-line max-len
  using AddressUtils for address;

  /*
   * Note: the ERC-165 identifier for this interface is 0x4bbee2df.
   * 0x4bbee2df ===
   *   bytes4(keccak256('transferAndCall(address,uint256)')) ^
   *   bytes4(keccak256('transferAndCall(address,uint256,bytes)')) ^
   *   bytes4(keccak256('transferFromAndCall(address,address,uint256)')) ^
   *   bytes4(keccak256('transferFromAndCall(address,address,uint256,bytes)'))
   */
  bytes4 internal constant InterfaceId_ERC1363Transfer = 0x4bbee2df;

  /*
   * Note: the ERC-165 identifier for this interface is 0xfb9ec8ce.
   * 0xfb9ec8ce ===
   *   bytes4(keccak256('approveAndCall(address,uint256)')) ^
   *   bytes4(keccak256('approveAndCall(address,uint256,bytes)'))
   */
  bytes4 internal constant InterfaceId_ERC1363Approve = 0xfb9ec8ce;

  // Equals to `bytes4(keccak256("onTransferReceived(address,address,uint256,bytes)"))`
  // which can be also obtained as `ERC1363Receiver(0).onTransferReceived.selector`
  bytes4 private constant ERC1363_RECEIVED = 0x88a7ca5c;

  // Equals to `bytes4(keccak256("onApprovalReceived(address,uint256,bytes)"))`
  // which can be also obtained as `ERC1363Spender(0).onApprovalReceived.selector`
  bytes4 private constant ERC1363_APPROVED = 0x7b04a2d0;

  constructor() public {
    // register the supported interfaces to conform to ERC1363 via ERC165
    _registerInterface(InterfaceId_ERC1363Transfer);
    _registerInterface(InterfaceId_ERC1363Approve);
  }

  function transferAndCall(
    address _to,
    uint256 _value
  )
    public
    returns (bool)
  {
    return transferAndCall(_to, _value, "");
  }

  function transferAndCall(
    address _to,
    uint256 _value,
    bytes _data
  )
    public
    returns (bool)
  {
    require(transfer(_to, _value));
    require(
      checkAndCallTransfer(
        msg.sender,
        _to,
        _value,
        _data
      )
    );
    return true;
  }

  function transferFromAndCall(
    address _from,
    address _to,
    uint256 _value
  )
    public
    returns (bool)
  {
    // solium-disable-next-line arg-overflow
    return transferFromAndCall(_from, _to, _value, "");
  }

  function transferFromAndCall(
    address _from,
    address _to,
    uint256 _value,
    bytes _data
  )
    public
    returns (bool)
  {
    require(transferFrom(_from, _to, _value));
    require(
      checkAndCallTransfer(
        _from,
        _to,
        _value,
        _data
      )
    );
    return true;
  }

  function approveAndCall(
    address _spender,
    uint256 _value
  )
    public
    returns (bool)
  {
    return approveAndCall(_spender, _value, "");
  }

  function approveAndCall(
    address _spender,
    uint256 _value,
    bytes _data
  )
    public
    returns (bool)
  {
    approve(_spender, _value);
    require(
      checkAndCallApprove(
        _spender,
        _value,
        _data
      )
    );
    return true;
  }

  /**
   * @dev Internal function to invoke `onTransferReceived` on a target address
   *  The call is not executed if the target address is not a contract
   * @param _from address Representing the previous owner of the given token value
   * @param _to address Target address that will receive the tokens
   * @param _value uint256 The amount mount of tokens to be transferred
   * @param _data bytes Optional data to send along with the call
   * @return whether the call correctly returned the expected magic value
   */
  function checkAndCallTransfer(
    address _from,
    address _to,
    uint256 _value,
    bytes _data
  )
    internal
    returns (bool)
  {
    if (!_to.isContract()) {
      return false;
    }
    bytes4 retval = ERC1363Receiver(_to).onTransferReceived(
      msg.sender, _from, _value, _data
    );
    return (retval == ERC1363_RECEIVED);
  }

  /**
   * @dev Internal function to invoke `onApprovalReceived` on a target address
   *  The call is not executed if the target address is not a contract
   * @param _spender address The address which will spend the funds
   * @param _value uint256 The amount of tokens to be spent
   * @param _data bytes Optional data to send along with the call
   * @return whether the call correctly returned the expected magic value
   */
  function checkAndCallApprove(
    address _spender,
    uint256 _value,
    bytes _data
  )
    internal
    returns (bool)
  {
    if (!_spender.isContract()) {
      return false;
    }
    bytes4 retval = ERC1363Spender(_spender).onApprovalReceived(
      msg.sender, _value, _data
    );
    return (retval == ERC1363_APPROVED);
  }
}
