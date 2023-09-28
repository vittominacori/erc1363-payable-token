// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import {IERC1363} from "../token/ERC1363/IERC1363.sol";
import {ERC1363Payable} from "../payment/ERC1363Payable.sol";

/**
 * @title ERC1363PayableCrowdsale
 * @dev ERC1363PayableCrowdsale is a base contract for managing a token crowdsale,
 * allowing investors to purchase tokens with ERC1363 tokens. This contract implements
 * such functionality in its most fundamental form and can be extended to provide additional
 * functionality and/or custom behavior.
 * The internal interface conforms the extensible and modifiable surface of crowdsales. Override
 * the methods to add functionality. Consider using 'super' where appropriate to concatenate
 * behavior.
 */
contract ERC1363PayableCrowdsale is ERC1363Payable {
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
     * @dev Event for token purchase logging.
     * @param operator Who called function.
     * @param beneficiary Who got the tokens.
     * @param value ERC1363 tokens paid for purchase.
     * @param amount Amount of tokens purchased.
     */
    event TokensPurchased(address indexed operator, address indexed beneficiary, uint256 value, uint256 amount);

    /**
     * @param rate_ Number of token units a buyer gets per ERC1363 token.
     * @param wallet_ Address where collected funds will be forwarded to.
     * @param token_ Address of the token being sold.
     * @param acceptedToken_ Address of the token being accepted.
     */
    constructor(uint256 rate_, address wallet_, IERC20 token_, IERC1363 acceptedToken_) ERC1363Payable(acceptedToken_) {
        require(rate_ > 0);
        require(wallet_ != address(0));
        require(address(token_) != address(0));

        _rate = rate_;
        _wallet = wallet_;
        _token = token_;
    }

    /**
     * @return The token being sold.
     */
    function token() public view returns (IERC20) {
        return _token;
    }

    /**
     * @return The address where funds are collected.
     */
    function wallet() public view returns (address) {
        return _wallet;
    }

    /**
     * @return The number of token units a buyer gets per ERC1363 token.
     */
    function rate() public view returns (uint256) {
        return _rate;
    }

    /**
     * @return The amount of ERC1363 token raised.
     */
    function tokenRaised() public view returns (uint256) {
        return _tokenRaised;
    }

    /**
     * @inheritdoc ERC1363Payable
     */
    function _transferReceived(address operator, address from, uint256 value, bytes calldata data) internal override {
        _buyTokens(operator, from, value, data);
    }

    /**
     * @inheritdoc ERC1363Payable
     */
    function _approvalReceived(address owner, uint256 value, bytes calldata data) internal override {
        IERC20(acceptedToken()).safeTransferFrom(owner, address(this), value);
        _buyTokens(owner, owner, value, data);
    }

    /**
     * @dev Low level token purchase. Do not override.
     * @param operator The address which called `transferAndCall`, `transferFromAndCall` or `approveAndCall` function.
     * @param from Address performing the token purchase.
     * @param value The amount of tokens transferred.
     * @param data Additional data with no specified format.
     */
    function _buyTokens(address operator, address from, uint256 value, bytes calldata data) internal {
        uint256 sentTokenAmount = value;
        _preValidatePurchase(sentTokenAmount);

        // calculate token amount to be created
        uint256 tokens = _getTokenAmount(sentTokenAmount);

        // update state
        _tokenRaised += sentTokenAmount;

        _processPurchase(from, tokens);
        emit TokensPurchased(operator, from, sentTokenAmount, tokens);

        _updatePurchasingState(from, sentTokenAmount, data);

        _forwardFunds(sentTokenAmount);
        _postValidatePurchase(from, sentTokenAmount);
    }

    /**
     * @dev Validation of an incoming purchase.
     * Use require statements to revert state when conditions are not met.
     * Use `super` in contracts that inherit from ERC1363PayableCrowdsale to extend their validations.
     * @param sentTokenAmount Value in ERC1363 tokens involved in the purchase.
     */
    function _preValidatePurchase(uint256 sentTokenAmount) internal pure virtual {
        require(sentTokenAmount != 0);
    }

    /**
     * @dev Validation of an executed purchase.
     * Observe state and use revert statements to undo rollback when valid conditions are not met.
     * @param beneficiary Address performing the token purchase.
     * @param sentTokenAmount Value in ERC1363 tokens involved in the purchase.
     */
    function _postValidatePurchase(address beneficiary, uint256 sentTokenAmount) internal virtual {
        // optional override
    }

    /**
     * @dev Source of tokens.
     * Override this method to modify the way in which the crowdsale ultimately gets and sends its tokens.
     * @param beneficiary Address performing the token purchase.
     * @param tokenAmount Number of tokens to be emitted.
     */
    function _deliverTokens(address beneficiary, uint256 tokenAmount) internal virtual {
        _token.safeTransfer(beneficiary, tokenAmount);
    }

    /**
     * @dev Executed when a purchase has been validated and is ready to be executed. Not necessarily emits/sends tokens.
     * @param beneficiary Address receiving the tokens.
     * @param tokenAmount Number of tokens to be purchased.
     */
    function _processPurchase(address beneficiary, uint256 tokenAmount) internal virtual {
        _deliverTokens(beneficiary, tokenAmount);
    }

    /**
     * @dev Override for extensions that require an internal state to check for validity.
     * @param beneficiary Address receiving the tokens.
     * @param sentTokenAmount Value in ERC1363 tokens involved in the purchase.
     * @param data Additional data with no specified format (maybe a referral code).
     */
    function _updatePurchasingState(
        address beneficiary,
        uint256 sentTokenAmount,
        bytes calldata data
    ) internal virtual {
        // optional override
    }

    /**
     * @dev Override to extend the way in which ERC1363 tokens are converted to tokens.
     * @param sentTokenAmount Value in ERC1363 tokens to be converted into tokens.
     * @return Number of tokens that can be purchased with the specified `_sentTokenAmount`.
     */
    function _getTokenAmount(uint256 sentTokenAmount) internal view virtual returns (uint256) {
        return sentTokenAmount * _rate;
    }

    /**
     * @dev Determines how ERC1363 tokens are stored/forwarded on purchases.
     * @param sentTokenAmount Value in ERC1363 tokens involved in the purchase.
     */
    function _forwardFunds(uint256 sentTokenAmount) internal virtual {
        IERC20(acceptedToken()).safeTransfer(_wallet, sentTokenAmount);
    }
}
