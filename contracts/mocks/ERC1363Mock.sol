pragma solidity ^0.6.0;

import "../token/ERC1363/ERC1363.sol";

// mock class using ERC1363
contract ERC1363Mock is ERC1363 {

    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor(address initialAccount, uint256 initialBalance) public {
        _mint(initialAccount, initialBalance);
    }
}
