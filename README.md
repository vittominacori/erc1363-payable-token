# ERC-1363 Payable Token

[![NPM Package](https://img.shields.io/npm/v/erc-payable-token.svg?style=flat-square)](https://www.npmjs.org/package/erc-payable-token) 
[![Build Status](https://travis-ci.org/vittominacori/erc1363-payable-token.svg?branch=master)](https://travis-ci.org/vittominacori/erc1363-payable-token) 
[![Coverage Status](https://coveralls.io/repos/github/vittominacori/erc1363-payable-token/badge.svg?branch=master)](https://coveralls.io/github/vittominacori/erc1363-payable-token?branch=master) 

This is an implementation of the [ERC-1363 Payable Token](https://github.com/ethereum/EIPs/issues/1363) that defines a Payable Token, a Token Receiver and a Token Spender.

The ERC-1363 is an ERC-20 compatible token that can make a callback on the receiver contract to notify token transfers or token approvals.
It can be used to create a token payable crowdsale, selling services for tokens, paying invoices, making subscriptions, use them for a specific utility and many other purposes.

This proposal allows to implement an ERC-20 token that can be used for payments (like the `payable` keyword does for Ethereum). 

## Install

```bash
npm install erc-payable-token
```

## Usage

```solidity
pragma solidity ^0.5.5;

import "erc-payable-token/contracts/token/ERC1363/ERC1363.sol";

contract MyToken is ERC1363 {
  // your stuff
}
```

## Code

This repo contains:

### IERC1363

[IERC1363.sol](https://github.com/vittominacori/erc1363-payable-token/blob/master/contracts/token/ERC1363/IERC1363.sol)

Interface for a Payable Token contract as defined in [ERC-1363 Payable Token](https://github.com/ethereum/EIPs/issues/1363).

### ERC1363

[ERC1363.sol](https://github.com/vittominacori/erc1363-payable-token/blob/master/contracts/token/ERC1363/ERC1363.sol)

Implementation of an IERC1363 interface.

### IERC1363Receiver

[IERC1363Receiver.sol](https://github.com/vittominacori/erc1363-payable-token/blob/master/contracts/token/ERC1363/IERC1363Receiver.sol)

Interface for any contract that wants to support `transferAndCall` or `transferFromAndCall` from ERC1363 token contracts.

### IERC1363Spender

[IERC1363Spender.sol](https://github.com/vittominacori/erc1363-payable-token/blob/master/contracts/token/ERC1363/IERC1363Spender.sol)

Interface for any contract that wants to support `approveAndCall` from ERC1363 token contracts.

### ERC1363Payable

[ERC1363Payable.sol](https://github.com/vittominacori/erc1363-payable-token/blob/master/contracts/proposals/ERC1363Payable.sol)

Implementation proposal of a contract that wants to accept ERC1363 payments. It intercepts what is the ERC1363 token desired for payments and throws is another is sent.   
It emits a `TokensReceived` event to notify the transfer received by the contract.  
It also implements a `transferReceived` function that can be overridden to make your stuffs within your contract after a `onTransferReceived`.  
It emits a `TokensApproved` event to notify the approval received by the contract.  
It also implements a `approvalReceived` function that can be overridden to make your stuffs within your contract after a `onApprovalReceived`. 

### ERC1363PayableCrowdsale

[ERC1363PayableCrowdsale.sol](https://github.com/vittominacori/erc1363-payable-token/blob/master/contracts/examples/ERC1363PayableCrowdsale.sol)

As example: an Implementation of a classic token Crowdsale, but paid with ERC1363 tokens instead of ETH.


## Development

Install Truffle

```bash
npm install -g truffle      // Version 5.0.7+ required
```

### Install dependencies

```bash
npm install
```

### Linter

Use Solhint

```bash
npm run lint:sol
```

Use ESLint

```bash
npm run lint:js
```

Use Eslint and fix

```bash
npm run lint:fix
```

### Compile and test the contracts
 
Open the Truffle console

```bash
truffle develop
```

Compile 

```bash
compile 
```

Test

```bash
test
```

## License

Code released under the [MIT License](https://github.com/vittominacori/erc1363-payable-token/blob/master/LICENSE).
