pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "../token/ERC1363/ERC1363Payable.sol";


// mock class using ERC1363Payable
contract ERC1363PayableMock is ERC1363Payable {
  using SafeMath for uint256;

  uint256 public transferNumber;
  uint256 public approvalNumber;

  constructor(ERC1363 _acceptedToken) ERC1363Payable(_acceptedToken) public {}

  function transferReceived(
    address _operator,
    address _from,
    uint256 _value,
    bytes _data
  )
    internal
  {
    transferNumber = transferNumber.add(1);
  }

  function approvalReceived(
    address _owner,
    uint256 _value,
    bytes _data
  )
    internal
  {
    approvalNumber = approvalNumber.add(1);
  }
}
