const { shouldBehaveLikeERC1363BasicToken } = require('./ERC1363BasicToken.behaviour');

const ERC1363BasicToken = artifacts.require('ERC1363BasicTokenMock');

contract('ERC1363BasicToken', function ([owner, spender, recipient]) {
  const balance = 100;

  beforeEach(async function () {
    this.token = await ERC1363BasicToken.new(owner, balance);
  });

  shouldBehaveLikeERC1363BasicToken([owner, spender, recipient], balance);
});
