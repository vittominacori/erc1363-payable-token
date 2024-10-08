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

> [!IMPORTANT]
> **This repo contains the reference implementation of the official [ERC-1363](https://eips.ethereum.org/EIPS/eip-1363).**

## Install

```bash
npm install erc-payable-token
```

## Usage

```solidity
pragma solidity ^0.8.20;

import "erc-payable-token/contracts/token/ERC1363/ERC1363.sol";

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

### ERC1363Utils

[ERC1363Utils.sol](https://github.com/vittominacori/erc1363-payable-token/blob/master/contracts/token/ERC1363/ERC1363Utils.sol)

Library that provides common ERC-1363 utility functions and custom errors.

### ERC1363

[ERC1363.sol](https://github.com/vittominacori/erc1363-payable-token/blob/master/contracts/token/ERC1363/ERC1363.sol)

Implementation of the ERC-1363 interface.

The reference implementation of ERC-1363 that extends ERC-20 and adds support for executing code after transfers and approvals on recipient contracts.

> [!IMPORTANT]
> `transferAndCall`, `transferFromAndCall` and `approveAndCall` revert if the recipient/spender is an EOA (Externally Owned Account). 
> 
> To transfer tokens to an EOA or approve it to spend tokens, use the ERC-20 `transfer`, `transferFrom` or `approve` methods.

## Extensions

### ERC1363Mintable

[ERC1363Mintable.sol](https://github.com/vittominacori/erc1363-payable-token/blob/master/contracts/token/ERC1363/extensions/ERC1363Mintable.sol)

An extension of ERC-1363 that adds a `_mintAndCall` method. 

This method allows to mint new tokens to a receiver contract and then call the `onTransferReceived` callback.

> [!NOTE]
> `_mintAndCall` is an internal method, and you should call it from your derived contract.
>
> For instance, you may choose to check if the receiver is a contract or an EOA and call the `_mint` method instead.
>
> ```solidity
> pragma solidity ^0.8.20;
> 
> // other imports
> import "erc-payable-token/contracts/token/ERC1363/extensions/ERC1363Mintable.sol";
> 
> contract MyToken is ERC1363Mintable, Ownable {
>     // your stuff
>
>     function safeMint(address account, uint256 value, bytes memory data) public onlyOwner {
>         if (account.code.length == 0) {
>             _mint(account, value);
>         } else {
>             _mintAndCall(account, value, data);
>         }
>     }
>
>     // your stuff
> }
> ```

## Presets

> [!WARNING]
> The `presets` contracts are ideas and suggestions for using ERC-1363 tokens within your contracts. 
> 
> When inheriting or copying from these contracts, you must include a way to use the received tokens, otherwise they will be stuck into the contract.
> 
> Always test your contracts before going live.

### ERC1363Guardian

[ERC1363Guardian.sol](https://github.com/vittominacori/erc1363-payable-token/blob/master/contracts/presets/ERC1363Guardian.sol)

A contract that allows to accept ERC-1363 callbacks after transfers or approvals.

It emits a `TokensReceived` event to notify the transfer received by the contract.

It also implements a `_transferReceived` function that must be overridden to make your stuff within your contract after a `onTransferReceived`.

It emits a `TokensApproved` event to notify the approval received by the contract.

It also implements a `_approvalReceived` function that must be overridden to make your stuff within your contract after a `onApprovalReceived`.

> [!TIP]
> After an `approveAndCall` your contract should use the allowance to do something. 
> 
> For instance, you may choose to transfer the approved amount of tokens into the contract itself and then update internal status.
> 
> ```solidity
> function _approvalReceived(
>     address token,
>     address owner,
>     uint256 value,
>     bytes calldata data
> ) internal override {
>     IERC20(token).transferFrom(owner, address(this), value);
>
>     // update internal status
> }
> ```
> 
> **You must then include a way to use the received tokens, otherwise they will be stuck into the contract.**

## Examples

> [!CAUTION] 
> The `examples` contracts are for testing purpose only. Do not use in production.
> 
> When copying from these contracts, you must include a way to use the received tokens, otherwise they will be stuck into the contract.
> 
> Always test your contracts before going live.

### ERC1363Payable

[ERC1363Payable.sol](https://github.com/vittominacori/erc1363-payable-token/blob/master/contracts/examples/ERC1363Payable.sol)

An example contract that allows to test accepting ERC-1363 deposits via `transferAndCall`, `transferFromAndCall` and `approveAndCall`.

Inherits from `ERC1363Guardian` but requires a `IERC1363` address to set as accepted token.

Deposits done using not accepted tokens will revert.

Once a deposit is confirmed, the contract increases the user credit value.

### ERC1363MethodCallReceiver

[ERC1363MethodCallReceiver.sol](https://github.com/vittominacori/erc1363-payable-token/blob/master/contracts/examples/ERC1363MethodCallReceiver.sol)

An example contract that allows to test passing methods via abi encoded function call.

It executes the method passed via `data`. Methods emit a `MethodCall` event.

## Documentation

* [Solidity API](https://github.com/vittominacori/erc1363-payable-token/tree/master/docs/index.md)

## Code Analysis

- Control Flow
  - [ERC1363](https://raw.githubusercontent.com/vittominacori/erc1363-payable-token/master/analysis/control-flow/ERC1363.png)
  - [ERC1363Mintable](https://raw.githubusercontent.com/vittominacori/erc1363-payable-token/master/analysis/control-flow/ERC1363Mintable.png)
- Description Table
  - [ERC1363](https://github.com/vittominacori/erc1363-payable-token/blob/master/analysis/description-table/ERC1363.md)
  - [ERC1363Mintable](https://github.com/vittominacori/erc1363-payable-token/blob/master/analysis/description-table/ERC1363Mintable.md)
- Inheritance Tree
  - [ERC1363](https://raw.githubusercontent.com/vittominacori/erc1363-payable-token/master/analysis/inheritance-tree/ERC1363.png)
  - [ERC1363Mintable](https://raw.githubusercontent.com/vittominacori/erc1363-payable-token/master/analysis/inheritance-tree/ERC1363Mintable.png)
- UML
  - [ERC1363](https://raw.githubusercontent.com/vittominacori/erc1363-payable-token/master/analysis/uml/ERC1363.svg)
  - [ERC1363Mintable](https://raw.githubusercontent.com/vittominacori/erc1363-payable-token/master/analysis/uml/ERC1363Mintable.svg)

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
