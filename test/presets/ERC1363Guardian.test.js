const { BN } = require('@openzeppelin/test-helpers');

const { shouldBehaveLikeERC1363Guardian } = require('./ERC1363Guardian.behavior');

const ERC1363 = artifacts.require('$ERC1363');
const ERC1363Guardian = artifacts.require('ERC1363GuardianMock');

contract('ERC1363Guardian', function ([initialHolder, spender]) {
  const name = 'My Token';
  const symbol = 'MTKN';
  const balance = new BN(100);

  beforeEach(async function () {
    this.token = await ERC1363.new(name, symbol);

    await this.token.$_mint(initialHolder, balance);

    this.mock = await ERC1363Guardian.new();
  });

  shouldBehaveLikeERC1363Guardian([initialHolder, spender], balance);
});
