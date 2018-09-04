pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/introspection/ERC165.sol";


/**
 * @title ERC1363 interface
 * @author Vittorio Minacori (@vittominacori)
 * @dev Interface for a Payable Token contract
 */
contract ERC1363 is ERC20, ERC165 {
  /*
   * Note: the ERC-165 identifier for this interface is 0x4bbee2df.
   * 0x4bbee2df ===
   *   bytes4(keccak256('transferAndCall(address,uint256)')) ^
   *   bytes4(keccak256('transferAndCall(address,uint256,bytes)')) ^
   *   bytes4(keccak256('transferFromAndCall(address,address,uint256)')) ^
   *   bytes4(keccak256('transferFromAndCall(address,address,uint256,bytes)'))
   */

  /**
   * @notice Transfer tokens from `msg.sender` to another address
   *  and then call `onERC1363Received` on receiver
   * @param _to address The address which you want to transfer to
   * @param _value uint256 The amount of tokens to be transferred
   * @return true unless throwing
   */
  function transferAndCall(address _to, uint256 _value) public returns (bool);

  /**
   * @notice Transfer tokens from `msg.sender` to another address
   *  and then call `onERC1363Received` on receiver
   * @param _to address The address which you want to transfer to
   * @param _value uint256 The amount of tokens to be transferred
   * @param _data bytes Additional data with no specified format, sent in call to `_to`
   * @return true unless throwing
   */
  function transferAndCall(address _to, uint256 _value, bytes _data) public returns (bool); // solium-disable-line max-len

  /**
   * @notice Transfer tokens from one address to another
   *  and then call `onERC1363Received` on receiver
   * @param _from address The address which you want to send tokens from
   * @param _to address The address which you want to transfer to
   * @param _value uint256 The amount of tokens to be transferred
   * @return true unless throwing
   */
  function transferFromAndCall(address _from, address _to, uint256 _value) public returns (bool); // solium-disable-line max-len


  /**
   * @notice Transfer tokens from one address to another
   *  and then call `onERC1363Received` on receiver
   * @param _from address The address which you want to send tokens from
   * @param _to address The address which you want to transfer to
   * @param _value uint256 The amount of tokens to be transferred
   * @param _data bytes Additional data with no specified format, sent in call to `_to`
   * @return true unless throwing
   */
  function transferFromAndCall(address _from, address _to, uint256 _value, bytes _data) public returns (bool); // solium-disable-line max-len, arg-overflow
}
