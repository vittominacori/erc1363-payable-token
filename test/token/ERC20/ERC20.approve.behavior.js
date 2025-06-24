const { BN, constants, expectEvent } = require('@openzeppelin/test-helpers');
const { expectRevertCustomError } = require('../../helpers/customError');

function shouldBehaveLikeERC20Approve(initialHolder, spender, balance) {
  describe('approve', function () {
    const approve = function (initialHolder, spender, value) {
      return this.token.approve(spender, value, { from: initialHolder });
    };

    describe('when the spender is not the zero address', function () {
      describe('when the sender has enough balance', function () {
        const value = balance;

        it('emits an approval event', async function () {
          expectEvent(await approve.call(this, initialHolder, spender, value), 'Approval', {
            owner: initialHolder,
            spender: spender,
            value: value,
          });
        });

        describe('when there was no approved value before', function () {
          it('approves the requested value', async function () {
            await approve.call(this, initialHolder, spender, value);

            expect(await this.token.allowance(initialHolder, spender)).to.be.bignumber.equal(value);
          });
        });

        describe('when the spender had an approved value', function () {
          beforeEach(async function () {
            await approve.call(this, initialHolder, spender, new BN(1));
          });

          it('approves the requested value and replaces the previous one', async function () {
            await approve.call(this, initialHolder, spender, value);

            expect(await this.token.allowance(initialHolder, spender)).to.be.bignumber.equal(value);
          });
        });
      });

      describe('when the sender does not have enough balance', function () {
        const value = balance.addn(1);

        it('emits an approval event', async function () {
          expectEvent(await approve.call(this, initialHolder, spender, value), 'Approval', {
            owner: initialHolder,
            spender: spender,
            value: value,
          });
        });

        describe('when there was no approved value before', function () {
          it('approves the requested value', async function () {
            await approve.call(this, initialHolder, spender, value);

            expect(await this.token.allowance(initialHolder, spender)).to.be.bignumber.equal(value);
          });
        });

        describe('when the spender had an approved value', function () {
          beforeEach(async function () {
            await approve.call(this, initialHolder, spender, new BN(1));
          });

          it('approves the requested value and replaces the previous one', async function () {
            await approve.call(this, initialHolder, spender, value);

            expect(await this.token.allowance(initialHolder, spender)).to.be.bignumber.equal(value);
          });
        });
      });
    });

    describe('when the spender is the zero address', function () {
      it('reverts', async function () {
        await expectRevertCustomError(
          approve.call(this, initialHolder, constants.ZERO_ADDRESS, balance),
          `ERC20InvalidSpender`,
          [constants.ZERO_ADDRESS],
        );
      });
    });
  });
}

module.exports = {
  shouldBehaveLikeERC20Approve,
};
