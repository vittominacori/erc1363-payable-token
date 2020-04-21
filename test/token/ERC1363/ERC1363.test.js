const { BN } = require('@openzeppelin/test-helpers');

const { shouldBehaveLikeERC1363 } = require('./ERC1363.behaviour');

const ERC1363 = artifacts.require('ERC1363Mock');

contract('ERC1363', function ([owner, spender, recipient]) {
  const name = 'TEST';
  const symbol = 'TEST';

  const balance = new BN(100);

  beforeEach(async function () {
    this.token = await ERC1363.new(name, symbol, owner, balance);
  });

  shouldBehaveLikeERC1363([owner, spender, recipient], balance);
});
