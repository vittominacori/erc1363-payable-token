// SPDX-License-Identifier: MIT

pragma solidity ^0.8.20;

import {IERC1363} from "../token/ERC1363/IERC1363.sol";
import {ERC1363Guardian} from "./ERC1363Guardian.sol";

/**
 * @title ERC1363Payable
 * @dev Implementation of a contract that allows to accept ERC-1363 payments via transfers or approvals.
 *
 * IMPORTANT: When inheriting or copying from this contract, you must include a way to use the received tokens,
 * otherwise they will be stuck into the contract.
 */
contract ERC1363Payable is ERC1363Guardian {
    // The ERC-1363 token accepted
    address private _acceptedToken;

    /**
     * @dev Emitted if payment is done with a not accepted token.
     */
    error NotAcceptedToken(address provided, address required);

    /**
     * @dev Payment can be done only using the accepted token.
     */
    modifier onlyAcceptedToken() {
        if (msg.sender != _acceptedToken) {
            revert NotAcceptedToken(msg.sender, _acceptedToken);
        }
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
    function acceptedToken() public view returns (address) {
        return _acceptedToken;
    }

    /**
     * @inheritdoc ERC1363Guardian
     */
    function _transferReceived(
        address token,
        address operator,
        address from,
        uint256 value,
        bytes calldata data
    ) internal virtual override onlyAcceptedToken {
        // optional override

        super._transferReceived(token, operator, from, value, data);
    }

    /**
     * @inheritdoc ERC1363Guardian
     */
    function _approvalReceived(
        address token,
        address owner,
        uint256 value,
        bytes calldata data
    ) internal virtual override onlyAcceptedToken {
        // optional override
        // I.e. you could transfer the approved tokens into the `ERC1363Payable` contract by doing:
        // IERC20(token).transferFrom(owner, address(this), value);

        super._approvalReceived(token, owner, value, data);
    }
}
