const { BN } = require('@openzeppelin/test-helpers');

const { shouldBehaveLikeERC1363MethodCallReceiver } = require('./ERC1363MethodCallReceiver.behavior');

const ERC1363 = artifacts.require('$ERC1363');

contract('ERC1363MethodCallReceiver', function ([sender, operator]) {
  const name = 'My Token';
  const symbol = 'MTKN';
  const erc1363tTokenSupply = new BN('10000000000000000000000');

  beforeEach(async function () {
    this.token = await ERC1363.new(name, symbol);

    await this.token.$_mint(sender, erc1363tTokenSupply);
  });

  shouldBehaveLikeERC1363MethodCallReceiver([sender, operator]);
});
