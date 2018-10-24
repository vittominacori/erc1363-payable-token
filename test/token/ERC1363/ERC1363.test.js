const { shouldBehaveLikeERC1363 } = require('./ERC1363.behaviour');

const ERC1363 = artifacts.require('ERC1363Mock');

contract('ERC1363', function ([owner, spender, recipient]) {
  const balance = 100;

  beforeEach(async function () {
    this.token = await ERC1363.new(owner, balance);
  });

  shouldBehaveLikeERC1363([owner, spender, recipient], balance);
});
