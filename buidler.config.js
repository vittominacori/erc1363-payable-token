require('chai/register-should');
usePlugin('solidity-coverage'); // eslint-disable-line no-undef
usePlugin('@nomiclabs/buidler-ganache'); // eslint-disable-line no-undef
usePlugin('@nomiclabs/buidler-truffle5'); // eslint-disable-line no-undef

module.exports = {
  defaultNetwork: 'buidlerevm',
  networks: {
    buidlerevm: {
      hardfork: 'istanbul',
    },
    coverage: {
      url: 'http://127.0.0.1:8555',
      gas: 0xfffffffffff,
      gasPrice: 0x01,
    },
  },
  solc: {
    version: '0.5.16',
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};
