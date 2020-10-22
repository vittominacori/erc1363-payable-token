require('chai/register-should');
usePlugin('solidity-coverage'); // eslint-disable-line no-undef
usePlugin('@nomiclabs/buidler-ganache'); // eslint-disable-line no-undef
usePlugin('@nomiclabs/buidler-truffle5'); // eslint-disable-line no-undef

module.exports = {
  defaultNetwork: 'buidlerevm',
  networks: {
    coverage: {
      url: 'http://127.0.0.1:8555',
      gas: 0xfffffffffff,
      gasPrice: 0x01,
    },
  },
  solc: {
    version: '0.7.4',
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};
