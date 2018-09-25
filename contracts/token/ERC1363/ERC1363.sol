pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/introspection/ERC165.sol";


/**
 * @title ERC1363 interface
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev Interface for a Payable Token contract as defined in
 *  https://github.com/ethereum/EIPs/issues/1363
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

  /*
   * Note: the ERC-165 identifier for this interface is 0xfb9ec8ce.
   * 0xfb9ec8ce ===
   *   bytes4(keccak256('approveAndCall(address,uint256)')) ^
   *   bytes4(keccak256('approveAndCall(address,uint256,bytes)'))
   */

  /**
   * @notice Transfer tokens from `msg.sender` to another address
   *  and then call `onTransferReceived` on receiver
   * @param _to address The address which you want to transfer to
   * @param _value uint256 The amount of tokens to be transferred
   * @return true unless throwing
   */
  function transferAndCall(address _to, uint256 _value) public returns (bool);

  /**
   * @notice Transfer tokens from `msg.sender` to another address
   *  and then call `onTransferReceived` on receiver
   * @param _to address The address which you want to transfer to
   * @param _value uint256 The amount of tokens to be transferred
   * @param _data bytes Additional data with no specified format, sent in call to `_to`
   * @return true unless throwing
   */
  function transferAndCall(address _to, uint256 _value, bytes _data) public returns (bool); // solium-disable-line max-len

  /**
   * @notice Transfer tokens from one address to another
   *  and then call `onTransferReceived` on receiver
   * @param _from address The address which you want to send tokens from
   * @param _to address The address which you want to transfer to
   * @param _value uint256 The amount of tokens to be transferred
   * @return true unless throwing
   */
  function transferFromAndCall(address _from, address _to, uint256 _value) public returns (bool); // solium-disable-line max-len


  /**
   * @notice Transfer tokens from one address to another
   *  and then call `onTransferReceived` on receiver
   * @param _from address The address which you want to send tokens from
   * @param _to address The address which you want to transfer to
   * @param _value uint256 The amount of tokens to be transferred
   * @param _data bytes Additional data with no specified format, sent in call to `_to`
   * @return true unless throwing
   */
  function transferFromAndCall(address _from, address _to, uint256 _value, bytes _data) public returns (bool); // solium-disable-line max-len, arg-overflow

  /**
   * @notice Approve the passed address to spend the specified amount of tokens on behalf of msg.sender
   *  and then call `onApprovalReceived` on spender
   *  Beware that changing an allowance with this method brings the risk that someone may use both the old
   *  and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
   *  race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
   *  https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
   * @param _spender address The address which will spend the funds
   * @param _value uint256 The amount of tokens to be spent
   */
  function approveAndCall(address _spender, uint256 _value) public returns (bool); // solium-disable-line max-len

  /**
   * @notice Approve the passed address to spend the specified amount of tokens on behalf of msg.sender
   *  and then call `onApprovalReceived` on spender
   *  Beware that changing an allowance with this method brings the risk that someone may use both the old
   *  and the new allowance by unfortunate transaction ordering. One possible solution to mitigate this
   *  race condition is to first reduce the spender's allowance to 0 and set the desired value afterwards:
   *  https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
   * @param _spender address The address which will spend the funds
   * @param _value uint256 The amount of tokens to be spent
   * @param _data bytes Additional data with no specified format, sent in call to `_spender`
   */
  function approveAndCall(address _spender, uint256 _value, bytes _data) public returns (bool); // solium-disable-line max-len
}
