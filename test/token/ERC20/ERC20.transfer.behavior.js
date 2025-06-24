const { BN, constants, expectEvent } = require('@openzeppelin/test-helpers');
const { expectRevertCustomError } = require('../../helpers/customError');

function shouldBehaveLikeERC20Transfer(initialHolder, receiver, spender, balance) {
  describe('transfer', function () {
    const transfer = function (from, to, value) {
      return this.token.transfer(to, value, { from });
    };

    describe('when the recipient is not the zero address', function () {
      describe('when the sender does not have enough balance', function () {
        const value = balance.addn(1);

        it('reverts', async function () {
          await expectRevertCustomError(
            transfer.call(this, initialHolder, receiver, value),
            'ERC20InsufficientBalance',
            [initialHolder, balance, value],
          );
        });
      });

      describe('when the sender transfers all balance', function () {
        const value = balance;

        it('transfers the requested value', async function () {
          await transfer.call(this, initialHolder, receiver, value);

          expect(await this.token.balanceOf(initialHolder)).to.be.bignumber.equal('0');

          expect(await this.token.balanceOf(receiver)).to.be.bignumber.equal(value);
        });

        it('emits a transfer event', async function () {
          expectEvent(await transfer.call(this, initialHolder, receiver, value), 'Transfer', {
            from: initialHolder,
            to: receiver,
            value: value,
          });
        });
      });

      describe('when the sender transfers zero tokens', function () {
        const value = new BN(0);

        it('transfers the requested value', async function () {
          await transfer.call(this, initialHolder, receiver, value);

          expect(await this.token.balanceOf(initialHolder)).to.be.bignumber.equal(balance);

          expect(await this.token.balanceOf(receiver)).to.be.bignumber.equal('0');
        });

        it('emits a transfer event', async function () {
          expectEvent(await transfer.call(this, initialHolder, receiver, value), 'Transfer', {
            from: initialHolder,
            to: receiver,
            value: value,
          });
        });
      });
    });

    describe('when the recipient is the zero address', function () {
      it('reverts', async function () {
        await expectRevertCustomError(
          transfer.call(this, initialHolder, constants.ZERO_ADDRESS, balance),
          'ERC20InvalidReceiver',
          [constants.ZERO_ADDRESS],
        );
      });
    });
  });

  describe('transferFrom', function () {
    const transferFrom = function (from, to, value, opts) {
      return this.token.transferFrom(from, to, value, opts);
    };

    describe('when the token initialHolder is not the zero address', function () {
      describe('when the recipient is not the zero address', function () {
        describe('when the spender has enough allowance', function () {
          beforeEach(async function () {
            await this.token.approve(spender, balance, { from: initialHolder });
          });

          describe('when the token initialHolder has enough balance', function () {
            const value = balance;

            it('transfers the requested value', async function () {
              await transferFrom.call(this, initialHolder, receiver, value, { from: spender });

              expect(await this.token.balanceOf(initialHolder)).to.be.bignumber.equal('0');

              expect(await this.token.balanceOf(receiver)).to.be.bignumber.equal(value);
            });

            it('decreases the spender allowance', async function () {
              await transferFrom.call(this, initialHolder, receiver, value, { from: spender });

              expect(await this.token.allowance(initialHolder, spender)).to.be.bignumber.equal('0');
            });

            it('emits a transfer event', async function () {
              expectEvent(
                await transferFrom.call(this, initialHolder, receiver, value, { from: spender }),
                'Transfer',
                {
                  from: initialHolder,
                  to: receiver,
                  value: value,
                },
              );
            });

            it('does not emit an approval event', async function () {
              expectEvent.notEmitted(
                await transferFrom.call(this, initialHolder, receiver, value, { from: spender }),
                'Approval',
              );
            });
          });

          describe('when the token initialHolder does not have enough balance', function () {
            const value = balance;

            beforeEach('reducing balance', async function () {
              await this.token.transfer(receiver, 1, { from: initialHolder });
            });

            it('reverts', async function () {
              await expectRevertCustomError(
                transferFrom.call(this, initialHolder, receiver, value, { from: spender }),
                'ERC20InsufficientBalance',
                [initialHolder, value.subn(1), value],
              );
            });
          });
        });

        describe('when the spender does not have enough allowance', function () {
          const allowance = balance.subn(1);

          beforeEach(async function () {
            await this.token.approve(spender, allowance, { from: initialHolder });
          });

          describe('when the token initialHolder has enough balance', function () {
            const value = balance;

            it('reverts', async function () {
              await expectRevertCustomError(
                transferFrom.call(this, initialHolder, receiver, value, { from: spender }),
                'ERC20InsufficientAllowance',
                [spender, allowance, value],
              );
            });
          });

          describe('when the token initialHolder does not have enough balance', function () {
            const value = allowance;

            beforeEach('reducing balance', async function () {
              await this.token.transfer(receiver, 2, { from: initialHolder });
            });

            it('reverts', async function () {
              await expectRevertCustomError(
                transferFrom.call(this, initialHolder, receiver, value, { from: spender }),
                'ERC20InsufficientBalance',
                [initialHolder, value.subn(1), value],
              );
            });
          });
        });

        describe('when the spender has unlimited allowance', function () {
          beforeEach(async function () {
            await this.token.approve(spender, constants.MAX_UINT256, { from: initialHolder });
          });

          it('does not decrease the spender allowance', async function () {
            await transferFrom.call(this, initialHolder, receiver, 1, { from: spender });

            expect(await this.token.allowance(initialHolder, spender)).to.be.bignumber.equal(constants.MAX_UINT256);
          });

          it('does not emit an approval event', async function () {
            expectEvent.notEmitted(
              await transferFrom.call(this, initialHolder, receiver, 1, { from: spender }),
              'Approval',
            );
          });
        });
      });

      describe('when the recipient is the zero address', function () {
        const value = balance;
        const to = constants.ZERO_ADDRESS;

        beforeEach(async function () {
          await this.token.approve(spender, value, { from: initialHolder });
        });

        it('reverts', async function () {
          await expectRevertCustomError(
            transferFrom.call(this, initialHolder, to, value, { from: spender }),
            'ERC20InvalidReceiver',
            [constants.ZERO_ADDRESS],
          );
        });
      });
    });

    describe('when the token initialHolder is the zero address', function () {
      const value = 0;
      const from = constants.ZERO_ADDRESS;

      it('reverts', async function () {
        await expectRevertCustomError(
          transferFrom.call(this, from, receiver, value, { from: spender }),
          'ERC20InvalidApprover',
          [constants.ZERO_ADDRESS],
        );
      });
    });
  });
}

module.exports = {
  shouldBehaveLikeERC20Transfer,
};
