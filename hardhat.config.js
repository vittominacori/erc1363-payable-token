require('@nomicfoundation/hardhat-chai-matchers');
require('@nomiclabs/hardhat-truffle5');
require('@nomicfoundation/hardhat-foundry');
require('hardhat-exposed');
require('hardhat-gas-reporter');
require('solidity-coverage');
require('solidity-docgen');

module.exports = {
  defaultNetwork: 'hardhat',
  solidity: {
    version: '0.8.33',
    settings: {
      evmVersion: 'osaka',
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  docgen: {
    outputDir: 'docs',
    exclude: ['mocks', 'examples'],
  },
  exposed: {
    exclude: [],
  },
  gasReporter: {
    enabled: true,
    excludeContracts: ['mocks', 'examples', '@openzeppelin/contracts'],
    showMethodSig: true,
    trackGasDeltas: true,
  },
};
