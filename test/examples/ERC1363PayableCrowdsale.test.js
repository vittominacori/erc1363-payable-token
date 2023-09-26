const { BN } = require('@openzeppelin/test-helpers');

const { shouldBehaveLikeERC1363PayableCrowdsale } = require('./ERC1363PayableCrowdsale.behaviour');

const ERC20 = artifacts.require('$ERC20Mock');
const ERC1363 = artifacts.require('$ERC1363');

contract('ERC1363PayableCrowdsale', function ([_, wallet, beneficiary, operator]) {
  const name = 'My Token';
  const symbol = 'MTKN';
  const erc1363tTokenSupply = new BN('10000000000000000000000');

  beforeEach(async function () {
    this.erc1363Token = await ERC1363.new(name, symbol);
    this.notAcceptedErc1363Token = await ERC1363.new(name, symbol);
    this.erc20Token = await ERC20.new();

    await this.erc1363Token.$_mint(beneficiary, erc1363tTokenSupply);
    await this.notAcceptedErc1363Token.$_mint(beneficiary, erc1363tTokenSupply);
  });

  shouldBehaveLikeERC1363PayableCrowdsale([_, wallet, beneficiary, operator]);
});
