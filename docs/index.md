# Solidity API

## ERC1363Guardian

_Implementation of a contract that allows to accept ERC-1363 callbacks after transfers or approvals.

IMPORTANT: When inheriting or copying from this contract, you must include a way to use the received tokens,
otherwise they will be stuck into the contract._

### TokensReceived

```solidity
event TokensReceived(address token, address operator, address from, uint256 value, bytes data)
```

_Emitted when a `value` amount of tokens `token` are moved from `from` to
this contract by `operator` using `transferAndCall` or `transferFromAndCall`._

### TokensApproved

```solidity
event TokensApproved(address token, address owner, uint256 value, bytes data)
```

_Emitted when the allowance for token `token` of this contract for an `owner` is set by
a call to `approveAndCall`. `value` is the new allowance._

### onTransferReceived

```solidity
function onTransferReceived(address operator, address from, uint256 value, bytes data) external returns (bytes4)
```

_Whenever ERC-1363 tokens are transferred to this contract via `IERC1363::transferAndCall` or `IERC1363::transferFromAndCall` by `operator` from `from`, this function is called.

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

### onApprovalReceived

```solidity
function onApprovalReceived(address owner, uint256 value, bytes data) external returns (bytes4)
```

_Whenever an ERC-1363 tokens `owner` approves this contract via `IERC1363::approveAndCall` to spend their tokens, this function is called.

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

### _transferReceived

```solidity
function _transferReceived(address token, address operator, address from, uint256 value, bytes data) internal virtual
```

_Called after validating a `onTransferReceived`. Implement this method to make your stuff within your contract._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| token | address | The address of the token that was received. |
| operator | address | The address which called `transferAndCall` or `transferFromAndCall` function. |
| from | address | The address which are tokens transferred from. |
| value | uint256 | The amount of tokens transferred. |
| data | bytes | Additional data with no specified format. |

### _approvalReceived

```solidity
function _approvalReceived(address token, address owner, uint256 value, bytes data) internal virtual
```

_Called after validating a `onApprovalReceived`. Implement this method to make your stuff within your contract._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| token | address | The address of the token that was approved. |
| owner | address | The address which called `approveAndCall` function and previously owned the tokens. |
| value | uint256 | The amount of tokens to be spent. |
| data | bytes | Additional data with no specified format. |

## ERC1363

_Implementation of the ERC-1363 interface.

Extension of ERC-20 tokens that supports executing code on a recipient contract after `transfer` or `transferFrom`, or code on a spender contract after `approve`, in a single transaction._

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

_Moves a `value` amount of tokens from the caller's account to `to` and then calls `IERC1363Receiver::onTransferReceived` on `to`._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | The address to which tokens are being transferred. |
| value | uint256 | The amount of tokens to be transferred. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean value indicating the operation succeeded unless throwing. |

### transferAndCall

```solidity
function transferAndCall(address to, uint256 value, bytes data) public virtual returns (bool)
```

_Moves a `value` amount of tokens from the caller's account to `to` and then calls `IERC1363Receiver::onTransferReceived` on `to`._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | The address to which tokens are being transferred. |
| value | uint256 | The amount of tokens to be transferred. |
| data | bytes | Additional data with no specified format, sent in call to `to`. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean value indicating the operation succeeded unless throwing. |

### transferFromAndCall

```solidity
function transferFromAndCall(address from, address to, uint256 value) public virtual returns (bool)
```

_Moves a `value` amount of tokens from `from` to `to` using the allowance mechanism and then calls `IERC1363Receiver::onTransferReceived` on `to`._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | The address from which to send tokens. |
| to | address | The address to which tokens are being transferred. |
| value | uint256 | The amount of tokens to be transferred. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean value indicating the operation succeeded unless throwing. |

### transferFromAndCall

```solidity
function transferFromAndCall(address from, address to, uint256 value, bytes data) public virtual returns (bool)
```

