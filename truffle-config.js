module.exports = {
  compilers: {
    solc: {
      version: '0.8.25',
      settings: {
        evmVersion: 'cancun',
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
