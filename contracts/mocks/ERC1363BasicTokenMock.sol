pragma solidity ^0.4.24;

import "../token/ERC1363/ERC1363BasicToken.sol";


// mock class using ERC1363BasicToken
contract ERC1363BasicTokenMock is ERC1363BasicToken {
  constructor(address _initialAccount, uint256 _initialBalance) public {
    balances[_initialAccount] = _initialBalance;
    totalSupply_ = _initialBalance;
  }
}
