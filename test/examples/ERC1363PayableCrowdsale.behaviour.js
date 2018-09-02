const { sendTransaction } = require('../helpers/sendTransaction');
const { assertRevert } = require('../helpers/assertRevert');
const { decodeLogs } = require('../helpers/decodeLogs');

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

const Crowdsale = artifacts.require('ERC1363PayableCrowdsale');

function shouldBehaveLikeERC1363PayableCrowdsale ([_, wallet, beneficiary, operator]) {
  const rate = new BigNumber(1);
  const value = new BigNumber('1e18');
  const tokenSupply = new BigNumber('1e22');
  const expectedTokenAmount = rate.mul(value);
  const data = '0x42';
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

  it('requires a non-null ERC20 token', async function () {
    await assertRevert(
      Crowdsale.new(rate, wallet, ZERO_ADDRESS, this.erc1363Token.address)
    );
  });

  it('requires a non-zero rate', async function () {
    await assertRevert(
      Crowdsale.new(0, wallet, this.erc20Token.address, this.erc1363Token.address)
    );
  });

  it('requires a non-null wallet', async function () {
    await assertRevert(
      Crowdsale.new(rate, ZERO_ADDRESS, this.erc20Token.address, this.erc1363Token.address)
    );
  });

  it('requires a non-null ERC1363 token', async function () {
    await assertRevert(
      Crowdsale.new(rate, wallet, this.erc20Token.address, ZERO_ADDRESS)
    );
  });

  it('requires a ERC1363 valid token', async function () {
    await assertRevert(
      Crowdsale.new(rate, wallet, this.erc20Token.address, this.erc20Token.address)
    );
  });

  context('once deployed', async function () {
    beforeEach(async function () {
      this.crowdsale = await Crowdsale.new(rate, wallet, this.erc20Token.address, this.erc1363Token.address);
      await this.erc20Token.transfer(this.crowdsale.address, tokenSupply);
    });

    describe('accepting payments', function () {
      describe('via transferFromAndCall', function () {
        beforeEach(async function () {
          await this.erc1363Token.approve(operator, value, { from: beneficiary });
        });

        const transferFromAndCallWithData = function (from, to, value, opts) {
          return sendTransaction(
            this.erc1363Token,
            'transferFromAndCall',
            'address,address,uint256,bytes',
            [from, to, value, data],
            opts
          );
        };

        const transferFromAndCallWithoutData = function (from, to, value, opts) {
          return sendTransaction(
            this.erc1363Token,
            'transferFromAndCall',
            'address,address,uint256',
            [from, to, value],
            opts
          );
        };

        describe('with data', function () {
          it('should accept payments', async function () {
            await transferFromAndCallWithData.call(
              this, beneficiary, this.crowdsale.address, value, { from: operator }
            );
          });

          it('should log purchase', async function () {
            const result = await transferFromAndCallWithData.call(
              this, beneficiary, this.crowdsale.address, value, { from: operator }
            );
            const [log] = decodeLogs([result.receipt.logs[2]], Crowdsale, this.crowdsale.address);
            log.event.should.be.eq('TokensPurchased');
            log.args.operator.should.equal(operator);
            log.args.beneficiary.should.equal(beneficiary);
            log.args.value.should.be.bignumber.equal(value);
            log.args.amount.should.be.bignumber.equal(expectedTokenAmount);
          });

          it('should assign tokens to sender', async function () {
            await transferFromAndCallWithData.call(
              this, beneficiary, this.crowdsale.address, value, { from: operator }
            );
            (await this.erc20Token.balanceOf(beneficiary)).should.be.bignumber.equal(expectedTokenAmount);
          });

          it('should forward funds to wallet', async function () {
            const pre = await this.erc1363Token.balanceOf(wallet);
            await transferFromAndCallWithData.call(
              this, beneficiary, this.crowdsale.address, value, { from: operator }
            );
            const post = await this.erc1363Token.balanceOf(wallet);
            post.minus(pre).should.be.bignumber.equal(value);
          });

          it('reverts on zero-valued payments', async function () {
            await assertRevert(
              transferFromAndCallWithData.call(this, beneficiary, this.crowdsale.address, 0, { from: operator })
            );
          });

          it('reverts using a not accepted ERC1363', async function () {
            this.erc1363Token = this.notAcceptedErc1363Token;
            await assertRevert(
              transferFromAndCallWithData.call(this, beneficiary, this.crowdsale.address, value, { from: operator })
            );
          });
        });

        describe('without data', function () {
          it('should accept payments', async function () {
            await transferFromAndCallWithoutData.call(
              this, beneficiary, this.crowdsale.address, value, { from: operator }
            );
          });

          it('should log purchase', async function () {
            const result = await transferFromAndCallWithoutData.call(
              this, beneficiary, this.crowdsale.address, value, { from: operator }
            );
            const [log] = decodeLogs([result.receipt.logs[2]], Crowdsale, this.crowdsale.address);
            log.event.should.be.eq('TokensPurchased');
            log.args.operator.should.equal(operator);
            log.args.beneficiary.should.equal(beneficiary);
            log.args.value.should.be.bignumber.equal(value);
            log.args.amount.should.be.bignumber.equal(expectedTokenAmount);
          });

          it('should assign tokens to sender', async function () {
            await transferFromAndCallWithoutData.call(
              this, beneficiary, this.crowdsale.address, value, { from: operator }
            );
            (await this.erc20Token.balanceOf(beneficiary)).should.be.bignumber.equal(expectedTokenAmount);
          });

          it('should forward funds to wallet', async function () {
            const pre = await this.erc1363Token.balanceOf(wallet);
            await transferFromAndCallWithoutData.call(
              this, beneficiary, this.crowdsale.address, value, { from: operator }
            );
            const post = await this.erc1363Token.balanceOf(wallet);
            post.minus(pre).should.be.bignumber.equal(value);
          });

          it('reverts on zero-valued payments', async function () {
            await assertRevert(
              transferFromAndCallWithoutData.call(this, beneficiary, this.crowdsale.address, 0, { from: operator })
            );
          });

          it('reverts using a not accepted ERC1363', async function () {
            this.erc1363Token = this.notAcceptedErc1363Token;
            await assertRevert(
              transferFromAndCallWithoutData.call(this, beneficiary, this.crowdsale.address, value, { from: operator })
            );
          });
        });
      });

      describe('via transferAndCall', function () {
        const transferAndCallWithData = function (to, value, opts) {
          return sendTransaction(
            this.erc1363Token,
            'transferAndCall',
            'address,uint256,bytes',
            [to, value, data],
            opts
          );
        };

        const transferAndCallWithoutData = function (to, value, opts) {
          return sendTransaction(
            this.erc1363Token,
            'transferAndCall',
            'address,uint256',
            [to, value],
            opts
          );
        };

        describe('with data', function () {
          it('should accept payments', async function () {
            await transferAndCallWithData.call(this, this.crowdsale.address, value, { from: beneficiary });
          });

          it('should log purchase', async function () {
            const result = await transferAndCallWithData.call(
              this, this.crowdsale.address, value, { from: beneficiary }
            );
            const [log] = decodeLogs([result.receipt.logs[2]], Crowdsale, this.crowdsale.address);
            log.event.should.be.eq('TokensPurchased');
            log.args.operator.should.equal(beneficiary);
            log.args.beneficiary.should.equal(beneficiary);
            log.args.value.should.be.bignumber.equal(value);
            log.args.amount.should.be.bignumber.equal(expectedTokenAmount);
          });

          it('should assign tokens to sender', async function () {
            await transferAndCallWithData.call(this, this.crowdsale.address, value, { from: beneficiary });
            (await this.erc20Token.balanceOf(beneficiary)).should.be.bignumber.equal(expectedTokenAmount);
          });

          it('should forward funds to wallet', async function () {
            const pre = await this.erc1363Token.balanceOf(wallet);
            await transferAndCallWithData.call(this, this.crowdsale.address, value, { from: beneficiary });
            const post = await this.erc1363Token.balanceOf(wallet);
            post.minus(pre).should.be.bignumber.equal(value);
          });

          it('reverts on zero-valued payments', async function () {
            await assertRevert(
              transferAndCallWithData.call(this, this.crowdsale.address, 0, { from: beneficiary })
            );
          });

          it('reverts using a not accepted ERC1363', async function () {
            this.erc1363Token = this.notAcceptedErc1363Token;
            await assertRevert(
              transferAndCallWithData.call(this, this.crowdsale.address, value, { from: beneficiary })
            );
          });
        });

        describe('without data', function () {
          it('should accept payments', async function () {
            await transferAndCallWithoutData.call(this, this.crowdsale.address, value, { from: beneficiary });
          });

          it('should log purchase', async function () {
            const result = await transferAndCallWithoutData.call(
              this, this.crowdsale.address, value, { from: beneficiary }
            );
            const [log] = decodeLogs([result.receipt.logs[2]], Crowdsale, this.crowdsale.address);
            log.event.should.be.eq('TokensPurchased');
            log.args.operator.should.equal(beneficiary);
            log.args.beneficiary.should.equal(beneficiary);
            log.args.value.should.be.bignumber.equal(value);
            log.args.amount.should.be.bignumber.equal(expectedTokenAmount);
          });

          it('should assign tokens to sender', async function () {
            await transferAndCallWithoutData.call(this, this.crowdsale.address, value, { from: beneficiary });
            (await this.erc20Token.balanceOf(beneficiary)).should.be.bignumber.equal(expectedTokenAmount);
          });

          it('should forward funds to wallet', async function () {
            const pre = await this.erc1363Token.balanceOf(wallet);
            await transferAndCallWithoutData.call(this, this.crowdsale.address, value, { from: beneficiary });
            const post = await this.erc1363Token.balanceOf(wallet);
            post.minus(pre).should.be.bignumber.equal(value);
          });

          it('reverts on zero-valued payments', async function () {
            await assertRevert(
              transferAndCallWithoutData.call(this, this.crowdsale.address, 0, { from: beneficiary })
            );
          });

          it('reverts using a not accepted ERC1363', async function () {
            this.erc1363Token = this.notAcceptedErc1363Token;
            await assertRevert(
              transferAndCallWithoutData.call(this, this.crowdsale.address, value, { from: beneficiary })
            );
          });
        });
      });
    });
  });
}

module.exports = {
  shouldBehaveLikeERC1363PayableCrowdsale,
};
