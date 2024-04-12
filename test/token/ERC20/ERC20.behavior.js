const { shouldBehaveLikeERC20Approve } = require('./ERC20.approve.behavior');
const { shouldBehaveLikeERC20Transfer } = require('./ERC20.transfer.behavior');

function shouldBehaveLikeERC20(initialBalance, [initialHolder, receiver, spender]) {
  shouldBehaveLikeERC20Transfer(initialHolder, receiver, spender, initialBalance);
  shouldBehaveLikeERC20Approve(initialHolder, spender, initialBalance);
}

module.exports = {
  shouldBehaveLikeERC20,
};
