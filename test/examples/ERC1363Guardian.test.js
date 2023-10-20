const { BN } = require('@openzeppelin/test-helpers');

const { shouldBehaveLikeERC1363Guardian } = require('./ERC1363Guardian.behavior');

const ERC1363 = artifacts.require('$ERC1363');

contract('ERC1363Guardian', function ([owner, spender]) {
  const name = 'My Token';
  const symbol = 'MTKN';
  const balance = new BN(100);

  beforeEach(async function () {
    this.token = await ERC1363.new(name, symbol);

    await this.token.$_mint(owner, balance);
  });

  shouldBehaveLikeERC1363Guardian([owner, spender], balance);
});
