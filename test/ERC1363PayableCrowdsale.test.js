const { shouldBehaveLikeERC1363PayableCrowdsale } = require('./examples/ERC1363PayableCrowdsale.behaviour');

const BigNumber = web3.BigNumber;

const ERC20Token = artifacts.require('ERC20Mock');
const ERC1363BasicToken = artifacts.require('ERC1363BasicTokenMock');

contract('ERC1363PayableCrowdsale', function ([_, wallet, beneficiary, operator]) {
  const erc1363tTokenSupply = new BigNumber('1e22');

  beforeEach(async function () {
    this.erc1363Token = await ERC1363BasicToken.new(beneficiary, erc1363tTokenSupply);
    this.erc20Token = await ERC20Token.new();
    this.notAcceptedErc1363Token = await ERC1363BasicToken.new(beneficiary, erc1363tTokenSupply);
  });

  shouldBehaveLikeERC1363PayableCrowdsale([_, wallet, beneficiary, operator]);
});
