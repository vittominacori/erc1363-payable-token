# Solidity API

## ERC1363

_Implementation of the ERC-1363 interface.

Extension of ERC-20 tokens that supports executing code on a recipient contract after `transfer` or `transferFrom`,
or code on a spender contract after `approve`, in a single transaction._

### supportsInterface

```solidity
function supportsInterface(bytes4 interfaceId) public view virtual returns (bool)
```

_Returns true if this contract implements the interface defined by
`interfaceId`. See the corresponding
https://eips.ethereum.org/EIPS/eip-165#how-interfaces-are-identified[EIP section]
to learn more about how these ids are created.

This function call must use less than 30 000 gas._

### transferAndCall

```solidity
function transferAndCall(address to, uint256 value) public virtual returns (bool)
```

_Moves a `value` amount of tokens from the caller's account to `to` and then calls `onTransferReceived` on `to`._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | The address which you want to transfer to. |
| value | uint256 | The amount of tokens to be transferred. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean value indicating whether the operation succeeded unless throwing. |

### transferAndCall

```solidity
function transferAndCall(address to, uint256 value, bytes data) public virtual returns (bool)
```

_Moves a `value` amount of tokens from the caller's account to `to` and then calls `onTransferReceived` on `to`._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | The address which you want to transfer to. |
| value | uint256 | The amount of tokens to be transferred. |
| data | bytes | Additional data with no specified format, sent in call to `to`. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean value indicating whether the operation succeeded unless throwing. |

### transferFromAndCall

```solidity
function transferFromAndCall(address from, address to, uint256 value) public virtual returns (bool)
```

_Moves a `value` amount of tokens from `from` to `to` using the allowance mechanism and then calls `onTransferReceived` on `to`._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | The address which you want to send tokens from. |
| to | address | The address which you want to transfer to. |
| value | uint256 | The amount of tokens to be transferred. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean value indicating whether the operation succeeded unless throwing. |

### transferFromAndCall

```solidity
function transferFromAndCall(address from, address to, uint256 value, bytes data) public virtual returns (bool)
```

_Moves a `value` amount of tokens from `from` to `to` using the allowance mechanism and then calls `onTransferReceived` on `to`._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | The address which you want to send tokens from. |
| to | address | The address which you want to transfer to. |
| value | uint256 | The amount of tokens to be transferred. |
| data | bytes | Additional data with no specified format, sent in call to `to`. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean value indicating whether the operation succeeded unless throwing. |

### approveAndCall

```solidity
function approveAndCall(address spender, uint256 value) public virtual returns (bool)
```

_Sets a `value` amount of tokens as the allowance of `spender` over the caller's tokens and then calls `onApprovalReceived` on `spender`._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| spender | address | The address which will spend the funds. |
| value | uint256 | The amount of tokens to be spent. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean value indicating whether the operation succeeded unless throwing. |

### approveAndCall

```solidity
function approveAndCall(address spender, uint256 value, bytes data) public virtual returns (bool)
```

_Sets a `value` amount of tokens as the allowance of `spender` over the caller's tokens and then calls `onApprovalReceived` on `spender`._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| spender | address | The address which will spend the funds. |
| value | uint256 | The amount of tokens to be spent. |
| data | bytes | Additional data with no specified format, sent in call to `spender`. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean value indicating whether the operation succeeded unless throwing. |

## IERC1363

_Interface of the ERC-1363 standard as defined in the https://eips.ethereum.org/EIPS/eip-1363[ERC-1363].

An extension interface for ERC-20 tokens that supports executing code on a recipient contract after
`transfer` or `transferFrom`, or code on a spender contract after `approve`, in a single transaction._

### transferAndCall

```solidity
function transferAndCall(address to, uint256 value) external returns (bool)
```

_Moves a `value` amount of tokens from the caller's account to `to` and then calls `onTransferReceived` on `to`._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | The address which you want to transfer to. |
| value | uint256 | The amount of tokens to be transferred. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean value indicating whether the operation succeeded unless throwing. |

### transferAndCall

```solidity
function transferAndCall(address to, uint256 value, bytes data) external returns (bool)
```

_Moves a `value` amount of tokens from the caller's account to `to` and then calls `onTransferReceived` on `to`._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | The address which you want to transfer to. |
| value | uint256 | The amount of tokens to be transferred. |
| data | bytes | Additional data with no specified format, sent in call to `to`. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean value indicating whether the operation succeeded unless throwing. |

### transferFromAndCall

```solidity
function transferFromAndCall(address from, address to, uint256 value) external returns (bool)
```

