const { expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const { shouldSupportInterfaces } = require('../../introspection/SupportsInterface.behavior');
const { expectRevertCustomError } = require('../../helpers/customError');
const { Enum } = require('../../helpers/enums');

const ERC1363Receiver = artifacts.require('ERC1363ReceiverMock');
const ERC1363Spender = artifacts.require('ERC1363SpenderMock');

const RevertType = Enum('None', 'RevertWithoutMessage', 'RevertWithMessage', 'RevertWithCustomError', 'Panic');

function shouldBehaveLikeERC1363(initialSupply, accounts) {
  const [owner, spender, recipient] = accounts;

  const RECEIVER_MAGIC_VALUE = '0x88a7ca5c';
  const SPENDER_MAGIC_VALUE = '0x7b04a2d0';

  shouldSupportInterfaces(['ERC165', 'ERC1363']);

  describe('transfers', function () {
    const initialBalance = initialSupply;
    const data = '0x42';

    describe('via transferAndCall', function () {
      const transferAndCallWithData = function (to, value, opts) {
        return this.token.methods['transferAndCall(address,uint256,bytes)'](to, value, data, opts);
      };

      const transferAndCallWithoutData = function (to, value, opts) {
        return this.token.methods['transferAndCall(address,uint256)'](to, value, opts);
      };

      const shouldTransferSafely = function (transferFunction, data) {
        it('calls onTransferReceived', async function () {
          const receipt = await transferFunction.call(this, this.to, initialBalance, { from: owner });

          await expectEvent.inTransaction(receipt.tx, ERC1363Receiver, 'Received', {
            operator: owner,
            from: owner,
            value: initialBalance,
            data,
          });
        });
      };

      const erc20TransferBehavior = function (owner, initialBalance) {
        describe('when the sender does not have enough balance', function () {
          const value = initialBalance + 1;

          describe('with data', function () {
            it('reverts', async function () {
              await expectRevertCustomError(
                transferAndCallWithData.call(this, this.to, value, { from: owner }),
                'ERC20InsufficientBalance',
                [owner, initialBalance, value],
              );
            });
          });

          describe('without data', function () {
            it('reverts', async function () {
              await expectRevertCustomError(
                transferAndCallWithoutData.call(this, this.to, value, { from: owner }),
                'ERC20InsufficientBalance',
                [owner, initialBalance, value],
              );
            });
          });
        });

        describe('when the sender has enough balance', function () {
          const value = initialBalance;

          describe('with data', function () {
            it('transfers the requested amount', async function () {
              await transferAndCallWithData.call(this, this.to, value, { from: owner });

              expect(await this.token.balanceOf(owner)).to.be.bignumber.equal('0');

              expect(await this.token.balanceOf(this.to)).to.be.bignumber.equal(value);
            });

            it('emits a transfer event', async function () {
              expectEvent(await transferAndCallWithData.call(this, this.to, value, { from: owner }), 'Transfer', {
                from: owner,
                to: this.to,
                value,
              });
            });
          });

          describe('without data', function () {
            it('transfers the requested amount', async function () {
              await transferAndCallWithoutData.call(this, this.to, value, { from: owner });

              expect(await this.token.balanceOf(owner)).to.be.bignumber.equal('0');

              expect(await this.token.balanceOf(this.to)).to.be.bignumber.equal(value);
            });

            it('emits a transfer event', async function () {
              expectEvent(await transferAndCallWithoutData.call(this, this.to, value, { from: owner }), 'Transfer', {
                from: owner,
                to: this.to,
                value,
              });
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
          shouldTransferSafely(transferAndCallWithData, data);
        });

        describe('without data', function () {
          shouldTransferSafely(transferAndCallWithoutData, null);
        });

        describe('testing ERC20 transfer behavior', function () {
          erc20TransferBehavior(owner, initialBalance);
        });
      });

      describe('to an EOA', function () {
        it('reverts', async function () {
          await expectRevertCustomError(
            transferAndCallWithoutData.call(this, recipient, initialBalance, { from: owner }),
            'ERC1363EOAReceiver',
            [recipient],
          );
        });
      });

      describe('to a receiver contract that does not implement the required function', function () {
        it('reverts', async function () {
          const nonReceiver = this.token;
          await expectRevertCustomError(
            transferAndCallWithoutData.call(this, nonReceiver.address, initialBalance, { from: owner }),
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
              transferAndCallWithoutData.call(this, this.invalidReceiver.address, initialBalance, { from: owner }),
              'ERC1363InvalidReceiver',
              [this.invalidReceiver.address],
            );
          });
        });

        describe('with reverting message', function () {
          it('reverts', async function () {
            await this.invalidReceiver.setUp(RECEIVER_MAGIC_VALUE, RevertType.RevertWithMessage);
            await expectRevert(
              transferAndCallWithoutData.call(this, this.invalidReceiver.address, initialBalance, { from: owner }),
              'ERC1363ReceiverMock: reverting',
            );
          });
        });

        describe('without reverting message', function () {
          it('reverts', async function () {
            await this.invalidReceiver.setUp(RECEIVER_MAGIC_VALUE, RevertType.RevertWithoutMessage);
            await expectRevertCustomError(
              transferAndCallWithoutData.call(this, this.invalidReceiver.address, initialBalance, { from: owner }),
              'ERC1363InvalidReceiver',
              [this.invalidReceiver.address],
            );
          });
        });

        describe('with custom error', function () {
          it('reverts', async function () {
            await this.invalidReceiver.setUp(RECEIVER_MAGIC_VALUE, RevertType.RevertWithCustomError);
            await expectRevertCustomError(
              transferAndCallWithoutData.call(this, this.invalidReceiver.address, initialBalance, { from: owner }),
              'CustomError',
              [RECEIVER_MAGIC_VALUE],
            );
          });
        });

        describe('with panic', function () {
          it('reverts', async function () {
            await this.invalidReceiver.setUp(RECEIVER_MAGIC_VALUE, RevertType.Panic);
            await expectRevert.unspecified(
              transferAndCallWithoutData.call(this, this.invalidReceiver.address, initialBalance, { from: owner }),
            );
          });
        });
      });
    });

    describe('via transferFromAndCall', function () {
      beforeEach(async function () {
        await this.token.approve(spender, initialBalance, { from: owner });
      });

      const transferFromAndCallWithData = function (from, to, value, opts) {
        return this.token.methods['transferFromAndCall(address,address,uint256,bytes)'](from, to, value, data, opts);
      };

      const transferFromAndCallWithoutData = function (from, to, value, opts) {
        return this.token.methods['transferFromAndCall(address,address,uint256)'](from, to, value, opts);
      };

      const shouldTransferFromSafely = function (transferFunction, data) {
        it('calls onTransferReceived', async function () {
          const receipt = await transferFunction.call(this, owner, this.to, initialBalance, { from: spender });

          await expectEvent.inTransaction(receipt.tx, ERC1363Receiver, 'Received', {
            operator: spender,
            from: owner,
            value: initialBalance,
            data,
          });
        });
      };

      const erc20TransferFromBehavior = function (owner, spender, initialBalance) {
        describe('when the sender does not have enough balance', function () {
          const value = initialBalance + 1;

          describe('with data', function () {
            it('reverts', async function () {
              await expectRevertCustomError(
                transferFromAndCallWithData.call(this, owner, this.to, value, { from: spender }),
                'ERC20InsufficientAllowance',
                [spender, initialBalance, value],
              );
            });
          });

          describe('without data', function () {
            it('reverts', async function () {
              await expectRevertCustomError(
                transferFromAndCallWithoutData.call(this, owner, this.to, value, { from: spender }),
                'ERC20InsufficientAllowance',
                [spender, initialBalance, value],
              );
            });
          });
        });

        describe('when the sender has enough balance', function () {
          const value = initialBalance;

          describe('with data', function () {
            it('transfers the requested amount', async function () {
              await transferFromAndCallWithData.call(this, owner, this.to, value, { from: spender });

              expect(await this.token.balanceOf(owner)).to.be.bignumber.equal('');

              expect(await this.token.balanceOf(this.to)).to.be.bignumber.equal(value);
            });

            it('emits a transfer event', async function () {
              expectEvent(
                await transferFromAndCallWithData.call(this, owner, this.to, value, { from: spender }),
                'Transfer',
                { from: owner, to: this.to, value },
              );
            });
          });

          describe('without data', function () {
            it('transfers the requested amount', async function () {
              await transferFromAndCallWithoutData.call(this, owner, this.to, value, { from: spender });

              expect(await this.token.balanceOf(owner)).to.be.bignumber.equal('0');

              expect(await this.token.balanceOf(this.to)).to.be.bignumber.equal(value);
            });

            it('emits a transfer event', async function () {
              expectEvent(
                await transferFromAndCallWithoutData.call(this, owner, this.to, value, { from: spender }),
                'Transfer',
                { from: owner, to: this.to, value },
              );
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
          shouldTransferFromSafely(transferFromAndCallWithData, data);
        });

        describe('without data', function () {
          shouldTransferFromSafely(transferFromAndCallWithoutData, null);
        });

        describe('testing ERC20 transferFrom behavior', function () {
          erc20TransferFromBehavior(owner, spender, initialBalance);
        });
      });

      describe('to an EOA', function () {
        it('reverts', async function () {
          await expectRevertCustomError(
            transferFromAndCallWithoutData.call(this, owner, recipient, initialBalance, { from: spender }),
            'ERC1363EOAReceiver',
            [recipient],
          );
        });
      });

      describe('to a receiver contract that does not implement the required function', function () {
        it('reverts', async function () {
          const nonReceiver = this.token;
          await expectRevertCustomError(
            transferFromAndCallWithoutData.call(this, owner, nonReceiver.address, initialBalance, { from: spender }),
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
              transferFromAndCallWithoutData.call(this, owner, this.invalidReceiver.address, initialBalance, {
                from: spender,
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
              transferFromAndCallWithoutData.call(this, owner, this.invalidReceiver.address, initialBalance, {
                from: spender,
              }),
              'ERC1363ReceiverMock: reverting',
            );
          });
        });

        describe('without reverting message', function () {
          it('reverts', async function () {
            await this.invalidReceiver.setUp(RECEIVER_MAGIC_VALUE, RevertType.RevertWithoutMessage);
            await expectRevertCustomError(
              transferFromAndCallWithoutData.call(this, owner, this.invalidReceiver.address, initialBalance, {
                from: spender,
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
              transferFromAndCallWithoutData.call(this, owner, this.invalidReceiver.address, initialBalance, {
                from: spender,
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
              transferFromAndCallWithoutData.call(this, owner, this.invalidReceiver.address, initialBalance, {
                from: spender,
              }),
            );
          });
        });
      });
    });
  });

  describe('approvals', function () {
    const initialBalance = initialSupply;
    const data = '0x42';

    describe('via approveAndCall', function () {
      const approveAndCallWithData = function (spender, value, opts) {
        return this.token.methods['approveAndCall(address,uint256,bytes)'](spender, value, data, opts);
      };

      const approveAndCallWithoutData = function (spender, value, opts) {
        return this.token.methods['approveAndCall(address,uint256)'](spender, value, opts);
      };

      const shouldApproveSafely = function (approveFunction, data) {
        it('calls onApprovalReceived', async function () {
          const receipt = await approveFunction.call(this, this.spender, initialBalance, { from: owner });

          await expectEvent.inTransaction(receipt.tx, ERC1363Spender, 'Approved', {
            owner,
            value: initialBalance,
            data,
          });
        });
      };

      const erc20ApproveBehavior = function (owner, initialBalance) {
        describe('with data', function () {
          it('approves the requested amount', async function () {
            await approveAndCallWithData.call(this, this.spender, initialBalance, { from: owner });

            expect(await this.token.allowance(owner, this.spender)).to.be.bignumber.equal(initialBalance);
          });

          it('emits an approval event', async function () {
            expectEvent(
              await approveAndCallWithData.call(this, this.spender, initialBalance, { from: owner }),
              'Approval',
              {
                owner,
                spender: this.spender,
                value: initialBalance,
              },
            );
          });
        });

        describe('without data', function () {
          it('approves the requested amount', async function () {
            await approveAndCallWithoutData.call(this, this.spender, initialBalance, { from: owner });

            expect(await this.token.allowance(owner, this.spender)).to.be.bignumber.equal(initialBalance);
          });

          it('emits an approval event', async function () {
            expectEvent(
              await approveAndCallWithoutData.call(this, this.spender, initialBalance, { from: owner }),
              'Approval',
              {
                owner,
                spender: this.spender,
                value: initialBalance,
              },
            );
          });
        });
      };

      describe('to a valid receiver contract', function () {
        beforeEach(async function () {
          this.spenderContract = await ERC1363Spender.new();
          this.spender = this.spenderContract.address;
        });

        describe('with data', function () {
          shouldApproveSafely(approveAndCallWithData, data);
        });

        describe('without data', function () {
          shouldApproveSafely(approveAndCallWithoutData, null);
        });

        describe('testing ERC20 approve behavior', function () {
          erc20ApproveBehavior(owner, initialBalance);
        });
      });

      describe('to an EOA', function () {
        it('reverts', async function () {
          await expectRevertCustomError(
            approveAndCallWithoutData.call(this, recipient, initialBalance, { from: owner }),
            'ERC1363EOASpender',
            [recipient],
          );
        });
      });

      describe('to a spender contract that does not implement the required function', function () {
        it('reverts', async function () {
          const nonSpender = this.token;
          await expectRevertCustomError(
            approveAndCallWithoutData.call(this, nonSpender.address, initialBalance, { from: owner }),
            'ERC1363InvalidSpender',
            [nonSpender.address],
          );
        });
      });

      describe('to a spender contract that implements the required function but reverts', function () {
        beforeEach(async function () {
          this.invalidSpender = await ERC1363Spender.new();
        });

        describe('returning unexpected value', function () {
          it('reverts', async function () {
            await this.invalidSpender.setUp(data, RevertType.None);
            await expectRevertCustomError(
              approveAndCallWithoutData.call(this, this.invalidSpender.address, initialBalance, { from: owner }),
              'ERC1363InvalidSpender',
              [this.invalidSpender.address],
            );
          });
        });

        describe('with reverting message', function () {
          it('reverts', async function () {
            await this.invalidSpender.setUp(SPENDER_MAGIC_VALUE, RevertType.RevertWithMessage);
            await expectRevert(
              approveAndCallWithoutData.call(this, this.invalidSpender.address, initialBalance, { from: owner }),
              'ERC1363SpenderMock: reverting',
            );
          });
        });

        describe('without reverting message', function () {
          it('reverts', async function () {
            await this.invalidSpender.setUp(SPENDER_MAGIC_VALUE, RevertType.RevertWithoutMessage);
            await expectRevertCustomError(
              approveAndCallWithoutData.call(this, this.invalidSpender.address, initialBalance, { from: owner }),
              'ERC1363InvalidSpender',
              [this.invalidSpender.address],
            );
          });
        });

        describe('with custom error', function () {
          it('reverts', async function () {
            await this.invalidSpender.setUp(SPENDER_MAGIC_VALUE, RevertType.RevertWithCustomError);
            await expectRevertCustomError(
              approveAndCallWithoutData.call(this, this.invalidSpender.address, initialBalance, { from: owner }),
              'CustomError',
              [SPENDER_MAGIC_VALUE],
            );
          });
        });

        describe('with panic', function () {
          it('reverts', async function () {
            await this.invalidSpender.setUp(SPENDER_MAGIC_VALUE, RevertType.Panic);
            await expectRevert.unspecified(
              approveAndCallWithoutData.call(this, this.invalidSpender.address, initialBalance, { from: owner }),
            );
          });
        });
      });
    });
  });
}

module.exports = {
  shouldBehaveLikeERC1363,
};
