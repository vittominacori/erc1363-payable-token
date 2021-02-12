require('chai/register-should');
require('@nomiclabs/hardhat-ganache');
require('@nomiclabs/hardhat-truffle5');
require('solidity-coverage');

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    coverage: {
      url: 'http://127.0.0.1:8555',
      gas: 0xfffffffffff,
      gasPrice: 0x01,
    },
  },
  solidity: {
    version: '0.7.6',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
