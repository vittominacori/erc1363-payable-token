// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {IERC1363, IERC20} from "../token/ERC1363/IERC1363.sol";
import {ERC1363Guardian} from "../presets/ERC1363Guardian.sol";

/**
 * @title ERC1363Payable
 * @dev Implementation of an example contract that allows to test accepting ERC-1363 deposits via transfers or approvals.
 *
 * IMPORTANT: This contract is for testing purpose only. Do not use in production.
 * When copying from this contract, you must include a way to use the received tokens,
 * otherwise they will be stuck into the contract.
 */
contract ERC1363Payable is ERC1363Guardian {
    // The ERC-1363 token accepted
    address private immutable _acceptedToken;

    // a mapping of each user credit
    mapping(address account => uint256) private _credits;

    /**
     * @dev Emitted if payment is done with a not accepted token.
     */
    error NotAcceptedToken(address provided, address required);

    /**
     * @dev Payment can be done only using the accepted token.
     */
    modifier onlyAcceptedToken() {
        _onlyAcceptedToken();
        _;
    }

    /**
     * @param acceptedToken_ Address of the token being accepted.
     */
    constructor(address acceptedToken_) {
        require(IERC1363(acceptedToken_).supportsInterface(type(IERC1363).interfaceId));

        _acceptedToken = acceptedToken_;
    }

    /**
     * @dev Returns the accepted token for payments.
     */
    function acceptedToken() external view returns (address) {
        return _acceptedToken;
    }

    /**
     * @dev Returns the value of tokens deposited by `account`.
     */
    function creditOf(address account) external view returns (uint256) {
        return _credits[account];
    }

    /**
     * @dev Checks that the caller is the accepted token.
     */
    function _onlyAcceptedToken() internal view {
        if (msg.sender != _acceptedToken) {
            revert NotAcceptedToken(msg.sender, _acceptedToken);
        }
    }

    /**
     * @inheritdoc ERC1363Guardian
     */
    function _transferReceived(
        address /* token */,
        address operator,
        address from,
        uint256 value,
        bytes calldata data
    ) internal override onlyAcceptedToken {
        _deposit(operator, from, value, data);
    }

    /**
     * @inheritdoc ERC1363Guardian
     */
    function _approvalReceived(
        address token,
        address owner,
        uint256 value,
        bytes calldata data
    ) internal override onlyAcceptedToken {
        // slither-disable-start unchecked-transfer
        // slither-disable-start arbitrary-send-erc20
        IERC20(token).transferFrom(owner, address(this), value);
        // slither-disable-end unchecked-transfer
        // slither-disable-end arbitrary-send-erc20

        _deposit(owner, owner, value, data);
    }

    function _deposit(address /* operator */, address from, uint256 value, bytes calldata /* data */) private {
        // you should do any check and then update user credits
        _credits[from] += value;
    }
}
