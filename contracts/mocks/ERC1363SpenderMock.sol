pragma solidity ^0.4.24;

import "../token/ERC1363/ERC1363Spender.sol";


// mock class using ERC1363Spender
contract ERC1363SpenderMock is ERC1363Spender {
  bytes4 retval;
  bool reverts;

  event Approved(
    address owner,
    uint256 value,
    bytes data,
    uint256 gas
  );

  constructor(bytes4 _retval, bool _reverts) public {
    retval = _retval;
    reverts = _reverts;
  }

  function onApprovalReceived(
    address _owner,
    uint256 _value,
    bytes _data
  )
    external
    returns (bytes4)
  {
    require(!reverts);
    emit Approved(
      _owner,
      _value,
      _data,
      gasleft() // msg.gas was deprecated in solidityv0.4.21
    );
    return retval;
  }
}
