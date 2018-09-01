pragma solidity ^0.4.24;


/**
 * @title ERC1363Receiver interface
 * @author Vittorio Minacori (@vittominacori)
 * @dev Interface for any contract that wants to support transferAndCall or transferFromAndCall
 *  from ERC1363 token contracts.
 */
contract ERC1363Receiver {
  /*
   * Note: the ERC-165 identifier for this interface is 0xb64ff699.
   * 0xb64ff699 === bytes4(keccak256("onERC1363Received(address,address,uint256,bytes)"))
   */

  /**
   * @notice Handle the receipt of ERC1363 tokens
   * @dev Any ERC1363 smart contract calls this function on the recipient
   *  after a `transfer` or a `transferFrom`. This function MAY throw to revert and reject the
   *  transfer. Return of other than the magic value MUST result in the
   *  transaction being reverted.
   *  Note: the contract address is always the message sender.
   * @param _operator The address which called `transferAndCall` or `transferFromAndCall` function
   * @param _from The address which are token transferred from
   * @param _value The amount of tokens transferred
   * @param _data Additional data with no specified format
   * @return `bytes4(keccak256("onERC1363Received(address,address,uint256,bytes)"))`
   *  unless throwing
   */
  function onERC1363Received(address _operator, address _from, uint256 _value, bytes _data) external returns (bytes4); // solium-disable-line max-len, arg-overflow
}
