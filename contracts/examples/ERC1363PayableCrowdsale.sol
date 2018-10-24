pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/IERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "openzeppelin-solidity/contracts/utils/ReentrancyGuard.sol";
import "../proposals/ERC1363Payable.sol";


/**
 * @title ERC1363PayableCrowdsale
 * @author Vittorio Minacori (https://github.com/vittominacori)
 * @dev ERC1363PayableCrowdsale is a base contract for managing a token crowdsale,
 * allowing investors to purchase tokens with ERC1363 tokens. This contract implements
 * such functionality in its most fundamental form and can be extended to provide additional
 * functionality and/or custom behavior.
 * The internal interface conforms the extensible and modifiable surface of crowdsales. Override
 * the methods to add functionality. Consider using 'super' where appropriate to concatenate
 * behavior.
 */
contract ERC1363PayableCrowdsale is ERC1363Payable, ReentrancyGuard {
  using SafeMath for uint256;
  using SafeERC20 for IERC20;

  // The token being sold
  IERC20 private _token;

  // Address where funds are collected
  address private _wallet;

  // How many token units a buyer gets per ERC1363 token
  uint256 private _rate;

  // Amount of ERC1363 token raised
  uint256 private _tokenRaised;

  /**
   * Event for token purchase logging
   * @param operator who called function
   * @param beneficiary who got the tokens
   * @param value ERC1363 tokens paid for purchase
   * @param amount amount of tokens purchased
   */
  event TokensPurchased(
    address indexed operator,
    address indexed beneficiary,
    uint256 value,
    uint256 amount
  );

  /**
   * @param rate Number of token units a buyer gets per ERC1363 token
   * @param wallet Address where collected funds will be forwarded to
   * @param token Address of the token being sold
   * @param acceptedToken Address of the token being accepted
   */
  constructor(
    uint256 rate,
    address wallet,
    IERC20 token,
    IERC1363 acceptedToken
  )
    ERC1363Payable(acceptedToken)
    public
  {
    require(rate > 0);
    require(wallet != address(0));
    require(token != address(0));

    _rate = rate;
    _wallet = wallet;
    _token = token;
  }

  /**
   * @return the token being sold.
   */
  function token() public view returns(IERC20) {
    return _token;
  }

  /**
   * @return the address where funds are collected.
   */
  function wallet() public view returns(address) {
    return _wallet;
  }

  /**
   * @return the number of token units a buyer gets per ERC1363 token.
   */
  function rate() public view returns(uint256) {
    return _rate;
  }

  /**
   * @return the amount of ERC1363 token raised.
   */
  function tokenRaised() public view returns (uint256) {
    return _tokenRaised;
  }

  // -----------------------------------------
  // Internal interface (DO NOT OVERRIDE)
  // -----------------------------------------

  /**
   * @dev This method is called after `onTransferReceived`.
   *  Note: remember that the token contract address is always the message sender.
   * @param operator The address which called `transferAndCall` or `transferFromAndCall` function
   * @param from Address performing the token purchase
   * @param value The amount of tokens transferred
   * @param data Additional data with no specified format
   */
  function _transferReceived(
    address operator,
    address from,
    uint256 value,
    bytes data
  )
    internal
  {
    _buyTokens(
      operator,
      from,
      value,
      data
    );
  }

  /**
   * @dev This method is called after `onApprovalReceived`.
   *  Note: remember that the token contract address is always the message sender.
   * @param owner address The address which called `approveAndCall` function
   * @param value uint256 The amount of tokens to be spent
   * @param data bytes Additional data with no specified format
   */
  function _approvalReceived(
    address owner,
    uint256 value,
    bytes data
  )
    internal
  {
    IERC20(acceptedToken()).transferFrom(owner, address(this), value);
    _buyTokens(
      owner,
      owner,
      value,
      data
    );
  }

  /**
   * @dev low level token purchase ***DO NOT OVERRIDE***
   * This function has a non-reentrancy guard, so it shouldn't be called by
   * another `nonReentrant` function.
   * @param operator The address which called `transferAndCall`, `transferFromAndCall` or `approveAndCall` function
   * @param from Address performing the token purchase
   * @param value The amount of tokens transferred
   * @param data Additional data with no specified format
   */
  function _buyTokens(
    address operator,
    address from,
    uint256 value,
    bytes data
  )
    internal
    nonReentrant
  {
    uint256 sentTokenAmount = value;
    _preValidatePurchase(sentTokenAmount);

    // calculate token amount to be created
    uint256 tokens = _getTokenAmount(sentTokenAmount);

    // update state
    _tokenRaised = _tokenRaised.add(sentTokenAmount);

    _processPurchase(from, tokens);
    emit TokensPurchased(
      operator,
      from,
      sentTokenAmount,
      tokens
    );

    _updatePurchasingState(from, sentTokenAmount, data);

    _forwardFunds(sentTokenAmount);
    _postValidatePurchase(from, sentTokenAmount);
  }

  // -----------------------------------------
  // Internal interface (extensible)
  // -----------------------------------------

  /**
   * @dev Validation of an incoming purchase. Use require statements to revert state when conditions are not met. Use `super` in contracts that inherit from ERC1363PayableCrowdsale to extend their validations.
   * @param sentTokenAmount Value in ERC1363 tokens involved in the purchase
   */
  function _preValidatePurchase(uint256 sentTokenAmount) internal {
    require(sentTokenAmount != 0);
  }

  /**
   * @dev Validation of an executed purchase. Observe state and use revert statements to undo rollback when valid conditions are not met.
   * @param beneficiary Address performing the token purchase
   * @param sentTokenAmount Value in ERC1363 tokens involved in the purchase
   */
  function _postValidatePurchase(
    address beneficiary,
    uint256 sentTokenAmount
  )
    internal
  {
    // optional override
  }

  /**
   * @dev Source of tokens. Override this method to modify the way in which the crowdsale ultimately gets and sends its tokens.
   * @param beneficiary Address performing the token purchase
   * @param tokenAmount Number of tokens to be emitted
   */
  function _deliverTokens(
    address beneficiary,
    uint256 tokenAmount
  )
    internal
  {
    _token.safeTransfer(beneficiary, tokenAmount);
  }

  /**
   * @dev Executed when a purchase has been validated and is ready to be executed. Not necessarily emits/sends tokens.
   * @param beneficiary Address receiving the tokens
   * @param tokenAmount Number of tokens to be purchased
   */
  function _processPurchase(
    address beneficiary,
    uint256 tokenAmount
  )
    internal
  {
    _deliverTokens(beneficiary, tokenAmount);
  }

  /**
   * @dev Override for extensions that require an internal state to check for validity (current user contributions, etc.)
   * @param beneficiary Address receiving the tokens
   * @param sentTokenAmount Value in ERC1363 tokens involved in the purchase
   * @param data Additional data with no specified format (Maybe a referral code)
   */
  function _updatePurchasingState(
    address beneficiary,
    uint256 sentTokenAmount,
    bytes data
  )
    internal
  {
    // optional override
  }

  /**
   * @dev Override to extend the way in which ERC1363 tokens are converted to tokens.
   * @param sentTokenAmount Value in ERC1363 tokens to be converted into tokens
   * @return Number of tokens that can be purchased with the specified _sentTokenAmount
   */
  function _getTokenAmount(
    uint256 sentTokenAmount
  )
    internal
    view
    returns (uint256)
  {
    return sentTokenAmount.mul(_rate);
  }

  /**
   * @dev Determines how ERC1363 tokens are stored/forwarded on purchases.
   * @param sentTokenAmount Value in ERC1363 tokens involved in the purchase
   */
  function _forwardFunds(uint256 sentTokenAmount) internal {
    IERC20(acceptedToken()).safeTransfer(_wallet, sentTokenAmount);
  }
}
