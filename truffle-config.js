module.exports = {
  compilers: {
    solc: {
      version: '0.8.21',
      settings: {
        optimizer: {
          enabled: true,
          runs: 200,
        },
      },
    },
  },
};
