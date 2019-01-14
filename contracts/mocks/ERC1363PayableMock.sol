pragma solidity ^0.4.25;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../proposals/ERC1363Payable.sol";


// mock class using ERC1363Payable
contract ERC1363PayableMock is ERC1363Payable {
  using SafeMath for uint256;

  uint256 public transferNumber;
  uint256 public approvalNumber;

  constructor(IERC1363 acceptedToken) ERC1363Payable(acceptedToken) public {}

  function _transferReceived(
    address operator,
    address from,
    uint256 value,
    bytes data
  )
    internal
  {
    transferNumber = transferNumber.add(1);
  }

  function _approvalReceived(
    address owner,
    uint256 value,
    bytes data
  )
    internal
  {
    approvalNumber = approvalNumber.add(1);
  }
}
