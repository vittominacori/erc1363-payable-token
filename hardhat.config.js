require('@nomiclabs/hardhat-truffle5');
require('hardhat-exposed');
require('solidity-coverage');

module.exports = {
  defaultNetwork: 'hardhat',
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  exposed: {
    exclude: [],
  },
};
