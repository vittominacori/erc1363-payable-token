pragma solidity ^0.4.24;


/**
 * @title ERC20Receiver interface
 * @dev Interface for any contract that wants to support transferAndCall or transferFromAndCall
 *  from ERC20 token contracts.
 */
contract ERC20Receiver {
  /**
   * @dev Magic value to be returned upon successful reception of ERC20 tokens
   *  Equals to `bytes4(keccak256("onERC20Received(address,address,uint256,bytes)"))`,
   *  which can be also obtained as `ERC20Receiver(0).onERC20Received.selector`
   */
  bytes4 internal constant ERC20_RECEIVED = 0x4fc35859;

  /**
   * @notice Handle the receipt of ERC20 tokens
   * @dev Any ERC1363 smart contract calls this function on the recipient
   *  after a `transfer` or a `transferFrom`. This function MAY throw to revert and reject the
   *  transfer. Return of other than the magic value MUST result in the
   *  transaction being reverted.
   *  Note: the contract address is always the message sender.
   * @param _operator The address which called `transferAndCall` or `transferFromAndCall` function
   * @param _from The address which are token transferred from
   * @param _value The amount of tokens transferred
   * @param _data Additional data with no specified format
   * @return `bytes4(keccak256("onERC20Received(address,address,uint256,bytes)"))`
   *  unless throwing
   */
  function onERC20Received(address _operator, address _from, uint256 _value, bytes _data) external returns (bytes4); // solium-disable-line max-len, arg-overflow
}
