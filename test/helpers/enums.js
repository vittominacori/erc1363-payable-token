function Enum(...options) {
  return Object.fromEntries(options.map((key, i) => [key, BigInt(i)]));
}

module.exports = {
  RevertType: Enum('None', 'RevertWithoutMessage', 'RevertWithMessage', 'RevertWithCustomError', 'Panic'),
};
