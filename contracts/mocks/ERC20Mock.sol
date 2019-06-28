pragma solidity ^0.5.10;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

/**
 * @title ERC20Mock
 * @dev Very simple ERC20 Token example, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `ERC20` functions.
 */
contract ERC20Mock is ERC20 {

    uint256 public constant INITIAL_SUPPLY = 10000 * (10 ** 18);

    /**
     * @dev Constructor that gives msg.sender all of existing tokens.
     */
    constructor() public {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
}
