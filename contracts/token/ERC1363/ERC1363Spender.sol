pragma solidity ^0.4.24;


/**
 * @title ERC1363Spender interface
 * @author Vittorio Minacori (@vittominacori)
 * @dev Interface for any contract that wants to support approveAndCall
 *  from ERC1363 token contracts as defined in
 *  https://github.com/ethereum/EIPs/issues/1363
 */
contract ERC1363Spender {
  /*
   * Note: the ERC-165 identifier for this interface is 0x7b04a2d0.
   * 0x7b04a2d0 === bytes4(keccak256("onApprovalReceived(address,uint256,bytes)"))
   */

  /**
   * @notice Handle the approval of ERC1363 tokens
   * @dev Any ERC1363 smart contract calls this function on the recipient
   *  after an `approve`. This function MAY throw to revert and reject the
   *  approval. Return of other than the magic value MUST result in the
   *  transaction being reverted.
   *  Note: the contract address is always the message sender.
   * @param _owner address The address which called `approveAndCall` function
   * @param _value uint256 The amount of tokens to be spent
   * @param _data bytes Additional data with no specified format
   * @return `bytes4(keccak256("onApprovalReceived(address,uint256,bytes)"))`
   *  unless throwing
   */
  function onApprovalReceived(address _owner, uint256 _value, bytes _data) external returns (bytes4); // solium-disable-line max-len
}
