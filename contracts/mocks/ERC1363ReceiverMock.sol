pragma solidity ^0.4.24;

import "../token/ERC1363/ERC1363Receiver.sol";


// mock class using ERC1363Receiver
contract ERC1363ReceiverMock is ERC1363Receiver {
  bytes4 retval;
  bool reverts;

  event Received(
    address operator,
    address from,
    uint256 value,
    bytes data,
    uint256 gas
  );

  constructor(bytes4 _retval, bool _reverts) public {
    retval = _retval;
    reverts = _reverts;
  }

  function onTransferReceived(
    address _operator,
    address _from,
    uint256 _value,
    bytes _data
  )
    external
    returns (bytes4)
  {
    require(!reverts);
    emit Received(
      _operator,
      _from,
      _value,
      _data,
      gasleft() // msg.gas was deprecated in solidityv0.4.21
    );
    return retval;
  }
}
