pragma solidity ^0.4.24;

// solium-disable-next-line max-len
import "openzeppelin-solidity/contracts/introspection/SupportsInterfaceWithLookup.sol";

import "../token/ERC1363/ERC1363Receiver.sol";
import "../token/ERC1363/ERC1363Payable.sol";


// solium-disable-next-line max-len
contract ERC1363PayableMock is ERC1363Receiver, ERC1363Payable, SupportsInterfaceWithLookup {
  /**
   * @dev Magic value to be returned upon successful reception of ERC1363 tokens
   *  Equals to `bytes4(keccak256("onERC1363Received(address,address,uint256,bytes)"))`,
   *  which can be also obtained as `ERC1363Receiver(0).onERC1363Received.selector`
   */
  bytes4 internal constant InterfaceId_ERC1363Receiver = 0xb64ff699;

  event Received(
    address _operator,
    address _from,
    uint256 _value,
    bytes _data,
    uint256 _gas
  );

  /**
   * @param _acceptedToken Address of the token being accepted
   */
  constructor(ERC1363 _acceptedToken) ERC1363Payable(_acceptedToken) public {
    // register the supported interface to conform to ERC1363Receiver via ERC165
    _registerInterface(InterfaceId_ERC1363Receiver);
  }

  function onERC1363Received(
    address _operator,
    address _from,
    uint256 _value,
    bytes _data
  )
    external
    tokenPayable
    returns (bytes4)
  {
    emit Received(
      _operator,
      _from,
      _value,
      _data,
      gasleft() // msg.gas was deprecated in solidityv0.4.21
    );
    return InterfaceId_ERC1363Receiver;
  }
}
