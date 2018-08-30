pragma solidity ^0.4.24;

import "../token/ERC20/ERC20Receiver.sol";


contract ERC20ReceiverMock is ERC20Receiver {
  bytes4 retval;
  bool reverts;

  event Received(
    address _operator,
    address _from,
    uint256 _value,
    bytes _data,
    uint256 _gas
  );

  constructor(bytes4 _retval, bool _reverts) public {
    retval = _retval;
    reverts = _reverts;
  }

  function onERC20Received(
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
