const { BN } = require('@openzeppelin/test-helpers');

const { shouldBehaveLikeERC1363MethodCallReceiver } = require('./ERC1363MethodCallReceiver.behaviour');

const ERC1363 = artifacts.require('ERC1363Mock');

contract('ERC1363MethodCallReceiver', function ([deployer, sender, operator]) {
  const name = 'TEST';
  const symbol = 'TEST';

  const erc1363tTokenSupply = new BN('10000000000000000000000');

  beforeEach(async function () {
    this.erc1363Token = await ERC1363.new(name, symbol, sender, erc1363tTokenSupply, { from: deployer });
  });

  shouldBehaveLikeERC1363MethodCallReceiver([deployer, sender, operator]);
});