_Moves a `value` amount of tokens from `from` to `to` using the allowance mechanism and then calls `onTransferReceived` on `to`._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | The address which you want to send tokens from. |
| to | address | The address which you want to transfer to. |
| value | uint256 | The amount of tokens to be transferred. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean value indicating whether the operation succeeded unless throwing. |

### transferFromAndCall

```solidity
function transferFromAndCall(address from, address to, uint256 value, bytes data) external returns (bool)
```

_Moves a `value` amount of tokens from `from` to `to` using the allowance mechanism and then calls `onTransferReceived` on `to`._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | The address which you want to send tokens from. |
| to | address | The address which you want to transfer to. |
| value | uint256 | The amount of tokens to be transferred. |
| data | bytes | Additional data with no specified format, sent in call to `to`. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean value indicating whether the operation succeeded unless throwing. |

### approveAndCall

```solidity
function approveAndCall(address spender, uint256 value) external returns (bool)
```

_Sets a `value` amount of tokens as the allowance of `spender` over the caller's tokens and then calls `onApprovalReceived` on `spender`._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| spender | address | The address which will spend the funds. |
| value | uint256 | The amount of tokens to be spent. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean value indicating whether the operation succeeded unless throwing. |

### approveAndCall

```solidity
function approveAndCall(address spender, uint256 value, bytes data) external returns (bool)
```

_Sets a `value` amount of tokens as the allowance of `spender` over the caller's tokens and then calls `onApprovalReceived` on `spender`._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| spender | address | The address which will spend the funds. |
| value | uint256 | The amount of tokens to be spent. |
| data | bytes | Additional data with no specified format, sent in call to `spender`. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean value indicating whether the operation succeeded unless throwing. |

## IERC1363Errors

_Interface of the ERC-1363 custom errors following the https://eips.ethereum.org/EIPS/eip-6093[ERC-6093] rationale._

### ERC1363EOAReceiver

```solidity
error ERC1363EOAReceiver(address receiver)
```

_Indicates a failure with the token `receiver` as it can't be an EOA. Used in transfers._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| receiver | address | Address to which tokens are being transferred. |

### ERC1363EOASpender

```solidity
error ERC1363EOASpender(address spender)
```

_Indicates a failure with the token `spender` as it can't be an EOA. Used in approvals._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| spender | address | Address that may be allowed to operate on tokens without being their owner. |

### ERC1363InvalidReceiver

```solidity
error ERC1363InvalidReceiver(address receiver)
```

_Indicates a failure with the token `receiver`. Used in transfers._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| receiver | address | Address to which tokens are being transferred. |

### ERC1363InvalidSpender

```solidity
error ERC1363InvalidSpender(address spender)
```

_Indicates a failure with the token `spender`. Used in approvals._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| spender | address | Address that may be allowed to operate on tokens without being their owner. |

## IERC1363Receiver

_Interface for any contract that wants to support `transferAndCall` or `transferFromAndCall` from ERC-1363 token contracts._

### onTransferReceived

```solidity
function onTransferReceived(address operator, address from, uint256 value, bytes data) external returns (bytes4)
```

_Whenever ERC-1363 tokens are transferred to this contract via `transferAndCall` or `transferFromAndCall` by `operator` from `from`, this function is called.

NOTE: To accept the transfer, this must return
`bytes4(keccak256("onTransferReceived(address,address,uint256,bytes)"))`
(i.e. 0x88a7ca5c, or its own function selector)._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| operator | address | The address which called `transferAndCall` or `transferFromAndCall` function. |
| from | address | The address which are tokens transferred from. |
| value | uint256 | The amount of tokens transferred. |
| data | bytes | Additional data with no specified format. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes4 | `bytes4(keccak256("onTransferReceived(address,address,uint256,bytes)"))` if transfer is allowed unless throwing. |

## IERC1363Spender

_Interface for any contract that wants to support `approveAndCall` from ERC-1363 token contracts._

### onApprovalReceived

```solidity
function onApprovalReceived(address owner, uint256 value, bytes data) external returns (bytes4)
```

_Whenever an ERC-1363 token `owner` approves this contract via `approveAndCall` to spend their tokens, this function is called.

NOTE: To accept the approval, this must return
`bytes4(keccak256("onApprovalReceived(address,uint256,bytes)"))`
(i.e. 0x7b04a2d0, or its own function selector)._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | The address which called `approveAndCall` function and previously owned the tokens. |
| value | uint256 | The amount of tokens to be spent. |
| data | bytes | Additional data with no specified format. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes4 | `bytes4(keccak256("onApprovalReceived(address,uint256,bytes)"))` if approval is allowed unless throwing. |

