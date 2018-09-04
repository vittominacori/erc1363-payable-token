pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/AddressUtils.sol";
// solium-disable-next-line max-len
import "openzeppelin-solidity/contracts/introspection/SupportsInterfaceWithLookup.sol";
import "openzeppelin-solidity/contracts/token/ERC20/StandardToken.sol";

import "./ERC1363.sol";
import "./ERC1363Receiver.sol";


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
  bytes4 internal constant InterfaceId_ERC1363 = 0x4bbee2df;

  // Equals to `bytes4(keccak256("onERC1363Received(address,address,uint256,bytes)"))`
  // which can be also obtained as `ERC1363Receiver(0).onERC1363Received.selector`
  bytes4 private constant ERC1363_RECEIVED = 0xb64ff699;

  constructor() public {
    // register the supported interface to conform to ERC1363 via ERC165
    _registerInterface(InterfaceId_ERC1363);
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

  /**
   * @dev Internal function to invoke `onERC1363Received` on a target address
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
    bytes4 retval = ERC1363Receiver(_to).onERC1363Received(
      msg.sender, _from, _value, _data
    );
    return (retval == ERC1363_RECEIVED);
  }
}
