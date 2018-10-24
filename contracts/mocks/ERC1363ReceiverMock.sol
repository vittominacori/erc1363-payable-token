pragma solidity ^0.4.24;

import "../token/ERC1363/ERC1363Receiver.sol";


// mock class using ERC1363Receiver
contract ERC1363ReceiverMock is ERC1363Receiver {
  bytes4 private _retval;
  bool private _reverts;

  event Received(
    address operator,
    address from,
    uint256 value,
    bytes data,
    uint256 gas
  );

  constructor(bytes4 retval, bool reverts) public {
    _retval = retval;
    _reverts = reverts;
  }

  function onTransferReceived(
    address operator,
    address from,
    uint256 value,
    bytes data
  )
    external
    returns (bytes4)
  {
    require(!_reverts);
    emit Received(
      operator,
      from,
      value,
      data,
      gasleft() // msg.gas was deprecated in solidityv0.4.21
    );
    return _retval;
  }
}
