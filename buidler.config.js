require('chai/register-should');
usePlugin('@nomiclabs/buidler-truffle5'); // eslint-disable-line no-undef

module.exports = {
  defaultNetwork: 'buidlerevm',
  networks: {
    buidlerevm: {
      hardfork: 'istanbul',
    },
  },
  solc: {
    version: '0.5.15',
    evmVersion: 'istanbul',
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};
