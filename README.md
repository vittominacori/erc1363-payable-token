# ERC-1363 Payable Token

[![NPM Package](https://img.shields.io/npm/v/erc-payable-token.svg?style=flat-square)](https://www.npmjs.org/package/erc-payable-token)
[![CI](https://github.com/vittominacori/erc1363-payable-token/actions/workflows/ci.yml/badge.svg)](https://github.com/vittominacori/erc1363-payable-token/actions/workflows/ci.yml)
[![Coverage Status](https://codecov.io/gh/vittominacori/erc1363-payable-token/graph/badge.svg)](https://codecov.io/gh/vittominacori/erc1363-payable-token)
[![MIT licensed](https://img.shields.io/github/license/vittominacori/erc1363-payable-token.svg)](https://github.com/vittominacori/erc1363-payable-token/blob/master/LICENSE)

---

[ERC-1363](https://eips.ethereum.org/EIPS/eip-1363) is an extension interface for ERC-20 tokens that supports executing code on a recipient contract after `transfer` or `transferFrom`, or code on a spender contract after `approve`, in a single transaction.

There is no way to execute code on a receiver/spender contract after ERC-20 transfers or approvals so, to perform an action, it is required to send another transaction.
This introduces complexity in UI development and friction on adoption as users must wait for the first transaction to be executed and then submit the second one. They must also pay GAS twice.

ERC-1363 makes tokens capable of performing actions more easily and working without the use of any off-chain listener.
It allows to make a callback on receiver/spender contracts, after transfers or approvals, in a single transaction.

The following are functions and callbacks introduced by ERC-1363:

* `transferAndCall` and `transferFromAndCall` will call an `onTransferReceived` on a `ERC1363Receiver` contract.
* `approveAndCall` will call an `onApprovalReceived` on a `ERC1363Spender` contract.

ERC-1363 tokens can be used for specific utilities in all cases that require a callback to be executed after a transfer or an approval received.
ERC-1363 is also useful for avoiding token loss or token locking in contracts by verifying the recipient contract's ability to handle tokens.

::: tip NOTE
**This repo contains the reference implementation of the official [ERC-1363](https://eips.ethereum.org/EIPS/eip-1363).**
:::

## Install

```bash
npm install erc-payable-token
```

## Usage

```solidity
pragma solidity ^0.8.20;

import {ERC1363} from "erc-payable-token/contracts/token/ERC1363/ERC1363.sol";

contract MyToken is ERC1363 {
    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        // your stuff
    }

  // your stuff
}
```

## Code

### IERC1363

[IERC1363.sol](https://github.com/vittominacori/erc1363-payable-token/blob/master/contracts/token/ERC1363/IERC1363.sol)

Interface of the ERC-1363 standard as defined in the [ERC-1363](https://eips.ethereum.org/EIPS/eip-1363).

```solidity
interface IERC1363 is IERC20, IERC165 {
    function transferAndCall(address to, uint256 value) external returns (bool);
    function transferAndCall(address to, uint256 value, bytes calldata data) external returns (bool);
    function transferFromAndCall(address from, address to, uint256 value) external returns (bool);
    function transferFromAndCall(address from, address to, uint256 value, bytes calldata data) external returns (bool);
    function approveAndCall(address spender, uint256 value) external returns (bool);
    function approveAndCall(address spender, uint256 value, bytes calldata data) external returns (bool);
}
```

### IERC1363Receiver

[IERC1363Receiver.sol](https://github.com/vittominacori/erc1363-payable-token/blob/master/contracts/token/ERC1363/IERC1363Receiver.sol)

Interface for any contract that wants to support `transferAndCall` or `transferFromAndCall` from ERC-1363 token contracts.

```solidity
interface IERC1363Receiver {
    function onTransferReceived(address spender, address sender, uint256 amount, bytes calldata data) external returns (bytes4);
}
```

### IERC1363Spender

[IERC1363Spender.sol](https://github.com/vittominacori/erc1363-payable-token/blob/master/contracts/token/ERC1363/IERC1363Spender.sol)

Interface for any contract that wants to support `approveAndCall` from ERC-1363 token contracts.

```solidity
interface IERC1363Spender {
    function onApprovalReceived(address sender, uint256 amount, bytes calldata data) external returns (bytes4);
}
```

### IERC1363Errors

[IERC1363Errors.sol](https://github.com/vittominacori/erc1363-payable-token/blob/master/contracts/token/ERC1363/IERC1363Errors.sol)

Interface of the ERC-1363 custom errors following the [ERC-6093](https://eips.ethereum.org/EIPS/eip-6093) rationale.

### ERC1363

[ERC1363.sol](https://github.com/vittominacori/erc1363-payable-token/blob/master/contracts/token/ERC1363/ERC1363.sol)

Implementation of the ERC-1363 interface.

The reference implementation of ERC-1363 that extends ERC-20 and adds support for executing code after transfers and approvals on recipient contracts.

::: tip NOTE 
`transferAndCall`, `transferFromAndCall` and `approveAndCall` revert if the recipient/spender is an EOA address. To transfer tokens to an EOA or approve it to spend tokens, use the ERC-20 `transfer`, `transferFrom` or `approve` methods.
:::

## Examples

::: warning IMPORTANT 
The example contracts are for testing purpose only. When inheriting or copying from these contracts, you must include a way to use the received tokens, otherwise they will be stuck into the contract.
:::

### ERC1363Guardian

[ERC1363Guardian.sol](https://github.com/vittominacori/erc1363-payable-token/blob/master/contracts/examples/ERC1363Guardian.sol)

As example: a contract that allows to accept ERC-1363 callbacks after transfers or approvals.

It emits a `TokensReceived` event to notify the transfer received by the contract.

It also implements a `_transferReceived` function that can be overridden to make your stuff within your contract after a `onTransferReceived`.

It emits a `TokensApproved` event to notify the approval received by the contract.

It also implements a `_approvalReceived` function that can be overridden to make your stuff within your contract after a `onApprovalReceived`.

### ERC1363MethodCallReceiver

[ERC1363MethodCallReceiver.sol](https://github.com/vittominacori/erc1363-payable-token/blob/master/contracts/examples/ERC1363MethodCallReceiver.sol)

As example: a contract that allows to test passing methods via abi encoded function call.

It executes the method passed via `data`. Methods emit a `MethodCall` event. 

## Documentation

* [Solidity API](https://github.com/vittominacori/erc1363-payable-token/tree/master/docs/index.md)

## Code Analysis

* [Control Flow](https://raw.githubusercontent.com/vittominacori/erc1363-payable-token/master/analysis/control-flow/ERC1363.png)
* [Description Table](https://github.com/vittominacori/erc1363-payable-token/blob/master/analysis/description-table/ERC1363.md)
* [Inheritance Tree](https://raw.githubusercontent.com/vittominacori/erc1363-payable-token/master/analysis/inheritance-tree/ERC1363.png)
* [UML](https://raw.githubusercontent.com/vittominacori/erc1363-payable-token/master/analysis/uml/ERC1363.svg)

## Development

### Install dependencies

```bash
npm install
```

### Compile

```bash
npm run compile
```

### Test

```bash
npm test
```

### Code Coverage

```bash
npm run coverage
```

### Linter

Check Solidity files

```bash
npm run lint:sol
```

Check JS/TS files

```bash
npm run lint:js
```

Fix JS and Solidity files

```bash
npm run lint:fix
```

## License

Code released under the [MIT License](https://github.com/vittominacori/erc1363-payable-token/blob/master/LICENSE).
