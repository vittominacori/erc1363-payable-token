const { BN } = require('@openzeppelin/test-helpers');

const { shouldBehaveLikeERC1363PayableCrowdsale } = require('./ERC1363PayableCrowdsale.behaviour');

const ERC20Token = artifacts.require('ERC20Mock');
const ERC1363 = artifacts.require('ERC1363Mock');

contract('ERC1363PayableCrowdsale', function ([_, wallet, beneficiary, operator]) {
  const name = 'TEST';
  const symbol = 'TEST';

  const erc1363tTokenSupply = new BN('10000000000000000000000');

  beforeEach(async function () {
    this.erc1363Token = await ERC1363.new(name, symbol, beneficiary, erc1363tTokenSupply);
    this.erc20Token = await ERC20Token.new(name, symbol);
    this.notAcceptedErc1363Token = await ERC1363.new(name, symbol, beneficiary, erc1363tTokenSupply);
  });

  shouldBehaveLikeERC1363PayableCrowdsale([_, wallet, beneficiary, operator]);
});
