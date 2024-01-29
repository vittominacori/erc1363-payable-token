module.exports = {
  compilers: {
    solc: {
      version: '0.8.24',
      settings: {
        evmVersion: 'shanghai',
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
