function Enum(...options) {
  return Object.fromEntries(options.map((key, i) => [key, BigInt(i)]));
}

module.exports = {
  Enum,
  RevertType: Enum('None', 'RevertWithoutMessage', 'RevertWithMessage', 'RevertWithCustomError', 'Panic'),
};
