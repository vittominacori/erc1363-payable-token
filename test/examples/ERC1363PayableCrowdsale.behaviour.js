const { BN, constants, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { ZERO_ADDRESS } = constants;

const Crowdsale = artifacts.require('ERC1363PayableCrowdsale');

function shouldBehaveLikeERC1363PayableCrowdsale ([deployer, wallet, beneficiary, operator]) {
  const rate = new BN(1);
  const value = new BN('1000000000000000000');
  const tokenSupply = new BN('10000000000000000000000');
  const expectedTokenAmount = rate.mul(value);
  const data = '0x42';

  it('requires a non-null ERC20 token', async function () {
    await expectRevert.unspecified(
      Crowdsale.new(rate, wallet, ZERO_ADDRESS, this.erc1363Token.address, { from: deployer }),
    );
  });

  it('requires a non-zero rate', async function () {
    await expectRevert.unspecified(
      Crowdsale.new(0, wallet, this.erc20Token.address, this.erc1363Token.address, { from: deployer }),
    );
  });

  it('requires a non-null wallet', async function () {
    await expectRevert.unspecified(
      Crowdsale.new(rate, ZERO_ADDRESS, this.erc20Token.address, this.erc1363Token.address, { from: deployer }),
    );
  });

  it('requires a non-null ERC1363 token', async function () {
    await expectRevert(
      Crowdsale.new(rate, wallet, this.erc20Token.address, ZERO_ADDRESS, { from: deployer }),
      'ERC1363Payable: acceptedToken is zero address',
    );
  });

  it('requires a ERC1363 valid token', async function () {
    await expectRevert.unspecified(
      Crowdsale.new(rate, wallet, this.erc20Token.address, this.erc20Token.address, { from: deployer }),
    );
  });

  context('once deployed', async function () {
    beforeEach(async function () {
      this.crowdsale = await Crowdsale.new(rate, wallet, this.erc20Token.address, this.erc1363Token.address, {
        from: deployer,
      });
      await this.erc20Token.transfer(this.crowdsale.address, tokenSupply);
    });

    it('has rate', async function () {
      expect(await this.crowdsale.rate()).to.be.bignumber.equal(rate);
    });

    it('has wallet', async function () {
      expect(await this.crowdsale.wallet()).to.equal(wallet);
    });

    it('has token', async function () {
      expect(await this.crowdsale.token()).to.equal(this.erc20Token.address);
    });

    describe('accepting payments', function () {
      describe('via transferFromAndCall', function () {
        beforeEach(async function () {
          await this.erc1363Token.approve(operator, value, { from: beneficiary });
        });

        const transferFromAndCallWithData = function (from, to, value, opts) {
          return this.erc1363Token.methods['transferFromAndCall(address,address,uint256,bytes)'](
            from,
            to,
            value,
            data,
            opts,
          );
        };

        const transferFromAndCallWithoutData = function (from, to, value, opts) {
          return this.erc1363Token.methods['transferFromAndCall(address,address,uint256)'](from, to, value, opts);
        };

        describe('with data', function () {
          it('should accept payments', async function () {
            await transferFromAndCallWithData.call(this, beneficiary, this.crowdsale.address, value, {
              from: operator,
            });
          });

          it('should log purchase', async function () {
            const receipt = await transferFromAndCallWithData.call(this, beneficiary, this.crowdsale.address, value, {
              from: operator,
            });

            await expectEvent.inTransaction(receipt.tx, Crowdsale, 'TokensPurchased', {
              operator,
              beneficiary,
              value,
              amount: expectedTokenAmount,
            });
          });

          it('should assign tokens to sender', async function () {
            await transferFromAndCallWithData.call(this, beneficiary, this.crowdsale.address, value, {
              from: operator,
            });
            expect(await this.erc20Token.balanceOf(beneficiary)).to.be.bignumber.equal(expectedTokenAmount);
          });

          it('should increase token raised', async function () {
            const pre = await this.crowdsale.tokenRaised();
            expect(pre).to.be.bignumber.equal(new BN(0));
            await transferFromAndCallWithData.call(this, beneficiary, this.crowdsale.address, value, {
              from: operator,
            });
            const post = await this.crowdsale.tokenRaised();
            expect(post).to.be.bignumber.equal(value);
          });

          it('should forward funds to wallet', async function () {
            const pre = await this.erc1363Token.balanceOf(wallet);
            await transferFromAndCallWithData.call(this, beneficiary, this.crowdsale.address, value, {
              from: operator,
            });
            const post = await this.erc1363Token.balanceOf(wallet);
            expect(post.sub(pre)).to.be.bignumber.equal(value);
          });

          it('reverts on zero-valued payments', async function () {
            await expectRevert.unspecified(
              transferFromAndCallWithData.call(this, beneficiary, this.crowdsale.address, 0, { from: operator }),
            );
          });

          it('reverts using a not accepted ERC1363', async function () {
            this.erc1363Token = this.notAcceptedErc1363Token;
            await expectRevert.unspecified(
              transferFromAndCallWithData.call(this, beneficiary, this.crowdsale.address, value, { from: operator }),
            );
          });
        });

        describe('without data', function () {
          it('should accept payments', async function () {
            await transferFromAndCallWithoutData.call(this, beneficiary, this.crowdsale.address, value, {
              from: operator,
            });
          });

          it('should log purchase', async function () {
            const receipt = await transferFromAndCallWithoutData.call(
              this,
              beneficiary,
              this.crowdsale.address,
              value,
              { from: operator },
            );

            await expectEvent.inTransaction(receipt.tx, Crowdsale, 'TokensPurchased', {
              operator,
              beneficiary,
              value,
              amount: expectedTokenAmount,
            });
          });

          it('should assign tokens to sender', async function () {
            await transferFromAndCallWithoutData.call(this, beneficiary, this.crowdsale.address, value, {
              from: operator,
            });
            expect(await this.erc20Token.balanceOf(beneficiary)).to.be.bignumber.equal(expectedTokenAmount);
          });

          it('should increase token raised', async function () {
            const pre = await this.crowdsale.tokenRaised();
            expect(pre).to.be.bignumber.equal(new BN(0));
            await transferFromAndCallWithoutData.call(this, beneficiary, this.crowdsale.address, value, {
              from: operator,
            });
            const post = await this.crowdsale.tokenRaised();
            expect(post).to.be.bignumber.equal(value);
          });

          it('should forward funds to wallet', async function () {
            const pre = await this.erc1363Token.balanceOf(wallet);
            await transferFromAndCallWithoutData.call(this, beneficiary, this.crowdsale.address, value, {
              from: operator,
            });
            const post = await this.erc1363Token.balanceOf(wallet);
            expect(post.sub(pre)).to.be.bignumber.equal(value);
          });

          it('reverts on zero-valued payments', async function () {
            await expectRevert.unspecified(
              transferFromAndCallWithoutData.call(this, beneficiary, this.crowdsale.address, 0, { from: operator }),
            );
          });

          it('reverts using a not accepted ERC1363', async function () {
            this.erc1363Token = this.notAcceptedErc1363Token;
            await expectRevert.unspecified(
              transferFromAndCallWithoutData.call(this, beneficiary, this.crowdsale.address, value, { from: operator }),
            );
          });
        });
      });

      describe('via transferAndCall', function () {
        const transferAndCallWithData = function (to, value, opts) {
          return this.erc1363Token.methods['transferAndCall(address,uint256,bytes)'](to, value, data, opts);
        };

        const transferAndCallWithoutData = function (to, value, opts) {
          return this.erc1363Token.methods['transferAndCall(address,uint256)'](to, value, opts);
        };

        describe('with data', function () {
          it('should accept payments', async function () {
            await transferAndCallWithData.call(this, this.crowdsale.address, value, { from: beneficiary });
          });

          it('should log purchase', async function () {
            const receipt = await transferAndCallWithData.call(this, this.crowdsale.address, value, {
              from: beneficiary,
            });

            await expectEvent.inTransaction(receipt.tx, Crowdsale, 'TokensPurchased', {
              operator: beneficiary,
              beneficiary,
              value,
              amount: expectedTokenAmount,
            });
          });

          it('should assign tokens to sender', async function () {
            await transferAndCallWithData.call(this, this.crowdsale.address, value, { from: beneficiary });
            expect(await this.erc20Token.balanceOf(beneficiary)).to.be.bignumber.equal(expectedTokenAmount);
          });

          it('should increase token raised', async function () {
            const pre = await this.crowdsale.tokenRaised();
            expect(pre).to.be.bignumber.equal(new BN(0));
            await transferAndCallWithData.call(this, this.crowdsale.address, value, { from: beneficiary });
            const post = await this.crowdsale.tokenRaised();
            expect(post).to.be.bignumber.equal(value);
          });

          it('should forward funds to wallet', async function () {
            const pre = await this.erc1363Token.balanceOf(wallet);
            await transferAndCallWithData.call(this, this.crowdsale.address, value, { from: beneficiary });
            const post = await this.erc1363Token.balanceOf(wallet);
            expect(post.sub(pre)).to.be.bignumber.equal(value);
          });

          it('reverts on zero-valued payments', async function () {
            await expectRevert.unspecified(
              transferAndCallWithData.call(this, this.crowdsale.address, 0, { from: beneficiary }),
            );
          });

          it('reverts using a not accepted ERC1363', async function () {
            this.erc1363Token = this.notAcceptedErc1363Token;
            await expectRevert.unspecified(
              transferAndCallWithData.call(this, this.crowdsale.address, value, { from: beneficiary }),
            );
          });
        });

        describe('without data', function () {
          it('should accept payments', async function () {
            await transferAndCallWithoutData.call(this, this.crowdsale.address, value, { from: beneficiary });
          });

          it('should log purchase', async function () {
            const receipt = await transferAndCallWithoutData.call(this, this.crowdsale.address, value, {
              from: beneficiary,
            });

            await expectEvent.inTransaction(receipt.tx, Crowdsale, 'TokensPurchased', {
              operator: beneficiary,
              beneficiary,
              value,
              amount: expectedTokenAmount,
            });
          });

          it('should assign tokens to sender', async function () {
            await transferAndCallWithoutData.call(this, this.crowdsale.address, value, { from: beneficiary });
            expect(await this.erc20Token.balanceOf(beneficiary)).to.be.bignumber.equal(expectedTokenAmount);
          });

          it('should increase token raised', async function () {
            const pre = await this.crowdsale.tokenRaised();
            expect(pre).to.be.bignumber.equal(new BN(0));
            await transferAndCallWithoutData.call(this, this.crowdsale.address, value, { from: beneficiary });
            const post = await this.crowdsale.tokenRaised();
            expect(post).to.be.bignumber.equal(value);
          });

          it('should forward funds to wallet', async function () {
            const pre = await this.erc1363Token.balanceOf(wallet);
            await transferAndCallWithoutData.call(this, this.crowdsale.address, value, { from: beneficiary });
            const post = await this.erc1363Token.balanceOf(wallet);
            expect(post.sub(pre)).to.be.bignumber.equal(value);
          });

          it('reverts on zero-valued payments', async function () {
            await expectRevert.unspecified(
              transferAndCallWithoutData.call(this, this.crowdsale.address, 0, { from: beneficiary }),
            );
          });

          it('reverts using a not accepted ERC1363', async function () {
            this.erc1363Token = this.notAcceptedErc1363Token;
            await expectRevert.unspecified(
              transferAndCallWithoutData.call(this, this.crowdsale.address, value, { from: beneficiary }),
            );
          });
        });
      });

      describe('via approveAndCall', function () {
        const approveAndCallWithData = function (spender, value, opts) {
          return this.erc1363Token.methods['approveAndCall(address,uint256,bytes)'](spender, value, data, opts);
        };

        const approveAndCallWithoutData = function (spender, value, opts) {
          return this.erc1363Token.methods['approveAndCall(address,uint256)'](spender, value, opts);
        };

        describe('with data', function () {
          it('should accept payments', async function () {
            await approveAndCallWithData.call(this, this.crowdsale.address, value, { from: beneficiary });
          });

          it('should log purchase', async function () {
            const receipt = await approveAndCallWithData.call(this, this.crowdsale.address, value, {
              from: beneficiary,
            });

            await expectEvent.inTransaction(receipt.tx, Crowdsale, 'TokensPurchased', {
              operator: beneficiary,
              beneficiary,
              value,
              amount: expectedTokenAmount,
            });
          });

          it('should assign tokens to sender', async function () {
            await approveAndCallWithData.call(this, this.crowdsale.address, value, { from: beneficiary });
            expect(await this.erc20Token.balanceOf(beneficiary)).to.be.bignumber.equal(expectedTokenAmount);
          });

          it('should increase token raised', async function () {
            const pre = await this.crowdsale.tokenRaised();
            expect(pre).to.be.bignumber.equal(new BN(0));
            await approveAndCallWithData.call(this, this.crowdsale.address, value, { from: beneficiary });
            const post = await this.crowdsale.tokenRaised();
            expect(post).to.be.bignumber.equal(value);
          });

          it('should forward funds to wallet', async function () {
            const pre = await this.erc1363Token.balanceOf(wallet);
            await approveAndCallWithData.call(this, this.crowdsale.address, value, { from: beneficiary });
            const post = await this.erc1363Token.balanceOf(wallet);
            expect(post.sub(pre)).to.be.bignumber.equal(value);
          });

          it('reverts on zero-valued payments', async function () {
            await expectRevert.unspecified(
              approveAndCallWithData.call(this, this.crowdsale.address, 0, { from: beneficiary }),
            );
          });

          it('reverts using a not accepted ERC1363', async function () {
            this.erc1363Token = this.notAcceptedErc1363Token;
            await expectRevert.unspecified(
              approveAndCallWithData.call(this, this.crowdsale.address, value, { from: beneficiary }),
            );
          });
        });

        describe('without data', function () {
          it('should accept payments', async function () {
            await approveAndCallWithoutData.call(this, this.crowdsale.address, value, { from: beneficiary });
          });

          it('should log purchase', async function () {
            const receipt = await approveAndCallWithoutData.call(this, this.crowdsale.address, value, {
              from: beneficiary,
            });

            await expectEvent.inTransaction(receipt.tx, Crowdsale, 'TokensPurchased', {
              operator: beneficiary,
              beneficiary,
              value,
              amount: expectedTokenAmount,
            });
          });

          it('should assign tokens to sender', async function () {
            await approveAndCallWithoutData.call(this, this.crowdsale.address, value, { from: beneficiary });
            expect(await this.erc20Token.balanceOf(beneficiary)).to.be.bignumber.equal(expectedTokenAmount);
          });

          it('should increase token raised', async function () {
            const pre = await this.crowdsale.tokenRaised();
            expect(pre).to.be.bignumber.equal(new BN(0));
            await approveAndCallWithoutData.call(this, this.crowdsale.address, value, { from: beneficiary });
            const post = await this.crowdsale.tokenRaised();
            expect(post).to.be.bignumber.equal(value);
          });

          it('should forward funds to wallet', async function () {
            const pre = await this.erc1363Token.balanceOf(wallet);
            await approveAndCallWithoutData.call(this, this.crowdsale.address, value, { from: beneficiary });
            const post = await this.erc1363Token.balanceOf(wallet);
            expect(post.sub(pre)).to.be.bignumber.equal(value);
          });

          it('reverts on zero-valued payments', async function () {
            await expectRevert.unspecified(
              approveAndCallWithoutData.call(this, this.crowdsale.address, 0, { from: beneficiary }),
            );
          });

          it('reverts using a not accepted ERC1363', async function () {
            this.erc1363Token = this.notAcceptedErc1363Token;
            await expectRevert.unspecified(
              approveAndCallWithoutData.call(this, this.crowdsale.address, value, { from: beneficiary }),
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
