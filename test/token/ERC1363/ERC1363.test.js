const { BN } = require('@openzeppelin/test-helpers');

const { shouldBehaveLikeERC1363 } = require('./ERC1363.behaviour');

const ERC1363 = artifacts.require('$ERC1363');

contract('ERC1363', function ([owner, spender, recipient]) {
  const name = 'My Token';
  const symbol = 'MTKN';

  const balance = new BN(100);

  beforeEach(async function () {
    this.token = await ERC1363.new(name, symbol);

    await this.token.$_mint(owner, balance);
  });

  shouldBehaveLikeERC1363([owner, spender, recipient], balance);
});
