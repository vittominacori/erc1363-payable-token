const { BN } = require('@openzeppelin/test-helpers');

const { shouldBehaveLikeERC1363 } = require('./ERC1363.behavior');

const { shouldHaveERC20Properties } = require('../ERC20/ERC20.properties');
const { shouldBehaveLikeERC20 } = require('../ERC20/ERC20.behavior');

const ERC1363 = artifacts.require('$ERC1363');

contract('ERC1363', function (accounts) {
  const [initialHolder] = accounts;

  const name = 'My Token';
  const symbol = 'MTKN';
  const decimals = new BN(18);
  const initialSupply = new BN(100);

  beforeEach(async function () {
    this.token = await ERC1363.new(name, symbol);
    await this.token.$_mint(initialHolder, initialSupply);
  });

  context('ERC1363 behavior', function () {
    shouldBehaveLikeERC1363(initialSupply, accounts);

    context('backward compatible with ERC20', function () {
      shouldHaveERC20Properties(name, symbol, decimals, initialSupply, initialSupply, accounts);
      shouldBehaveLikeERC20(initialSupply, accounts);
    });
  });
});
