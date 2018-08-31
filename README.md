# ERC-1363 Payable Token

[![Build Status](https://travis-ci.org/vittominacori/erc1363-payable-token.svg?branch=master)](https://travis-ci.org/vittominacori/erc1363-payable-token) 
[![Coverage Status](https://coveralls.io/repos/github/vittominacori/erc1363-payable-token/badge.svg?branch=master)](https://coveralls.io/github/vittominacori/erc1363-payable-token?branch=master) 

This is an implementation of the [ERC-1363 Payable Token](https://github.com/ethereum/EIPs/issues/1363).

It describes a Payable Token and Receiver, compatible with the ERC-20 definition.

This proposal allows to implement an ERC-20 token that can be used for payments (like the `payable` keyword does for Ethereum).

It can be used to create a token payable crowdsale, selling services for tokens, use them for a specific utility and many other purposes.


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
