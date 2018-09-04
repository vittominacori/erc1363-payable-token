# ERC-1363 Payable Token

[![Build Status](https://travis-ci.org/vittominacori/erc1363-payable-token.svg?branch=master)](https://travis-ci.org/vittominacori/erc1363-payable-token) 
[![Coverage Status](https://coveralls.io/repos/github/vittominacori/erc1363-payable-token/badge.svg?branch=master)](https://coveralls.io/github/vittominacori/erc1363-payable-token?branch=master) 

This is an implementation of the [ERC-1363 Payable Token](https://github.com/ethereum/EIPs/issues/1363) that defines a Payable Token and Receiver.

The ERC-1363 is an ERC-20 compatible token that can make a callback on the receiver contract to notify token transfers.
It can be used to create a token payable crowdsale, selling services for tokens, paying invoices, making subscriptions, use them for a specific utility and many other purposes.

This proposal allows to implement an ERC-20 token that can be used for payments (like the `payable` keyword does for Ethereum). 


## Code


This repo contains:

* [ERC1363.sol](https://github.com/vittominacori/erc1363-payable-token/blob/master/contracts/token/ERC1363/ERC1363.sol)

Interface for a Payable Token contract as defined in [ERC-1363 Payable Token](https://github.com/ethereum/EIPs/issues/1363).

* [ERC1363BasicToken.sol](https://github.com/vittominacori/erc1363-payable-token/blob/master/contracts/token/ERC1363/ERC1363BasicToken.sol)

Implementation of an ERC1363 interface.

* [ERC1363Receiver.sol](https://github.com/vittominacori/erc1363-payable-token/blob/master/contracts/token/ERC1363/ERC1363Receiver.sol)

Interface for any contract that wants to support `transferAndCall` or `transferFromAndCall` from ERC1363 token contracts.

* [ERC1363Spender.sol](https://github.com/vittominacori/erc1363-payable-token/blob/master/contracts/token/ERC1363/ERC1363Spender.sol)

Interface for any contract that wants to support `approveAndCall` from ERC1363 token contracts.

* [ERC1363Payable.sol](https://github.com/vittominacori/erc1363-payable-token/blob/master/contracts/token/ERC1363/ERC1363Payable.sol)

Implementation of a contract that wants to accept ERC1363 payments. It intercepts what is the ERC1363 token desired for payments and throws is another is sent.   
It emits a `TokensReceived` event to notify the transfer received by the contract.  
It also implements a `transferReceived` function that can be overridden to make your stuffs within your contract after a `onERC1363Received`.  
It emits a `TokensApproved` event to notify the approval received by the contract.  
It also implements a `approvalReceived` function that can be overridden to make your stuffs within your contract after a `onERC1363Approved`. 

* [ERC1363PayableCrowdsale](https://github.com/vittominacori/erc1363-payable-token/blob/master/contracts/examples/ERC1363PayableCrowdsale.sol)

As example: an Implementation of a classic token Crowdsale, but paid with ERC1363 tokens instead of ETH.


## Installation


Install Truffle

```bash
npm install -g truffle      // Version 4.1.14+ required.
```


## Install dependencies


```bash
npm install
```


## Linter


Use Solium

```bash
npm run lint:sol
```

Use ESLint

```bash
npm run lint:js
```

Use both and fix

```bash
npm run lint:fix
```


## Compile and test the contracts
 

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
