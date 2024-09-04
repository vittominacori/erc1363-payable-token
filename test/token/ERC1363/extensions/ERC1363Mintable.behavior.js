const { constants, expectRevert, expectEvent, BN } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const { expectRevertCustomError } = require('../../../helpers/customError');
const { RevertType } = require('../../../helpers/enums');

const ERC1363Receiver = artifacts.require('ERC1363ReceiverMock');

function shouldBehaveLikeERC1363Mintable(accounts) {
  const [owner, recipient] = accounts;

  const RECEIVER_MAGIC_VALUE = '0x88a7ca5c';

  describe('_mintAndCall', function () {
    const amount = new BN(100);
    const data = '0x42';

    const mintAndCallWithData = function (to, value, opts) {
      return this.token.methods['$_mintAndCall(address,uint256,bytes)'](to, value, data, opts);
    };

    const mintAndCallWithoutData = function (to, value, opts) {
      return this.token.methods['$_mintAndCall(address,uint256)'](to, value, opts);
    };

    const shouldMintAndCallSafely = function (mintAndCallFunction, data) {
      it('calls onTransferReceived', async function () {
        const receipt = await mintAndCallFunction.call(this, this.to, amount, { from: owner });

        await expectEvent.inTransaction(receipt.tx, ERC1363Receiver, 'Received', {
          operator: owner,
          from: constants.ZERO_ADDRESS,
          value: amount,
          data,
        });
      });
    };

    const mintBehavior = function (amount) {
      const value = amount;

      describe('with data', function () {
        it('mints the requested amount', async function () {
          await mintAndCallWithData.call(this, this.to, value, { from: owner });

          expect(await this.token.balanceOf(this.to)).to.be.bignumber.equal(value);
        });

        it('emits a transfer event', async function () {
          expectEvent(await mintAndCallWithData.call(this, this.to, value, { from: owner }), 'Transfer', {
            from: constants.ZERO_ADDRESS,
            to: this.to,
            value,
          });
        });
      });

      describe('without data', function () {
        it('mints the requested amount', async function () {
          await mintAndCallWithoutData.call(this, this.to, value, { from: owner });

          expect(await this.token.balanceOf(this.to)).to.be.bignumber.equal(value);
        });

        it('emits a transfer event', async function () {
          expectEvent(await mintAndCallWithoutData.call(this, this.to, value, { from: owner }), 'Transfer', {
            from: constants.ZERO_ADDRESS,
            to: this.to,
            value,
          });
        });
      });
    };

    describe('to a valid receiver contract', function () {
      beforeEach(async function () {
        this.receiverContract = await ERC1363Receiver.new();
        this.to = this.receiverContract.address;
      });

      describe('with data', function () {
        shouldMintAndCallSafely(mintAndCallWithData, data);
      });

      describe('without data', function () {
        shouldMintAndCallSafely(mintAndCallWithoutData, null);
      });

      describe('testing _mint behavior', function () {
        mintBehavior(amount);
      });
    });

    describe('to an EOA', function () {
      it('reverts', async function () {
        await expectRevertCustomError(
          mintAndCallWithoutData.call(this, recipient, amount, { from: owner }),
          'ERC1363EOAReceiver',
          [recipient],
        );
      });
    });

    describe('to a receiver contract that does not implement the required function', function () {
      it('reverts', async function () {
        const nonReceiver = this.token;
        await expectRevertCustomError(
          mintAndCallWithoutData.call(this, nonReceiver.address, amount, {
            from: owner,
          }),
          'ERC1363InvalidReceiver',
          [nonReceiver.address],
        );
      });
    });

    describe('to a receiver contract that implements the required function but reverts', function () {
      beforeEach(async function () {
        this.invalidReceiver = await ERC1363Receiver.new();
      });

      describe('returning unexpected value', function () {
        it('reverts', async function () {
          await this.invalidReceiver.setUp(data, RevertType.None);
          await expectRevertCustomError(
            mintAndCallWithoutData.call(this, this.invalidReceiver.address, amount, {
              from: owner,
            }),
            'ERC1363InvalidReceiver',
            [this.invalidReceiver.address],
          );
        });
      });

      describe('with reverting message', function () {
        it('reverts', async function () {
          await this.invalidReceiver.setUp(RECEIVER_MAGIC_VALUE, RevertType.RevertWithMessage);
          await expectRevert(
            mintAndCallWithoutData.call(this, this.invalidReceiver.address, amount, {
              from: owner,
            }),
            'ERC1363ReceiverMock: reverting',
          );
        });
      });

      describe('without reverting message', function () {
        it('reverts', async function () {
          await this.invalidReceiver.setUp(RECEIVER_MAGIC_VALUE, RevertType.RevertWithoutMessage);
          await expectRevertCustomError(
            mintAndCallWithoutData.call(this, this.invalidReceiver.address, amount, {
              from: owner,
            }),
            'ERC1363InvalidReceiver',
            [this.invalidReceiver.address],
          );
        });
      });

      describe('with custom error', function () {
        it('reverts', async function () {
          await this.invalidReceiver.setUp(RECEIVER_MAGIC_VALUE, RevertType.RevertWithCustomError);
          await expectRevertCustomError(
            mintAndCallWithoutData.call(this, this.invalidReceiver.address, amount, {
              from: owner,
            }),
            'CustomError',
            [RECEIVER_MAGIC_VALUE],
          );
        });
      });

      describe('with panic', function () {
        it('reverts', async function () {
          await this.invalidReceiver.setUp(RECEIVER_MAGIC_VALUE, RevertType.Panic);
          await expectRevert.unspecified(
            mintAndCallWithoutData.call(this, this.invalidReceiver.address, amount, {
              from: owner,
            }),
          );
        });
      });
    });
  });
}

module.exports = {
  shouldBehaveLikeERC1363Mintable,
};
