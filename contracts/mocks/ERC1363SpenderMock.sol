pragma solidity ^0.4.24;

import "../token/ERC1363/ERC1363Spender.sol";


// mock class using ERC1363Spender
contract ERC1363SpenderMock is ERC1363Spender {
  bytes4 _retval;
  bool _reverts;

  event Approved(
    address owner,
    uint256 value,
    bytes data,
    uint256 gas
  );

  constructor(bytes4 retval, bool reverts) public {
    _retval = retval;
    _reverts = reverts;
  }

  function onApprovalReceived(
    address owner,
    uint256 value,
    bytes data
  )
    external
    returns (bytes4)
  {
    require(!_reverts);
    emit Approved(
      owner,
      value,
      data,
      gasleft() // msg.gas was deprecated in solidityv0.4.21
    );
    return _retval;
  }
}