_Moves a `value` amount of tokens from `from` to `to` using the allowance mechanism and then calls `IERC1363Receiver::onTransferReceived` on `to`._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | The address from which to send tokens. |
| to | address | The address to which tokens are being transferred. |
| value | uint256 | The amount of tokens to be transferred. |
| data | bytes | Additional data with no specified format, sent in call to `to`. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean value indicating the operation succeeded unless throwing. |

### approveAndCall

```solidity
function approveAndCall(address spender, uint256 value) public virtual returns (bool)
```

_Sets a `value` amount of tokens as the allowance of `spender` over the caller's tokens and then calls `IERC1363Spender::onApprovalReceived` on `spender`._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| spender | address | The address which will spend the funds. |
| value | uint256 | The amount of tokens to be spent. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean value indicating the operation succeeded unless throwing. |

### approveAndCall

```solidity
function approveAndCall(address spender, uint256 value, bytes data) public virtual returns (bool)
```

_Sets a `value` amount of tokens as the allowance of `spender` over the caller's tokens and then calls `IERC1363Spender::onApprovalReceived` on `spender`._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| spender | address | The address which will spend the funds. |
| value | uint256 | The amount of tokens to be spent. |
| data | bytes | Additional data with no specified format, sent in call to `spender`. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean value indicating the operation succeeded unless throwing. |

## ERC1363Utils

### ERC1363EOAReceiver

```solidity
error ERC1363EOAReceiver(address receiver)
```

_Indicates a failure with the token `receiver` as it can't be an EOA. Used in transfers._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| receiver | address | The address to which tokens are being transferred. |

### ERC1363EOASpender

```solidity
error ERC1363EOASpender(address spender)
```

_Indicates a failure with the token `spender` as it can't be an EOA. Used in approvals._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| spender | address | The address which will spend the funds. |

### ERC1363InvalidReceiver

```solidity
error ERC1363InvalidReceiver(address receiver)
```

_Indicates a failure with the token `receiver`. Used in transfers._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| receiver | address | The address to which tokens are being transferred. |

### ERC1363InvalidSpender

```solidity
error ERC1363InvalidSpender(address spender)
```

_Indicates a failure with the token `spender`. Used in approvals._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| spender | address | The address which will spend the funds. |

### ERC1363TransferFailed

```solidity
error ERC1363TransferFailed(address receiver, uint256 value)
```

_Indicates a failure with the ERC-20 `transfer` during a `transferAndCall` operation. Used in transfers._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| receiver | address | The address to which tokens are being transferred. |
| value | uint256 | The amount of tokens to be transferred. |

### ERC1363TransferFromFailed

```solidity
error ERC1363TransferFromFailed(address sender, address receiver, uint256 value)
```

_Indicates a failure with the ERC-20 `transferFrom` during a `transferFromAndCall` operation. Used in transfers._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| sender | address | The address from which to send tokens. |
| receiver | address | The address to which tokens are being transferred. |
| value | uint256 | The amount of tokens to be transferred. |

### ERC1363ApproveFailed

```solidity
error ERC1363ApproveFailed(address spender, uint256 value)
```

_Indicates a failure with the ERC-20 `approve` during a `approveAndCall` operation. Used in approvals._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| spender | address | The address which will spend the funds. |
| value | uint256 | The amount of tokens to be spent. |

### checkOnERC1363TransferReceived

```solidity
function checkOnERC1363TransferReceived(address operator, address from, address to, uint256 value, bytes data) internal
```

_Performs a call to `IERC1363Receiver::onTransferReceived` on a target address.
This will revert if the target doesn't implement the `IERC1363Receiver` interface or
if the target doesn't accept the token transfer or
if the target address is not a contract._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| operator | address | The address which performed the call. |
| from | address | Address representing the previous owner of the given token amount. |
| to | address | Target address that will receive the tokens. |
| value | uint256 | The amount of tokens to be transferred. |
| data | bytes | Optional data to send along with the call. |

### checkOnERC1363ApprovalReceived

```solidity
function checkOnERC1363ApprovalReceived(address operator, address spender, uint256 value, bytes data) internal
```

