pragma solidity ^0.4.24;


/**
 * @title ERC1363Receiver interface
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev Interface for any contract that wants to support transferAndCall or transferFromAndCall
 *  from ERC1363 token contracts as defined in
 *  https://github.com/ethereum/EIPs/issues/1363
 */
contract ERC1363Receiver {
  /*
   * Note: the ERC-165 identifier for this interface is 0x88a7ca5c.
   * 0x88a7ca5c === bytes4(keccak256("onTransferReceived(address,address,uint256,bytes)"))
   */

  /**
   * @notice Handle the receipt of ERC1363 tokens
   * @dev Any ERC1363 smart contract calls this function on the recipient
   *  after a `transfer` or a `transferFrom`. This function MAY throw to revert and reject the
   *  transfer. Return of other than the magic value MUST result in the
   *  transaction being reverted.
   *  Note: the token contract address is always the message sender.
   * @param _operator address The address which called `transferAndCall` or `transferFromAndCall` function
   * @param _from address The address which are token transferred from
   * @param _value uint256 The amount of tokens transferred
   * @param _data bytes Additional data with no specified format
   * @return `bytes4(keccak256("onTransferReceived(address,address,uint256,bytes)"))`
   *  unless throwing
   */
  function onTransferReceived(address _operator, address _from, uint256 _value, bytes _data) external returns (bytes4); // solium-disable-line max-len, arg-overflow
}
