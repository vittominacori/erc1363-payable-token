function Enum(...options) {
  return Object.fromEntries(options.map((key, i) => [key, web3.utils.toBN(i)]));
}

module.exports = {
  Enum,
};
