pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";
import "openzeppelin-solidity/contracts/token/ERC20/SafeERC20.sol";
import "..//token/ERC1363/ERC1363.sol";
import "..//token/ERC1363/ERC1363Receiver.sol";
import "../token/ERC1363/ERC1363Payable.sol";



/**
 * @title ERC1363PayableCrowdsale
 * @author Vittorio Minacori (@vittominacori)
 * @dev ERC1363PayableCrowdsale is a base contract for managing a token crowdsale,
 * allowing investors to purchase tokens with ERC1363 tokens. This contract implements
 * such functionality in its most fundamental form and can be extended to provide additional
 * functionality and/or custom behavior.
 * The external interface represents the basic interface for purchasing tokens, and conform
 * the base architecture for crowdsales. They are *not* intended to be modified / overridden.
 * The internal interface conforms the extensible and modifiable surface of crowdsales. Override
 * the methods to add functionality. Consider using 'super' where appropriate to concatenate
 * behavior.
 */
contract ERC1363PayableCrowdsale is ERC1363Receiver, ERC1363Payable {
  using SafeMath for uint256;
  using SafeERC20 for ERC20;

  // The token being sold
  ERC20 public token;

  // Address where funds are collected
  address public wallet;

  // How many token units a buyer gets per ERC1363 token.
  uint256 public rate;

  // Amount of token raised
  uint256 public tokenRaised;

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
   * @param _rate Number of token units a buyer gets per ERC1363 token
   * @param _wallet Address where collected funds will be forwarded to
   * @param _token Address of the token being sold
   * @param _acceptedToken Address of the token being accepted
   */
  constructor(
    uint256 _rate,
    address _wallet,
    ERC20 _token,
    ERC1363 _acceptedToken
  )
    ERC1363Payable(_acceptedToken)
    public
  {
    require(_rate > 0);
    require(_wallet != address(0));
    require(_token != address(0));

    rate = _rate;
    wallet = _wallet;
    token = _token;
  }

  // -----------------------------------------
  // Internal interface (DO NOT OVERRIDE)
  // -----------------------------------------

  /**
   * @dev low level token purchase ***DO NOT OVERRIDE***
   * @param _operator The address which called `transferAndCall` or `transferFromAndCall` function
   * @param _from Address performing the token purchase
   * @param _value The amount of tokens transferred
   * @param _data Additional data with no specified format
   */
  function transferReceived(
    address _operator,
    address _from,
    uint256 _value,
    bytes _data
  )
    internal
  {
    uint256 sentTokenAmount = _value;
    _preValidatePurchase(sentTokenAmount);

    // calculate token amount to be created
    uint256 tokens = _getTokenAmount(sentTokenAmount);

    // update state
    tokenRaised = tokenRaised.add(sentTokenAmount);

    _processPurchase(_from, tokens);
    emit TokensPurchased(
      _operator,
      _from,
      sentTokenAmount,
      tokens
    );

    _updatePurchasingState(_from, sentTokenAmount);

    _forwardFunds(sentTokenAmount);
    _postValidatePurchase(_from, sentTokenAmount);
  }

  // -----------------------------------------
  // Internal interface (extensible)
  // -----------------------------------------

  /**
   * @dev Validation of an incoming purchase. Use require statements to revert state when conditions are not met. Use `super` in contracts that inherit from ERC1363PayableCrowdsale to extend their validations.
   * @param _sentTokenAmount Value in ERC1363 tokens involved in the purchase
   */
  function _preValidatePurchase(uint256 _sentTokenAmount) internal {
    require(_sentTokenAmount != 0);
  }

  /**
   * @dev Validation of an executed purchase. Observe state and use revert statements to undo rollback when valid conditions are not met.
   * @param _beneficiary Address performing the token purchase
   * @param _sentTokenAmount Value in ERC1363 tokens involved in the purchase
   */
  function _postValidatePurchase(
    address _beneficiary,
    uint256 _sentTokenAmount
  )
    internal
  {
    // optional override
  }

  /**
   * @dev Source of tokens. Override this method to modify the way in which the crowdsale ultimately gets and sends its tokens.
   * @param _beneficiary Address performing the token purchase
   * @param _tokenAmount Number of tokens to be emitted
   */
  function _deliverTokens(
    address _beneficiary,
    uint256 _tokenAmount
  )
    internal
  {
    token.safeTransfer(_beneficiary, _tokenAmount);
  }

  /**
   * @dev Executed when a purchase has been validated and is ready to be executed. Not necessarily emits/sends tokens.
   * @param _beneficiary Address receiving the tokens
   * @param _tokenAmount Number of tokens to be purchased
   */
  function _processPurchase(
    address _beneficiary,
    uint256 _tokenAmount
  )
    internal
  {
    _deliverTokens(_beneficiary, _tokenAmount);
  }

  /**
   * @dev Override for extensions that require an internal state to check for validity (current user contributions, etc.)
   * @param _beneficiary Address receiving the tokens
   * @param _sentTokenAmount Value in ERC1363 tokens involved in the purchase
   */
  function _updatePurchasingState(
    address _beneficiary,
    uint256 _sentTokenAmount
  )
    internal
  {
    // optional override
  }

  /**
   * @dev Override to extend the way in which ERC1363 tokens are converted to tokens.
   * @param _sentTokenAmount Value in ERC1363 tokens to be converted into tokens
   * @return Number of tokens that can be purchased with the specified _sentTokenAmount
   */
  function _getTokenAmount(uint256 _sentTokenAmount)
    internal view returns (uint256)
  {
    return _sentTokenAmount.mul(rate);
  }

  /**
   * @dev Determines how ERC1363 tokens are stored/forwarded on purchases.
   * @param _sentTokenAmount Value in ERC1363 tokens involved in the purchase
   */
  function _forwardFunds(uint256 _sentTokenAmount) internal {
    acceptedToken.transfer(wallet, _sentTokenAmount);
  }
}