_Performs a call to `IERC1363Spender::onApprovalReceived` on a target address.
This will revert if the target doesn't implement the `IERC1363Spender` interface or
if the target doesn't accept the token approval or
if the target address is not a contract._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| operator | address | The address which performed the call. |
| spender | address | The address which will spend the funds. |
| value | uint256 | The amount of tokens to be spent. |
| data | bytes | Optional data to send along with the call. |

## IERC1363

_Interface of the ERC-1363 standard as defined in the https://eips.ethereum.org/EIPS/eip-1363[ERC-1363].

An extension interface for ERC-20 tokens that supports executing code on a recipient contract after `transfer` or `transferFrom`, or code on a spender contract after `approve`, in a single transaction._

### transferAndCall

```solidity
function transferAndCall(address to, uint256 value) external returns (bool)
```

_Moves a `value` amount of tokens from the caller's account to `to` and then calls `IERC1363Receiver::onTransferReceived` on `to`._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | The address to which tokens are being transferred. |
| value | uint256 | The amount of tokens to be transferred. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean value indicating the operation succeeded unless throwing. |

### transferAndCall

```solidity
function transferAndCall(address to, uint256 value, bytes data) external returns (bool)
```

_Moves a `value` amount of tokens from the caller's account to `to` and then calls `IERC1363Receiver::onTransferReceived` on `to`._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| to | address | The address to which tokens are being transferred. |
| value | uint256 | The amount of tokens to be transferred. |
| data | bytes | Additional data with no specified format, sent in call to `to`. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean value indicating the operation succeeded unless throwing. |

### transferFromAndCall

```solidity
function transferFromAndCall(address from, address to, uint256 value) external returns (bool)
```

_Moves a `value` amount of tokens from `from` to `to` using the allowance mechanism and then calls `IERC1363Receiver::onTransferReceived` on `to`._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | The address from which to send tokens. |
| to | address | The address to which tokens are being transferred. |
| value | uint256 | The amount of tokens to be transferred. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean value indicating the operation succeeded unless throwing. |

### transferFromAndCall

```solidity
function transferFromAndCall(address from, address to, uint256 value, bytes data) external returns (bool)
```

_Moves a `value` amount of tokens from `from` to `to` using the allowance mechanism and then calls `IERC1363Receiver::onTransferReceived` on `to`._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| from | address | The address from which to send tokens. |
| to | address | The address to which tokens are being transferred. |
| value | uint256 | The amount of tokens to be transferred. |
| data | bytes | Additional data with no specified format, sent in call to `to`. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean value indicating the operation succeeded unless throwing. |

### approveAndCall

```solidity
function approveAndCall(address spender, uint256 value) external returns (bool)
```

_Sets a `value` amount of tokens as the allowance of `spender` over the caller's tokens and then calls `IERC1363Spender::onApprovalReceived` on `spender`._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| spender | address | The address which will spend the funds. |
| value | uint256 | The amount of tokens to be spent. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean value indicating the operation succeeded unless throwing. |

### approveAndCall

```solidity
function approveAndCall(address spender, uint256 value, bytes data) external returns (bool)
```

_Sets a `value` amount of tokens as the allowance of `spender` over the caller's tokens and then calls `IERC1363Spender::onApprovalReceived` on `spender`._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| spender | address | The address which will spend the funds. |
| value | uint256 | The amount of tokens to be spent. |
| data | bytes | Additional data with no specified format, sent in call to `spender`. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bool | A boolean value indicating the operation succeeded unless throwing. |

## IERC1363Receiver

_Interface for any contract that wants to support `transferAndCall` or `transferFromAndCall` from ERC-1363 token contracts._

### onTransferReceived

```solidity
function onTransferReceived(address operator, address from, uint256 value, bytes data) external returns (bytes4)
```

_Whenever ERC-1363 tokens are transferred to this contract via `IERC1363::transferAndCall` or `IERC1363::transferFromAndCall` by `operator` from `from`, this function is called.

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

_Whenever an ERC-1363 tokens `owner` approves this contract via `IERC1363::approveAndCall` to spend their tokens, this function is called.

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

