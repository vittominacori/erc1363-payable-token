pragma solidity ^0.4.24;

import "./ERC1363.sol";


contract ERC1363Payable {

  // The ERC1363 token accepted
  ERC1363 public acceptedToken;

  /**
   * @param _acceptedToken Address of the token being accepted
   */
  constructor(ERC1363 _acceptedToken) public {
    require(_acceptedToken != address(0));

    acceptedToken = _acceptedToken;
  }

  /**
   * @dev Throws if called by any account other than the accepted token.
   */
  modifier tokenPayable() {
    require(msg.sender == address(acceptedToken));
    _;
  }
}
