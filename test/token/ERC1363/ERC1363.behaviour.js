const { expect } = require('chai');
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');

const { shouldSupportInterfaces } = require('../../introspection/SupportsInterface.behavior');

const { expectRevertCustomError } = require('../../helpers/customError');

const ERC1363Receiver = artifacts.require('ERC1363ReceiverMock');
const ERC1363Spender = artifacts.require('ERC1363SpenderMock');

function shouldBehaveLikeERC1363([owner, spender, recipient], balance) {
  const value = balance;
  const data = '0x42';

  const RECEIVER_MAGIC_VALUE = '0x88a7ca5c';
  const SPENDER_MAGIC_VALUE = '0x7b04a2d0';

  shouldSupportInterfaces(['ERC165', 'ERC1363']);

  describe('via transferFromAndCall', function () {
    beforeEach(async function () {
      await this.token.approve(spender, value, { from: owner });
    });

    const transferFromAndCallWithData = function (from, to, value, opts) {
      return this.token.methods['transferFromAndCall(address,address,uint256,bytes)'](from, to, value, data, opts);
    };

    const transferFromAndCallWithoutData = function (from, to, value, opts) {
      return this.token.methods['transferFromAndCall(address,address,uint256)'](from, to, value, opts);
    };

    const shouldTransferFromSafely = function (transferFun, data) {
      describe('to a valid receiver contract', function () {
        beforeEach(async function () {
          this.receiver = await ERC1363Receiver.new(RECEIVER_MAGIC_VALUE, false);
          this.to = this.receiver.address;
        });

        it('should call onTransferReceived', async function () {
          const receipt = await transferFun.call(this, owner, this.to, value, { from: spender });

          await expectEvent.inTransaction(receipt.tx, ERC1363Receiver, 'Received', {
            operator: spender,
            sender: owner,
            amount: value,
            data,
          });
        });
      });
    };

    const transferFromWasSuccessful = function (sender, spender, balance) {
      let receiver;

      beforeEach(async function () {
        const receiverContract = await ERC1363Receiver.new(RECEIVER_MAGIC_VALUE, false);
        receiver = receiverContract.address;
      });

      describe('when the sender does not have enough balance', function () {
        const amount = balance + 1;

        describe('with data', function () {
          it('reverts', async function () {
            await expectRevertCustomError(
              transferFromAndCallWithData.call(this, sender, receiver, amount, { from: spender }),
              'ERC20InsufficientAllowance',
              [spender, balance, amount],
            );
          });
        });

        describe('without data', function () {
          it('reverts', async function () {
            await expectRevertCustomError(
              transferFromAndCallWithoutData.call(this, sender, receiver, amount, { from: spender }),
              'ERC20InsufficientAllowance',
              [spender, balance, amount],
            );
          });
        });
      });

      describe('when the sender has enough balance', function () {
        const amount = balance;
        describe('with data', function () {
          it('transfers the requested amount', async function () {
            await transferFromAndCallWithData.call(this, sender, receiver, amount, { from: spender });

            expect(await this.token.balanceOf(sender)).to.be.bignumber.equal(new BN(0));

            expect(await this.token.balanceOf(receiver)).to.be.bignumber.equal(amount);
          });

          it('emits a transfer event', async function () {
            this.receipt = await transferFromAndCallWithData.call(this, sender, receiver, amount, { from: spender });

            expectEvent(this.receipt, 'Transfer', {
              from: sender,
              to: receiver,
              value: amount,
            });
          });
        });

        describe('without data', function () {
          it('transfers the requested amount', async function () {
            await transferFromAndCallWithoutData.call(this, sender, receiver, amount, { from: spender });

            expect(await this.token.balanceOf(sender)).to.be.bignumber.equal(new BN(0));

            expect(await this.token.balanceOf(receiver)).to.be.bignumber.equal(amount);
          });

          it('emits a transfer event', async function () {
            this.receipt = await transferFromAndCallWithoutData.call(this, sender, receiver, amount, {
              from: spender,
            });

            expectEvent(this.receipt, 'Transfer', {
              from: sender,
              to: receiver,
              value: amount,
            });
          });
        });
      });
    };

    describe('with data', function () {
      shouldTransferFromSafely(transferFromAndCallWithData, data);
    });

    describe('without data', function () {
      shouldTransferFromSafely(transferFromAndCallWithoutData, null);
    });

    describe('testing ERC20 behaviours', function () {
      transferFromWasSuccessful(owner, spender, value);
    });

    describe('to a receiver that is not a contract', function () {
      it('reverts', async function () {
        await expectRevertCustomError(
          transferFromAndCallWithoutData.call(this, owner, recipient, value, { from: spender }),
          'ERC1363EOAReceiver',
          [recipient],
        );
      });
    });

    describe('to a receiver contract returning unexpected value', function () {
      it('reverts', async function () {
        const invalidReceiver = await ERC1363Receiver.new(data, false);
        await expectRevertCustomError(
          transferFromAndCallWithoutData.call(this, owner, invalidReceiver.address, value, { from: spender }),
          'ERC1363InvalidReceiver',
          [invalidReceiver.address],
        );
      });
    });

    describe('to a receiver contract that throws', function () {
      it('reverts', async function () {
        const invalidReceiver = await ERC1363Receiver.new(RECEIVER_MAGIC_VALUE, true);
        await expectRevert(
          transferFromAndCallWithoutData.call(this, owner, invalidReceiver.address, value, { from: spender }),
          'ERC1363ReceiverMock: throwing',
        );
      });
    });

    describe('to a contract that does not implement the required function', function () {
      it('reverts', async function () {
        const invalidReceiver = this.token;
        await expectRevertCustomError(
          transferFromAndCallWithoutData.call(this, owner, invalidReceiver.address, value, { from: spender }),
          'ERC1363InvalidReceiver',
          [invalidReceiver.address],
        );
      });
    });
  });

  describe('via transferAndCall', function () {
    const transferAndCallWithData = function (to, value, opts) {
      return this.token.methods['transferAndCall(address,uint256,bytes)'](to, value, data, opts);
    };

    const transferAndCallWithoutData = function (to, value, opts) {
      return this.token.methods['transferAndCall(address,uint256)'](to, value, opts);
    };

    const shouldTransferSafely = function (transferFun, data) {
      describe('to a valid receiver contract', function () {
        beforeEach(async function () {
          this.receiver = await ERC1363Receiver.new(RECEIVER_MAGIC_VALUE, false);
          this.to = this.receiver.address;
        });

        it('should call onTransferReceived', async function () {
          const receipt = await transferFun.call(this, this.to, value, { from: owner });

          await expectEvent.inTransaction(receipt.tx, ERC1363Receiver, 'Received', {
            operator: owner,
            sender: owner,
            amount: value,
            data,
          });
        });
      });
    };

    const transferWasSuccessful = function (sender, balance) {
      let receiver;

      beforeEach(async function () {
        const receiverContract = await ERC1363Receiver.new(RECEIVER_MAGIC_VALUE, false);
        receiver = receiverContract.address;
      });

      describe('when the sender does not have enough balance', function () {
        const amount = balance + 1;

        describe('with data', function () {
          it('reverts', async function () {
            await expectRevert(
              transferAndCallWithData.call(this, receiver, amount, { from: sender }),
              'ERC20InsufficientBalance',
              [sender, balance, amount],
            );
          });
        });

        describe('without data', function () {
          it('reverts', async function () {
            await expectRevertCustomError(
              transferAndCallWithoutData.call(this, receiver, amount, { from: sender }),
              'ERC20InsufficientBalance',
              [sender, balance, amount],
            );
          });
        });
      });

      describe('when the sender has enough balance', function () {
        const amount = balance;
        describe('with data', function () {
          it('transfers the requested amount', async function () {
            await transferAndCallWithData.call(this, receiver, amount, { from: sender });

            expect(await this.token.balanceOf(sender)).to.be.bignumber.equal(new BN(0));

            expect(await this.token.balanceOf(receiver)).to.be.bignumber.equal(amount);
          });

          it('emits a transfer event', async function () {
            this.receipt = await transferAndCallWithData.call(this, receiver, amount, { from: sender });

            expectEvent(this.receipt, 'Transfer', {
              from: sender,
              to: receiver,
              value: amount,
            });
          });
        });

        describe('without data', function () {
          it('transfers the requested amount', async function () {
            await transferAndCallWithoutData.call(this, receiver, amount, { from: sender });

            expect(await this.token.balanceOf(sender)).to.be.bignumber.equal(new BN(0));

            expect(await this.token.balanceOf(receiver)).to.be.bignumber.equal(amount);
          });

          it('emits a transfer event', async function () {
            this.receipt = await transferAndCallWithoutData.call(this, receiver, amount, { from: sender });

            expectEvent(this.receipt, 'Transfer', {
              from: sender,
              to: receiver,
              value: amount,
            });
          });
        });
      });
    };

    describe('with data', function () {
      shouldTransferSafely(transferAndCallWithData, data);
    });

    describe('without data', function () {
      shouldTransferSafely(transferAndCallWithoutData, null);
    });

    describe('testing ERC20 behaviours', function () {
      transferWasSuccessful(owner, value);
    });

    describe('to a receiver that is not a contract', function () {
      it('reverts', async function () {
        await expectRevertCustomError(
          transferAndCallWithoutData.call(this, recipient, value, { from: owner }),
          'ERC1363EOAReceiver',
          [recipient],
        );
      });
    });

    describe('to a receiver contract returning unexpected value', function () {
      it('reverts', async function () {
        const invalidReceiver = await ERC1363Receiver.new(data, false);
        await expectRevertCustomError(
          transferAndCallWithoutData.call(this, invalidReceiver.address, value, { from: owner }),
          'ERC1363InvalidReceiver',
          [invalidReceiver.address],
        );
      });
    });

    describe('to a receiver contract that throws', function () {
      it('reverts', async function () {
        const invalidReceiver = await ERC1363Receiver.new(RECEIVER_MAGIC_VALUE, true);
        await expectRevert(
          transferAndCallWithoutData.call(this, invalidReceiver.address, value, { from: owner }),
          'ERC1363ReceiverMock: throwing',
        );
      });
    });

    describe('to a contract that does not implement the required function', function () {
      it('reverts', async function () {
        const invalidReceiver = this.token;
        await expectRevertCustomError(
          transferAndCallWithoutData.call(this, invalidReceiver.address, value, { from: owner }),
          'ERC1363InvalidReceiver',
          [invalidReceiver.address],
        );
      });
    });
  });

  describe('via approveAndCall', function () {
    const approveAndCallWithData = function (spender, value, opts) {
      return this.token.methods['approveAndCall(address,uint256,bytes)'](spender, value, data, opts);
    };

    const approveAndCallWithoutData = function (spender, value, opts) {
      return this.token.methods['approveAndCall(address,uint256)'](spender, value, opts);
    };

    const shouldApproveSafely = function (approveFun, data) {
      describe('to a valid receiver contract', function () {
        beforeEach(async function () {
          this.spender = await ERC1363Spender.new(SPENDER_MAGIC_VALUE, false);
          this.to = this.spender.address;
        });

        it('should call onApprovalReceived', async function () {
          const receipt = await approveFun.call(this, this.to, value, { from: owner });

          await expectEvent.inTransaction(receipt.tx, ERC1363Spender, 'Approved', {
            sender: owner,
            amount: value,
            data,
          });
        });
      });
    };

    const approveWasSuccessful = function (sender, amount) {
      let spender;

      beforeEach(async function () {
        const spenderContract = await ERC1363Spender.new(SPENDER_MAGIC_VALUE, false);
        spender = spenderContract.address;
      });

      describe('with data', function () {
        it('approves the requested amount', async function () {
          await approveAndCallWithData.call(this, spender, amount, { from: sender });

          expect(await this.token.allowance(sender, spender)).to.be.bignumber.equal(amount);
        });

        it('emits an approval event', async function () {
          this.receipt = await approveAndCallWithData.call(this, spender, amount, { from: sender });

          expectEvent(this.receipt, 'Approval', {
            owner: sender,
            spender,
            value: amount,
          });
        });
      });

      describe('without data', function () {
        it('approves the requested amount', async function () {
          await approveAndCallWithoutData.call(this, spender, amount, { from: sender });

          expect(await this.token.allowance(sender, spender)).to.be.bignumber.equal(amount);
        });

        it('emits an approval event', async function () {
          this.receipt = await approveAndCallWithoutData.call(this, spender, amount, { from: sender });

          expectEvent(this.receipt, 'Approval', {
            owner: sender,
            spender,
            value: amount,
          });
        });
      });
    };

    describe('with data', function () {
      shouldApproveSafely(approveAndCallWithData, data);
    });

    describe('without data', function () {
      shouldApproveSafely(approveAndCallWithoutData, null);
    });

    describe('testing ERC20 behaviours', function () {
      approveWasSuccessful(owner, value);
    });

    describe('to a spender that is not a contract', function () {
      it('reverts', async function () {
        await expectRevertCustomError(
          approveAndCallWithoutData.call(this, recipient, value, { from: owner }),
          'ERC1363EOASpender',
          [recipient],
        );
      });
    });

    describe('to a spender contract returning unexpected value', function () {
      it('reverts', async function () {
        const invalidSpender = await ERC1363Spender.new(data, false);
        await expectRevertCustomError(
          approveAndCallWithoutData.call(this, invalidSpender.address, value, { from: owner }),
          'ERC1363InvalidSpender',
          [invalidSpender.address],
        );
      });
    });

    describe('to a spender contract that throws', function () {
      it('reverts', async function () {
        const invalidSpender = await ERC1363Spender.new(SPENDER_MAGIC_VALUE, true);
        await expectRevert(
          approveAndCallWithoutData.call(this, invalidSpender.address, value, { from: owner }),
          'ERC1363SpenderMock: throwing',
        );
      });
    });

    describe('to a contract that does not implement the required function', function () {
      it('reverts', async function () {
        const invalidSpender = this.token;
        await expectRevertCustomError(
          approveAndCallWithoutData.call(this, invalidSpender.address, value, { from: owner }),
          'ERC1363InvalidSpender',
          [invalidSpender.address],
        );
      });
    });
  });
}

module.exports = {
  shouldBehaveLikeERC1363,
};
