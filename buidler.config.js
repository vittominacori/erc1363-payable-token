require('chai/register-should');
usePlugin('@nomiclabs/buidler-truffle5'); // eslint-disable-line no-undef

module.exports = {
  defaultNetwork: 'buidlerevm',
  solc: {
    version: '0.5.12',
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};
