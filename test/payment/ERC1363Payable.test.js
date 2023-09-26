const { BN } = require('@openzeppelin/test-helpers');

const { shouldBehaveLikeERC1363Payable } = require('./ERC1363Payable.behaviour');

const ERC20 = artifacts.require('$ERC20Mock');
const ERC1363 = artifacts.require('$ERC1363');
const ERC1363Payable = artifacts.require('ERC1363PayableMock');

contract('ERC1363Payable', function ([owner, spender]) {
  const name = 'My Token';
  const symbol = 'MTKN';
  const balance = new BN(100);

  beforeEach(async function () {
    this.token = await ERC1363.new(name, symbol);
    this.notAcceptedToken = await ERC1363.new(name, symbol);
    this.erc20Token = await ERC20.new();
    this.mock = await ERC1363Payable.new(this.token.address);

    await this.token.$_mint(owner, balance);
    await this.notAcceptedToken.$_mint(owner, balance);
  });

  shouldBehaveLikeERC1363Payable([owner, spender], balance);
});
