const { BN, constants, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { shouldSupportInterfaces } = require('../introspection/SupportsInterface.behavior');
const { ZERO_ADDRESS } = constants;

const ERC20 = artifacts.require('ERC20');
const ERC1363Payable = artifacts.require('ERC1363PayableMock');

function shouldBehaveLikeERC1363Payable ([owner, spender], balance) {
  const value = balance;
  const data = '0x42';

  describe('creating a valid contract', function () {
    describe('if accepted token is the zero address', function () {
      it('reverts', async function () {
        await expectRevert(ERC1363Payable.new(ZERO_ADDRESS), 'ERC1363Payable: acceptedToken is zero address');
      });
    });

    describe('if token does not support ERC1363 interface', function () {
      it('reverts', async function () {
        const name = 'TEST';
        const symbol = 'TEST';

        const erc20Token = await ERC20.new(name, symbol);
        await expectRevert.unspecified(ERC1363Payable.new(erc20Token.address));
      });
    });
  });

  describe('via transferFromAndCall', function () {
    beforeEach(async function () {
      await this.token.approve(spender, value, { from: owner });
      await this.notAcceptedToken.approve(spender, value, { from: owner });
    });

    const transferFromAndCallWithData = function (from, to, value, opts) {
      return this.token.methods['transferFromAndCall(address,address,uint256,bytes)'](from, to, value, data, opts);
    };

    const transferFromAndCallWithoutData = function (from, to, value, opts) {
      return this.token.methods['transferFromAndCall(address,address,uint256)'](from, to, value, opts);
    };

    const shouldTransferFromSafely = function (transferFun, data) {
      describe('using an accepted ERC1363', function () {
        it('should call onTransferReceived', async function () {
          const receipt = await transferFun.call(this, owner, this.mock.address, value, { from: spender });

          await expectEvent.inTransaction(receipt.tx, ERC1363Payable, 'TokensReceived', {
            operator: spender,
            sender: owner,
            amount: value,
            data,
          });
        });

        it('should execute transferReceived', async function () {
          let transferNumber = await this.mock.transferNumber();
          expect(transferNumber).to.be.bignumber.equal(new BN(0));
          await transferFun.call(this, owner, this.mock.address, value, { from: spender });
          transferNumber = await this.mock.transferNumber();
          expect(transferNumber).to.be.bignumber.equal(new BN(1));
        });
      });

      describe('using a not accepted ERC1363', function () {
        it('reverts', async function () {
          this.token = this.notAcceptedToken;
          await expectRevert(
            transferFun.call(this, owner, this.mock.address, value, { from: spender }),
            'ERC1363Payable: acceptedToken is not message sender',
          );
        });
      });
    };

    describe('with data', function () {
      shouldTransferFromSafely(transferFromAndCallWithData, data);
    });

    describe('without data', function () {
      shouldTransferFromSafely(transferFromAndCallWithoutData, null);
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
      describe('using an accepted ERC1363', function () {
        it('should call onTransferReceived', async function () {
          const receipt = await transferFun.call(this, this.mock.address, value, { from: owner });

          await expectEvent.inTransaction(receipt.tx, ERC1363Payable, 'TokensReceived', {
            operator: owner,
            sender: owner,
            amount: value,
            data,
          });
        });

        it('should execute transferReceived', async function () {
          let transferNumber = await this.mock.transferNumber();
          expect(transferNumber).to.be.bignumber.equal(new BN(0));
          await transferFun.call(this, this.mock.address, value, { from: owner });
          transferNumber = await this.mock.transferNumber();
          expect(transferNumber).to.be.bignumber.equal(new BN(1));
        });
      });

      describe('using a not accepted ERC1363', function () {
        it('reverts', async function () {
          this.token = this.notAcceptedToken;
          await expectRevert(
            transferFun.call(this, this.mock.address, value, { from: owner }),
            'ERC1363Payable: acceptedToken is not message sender',
          );
        });
      });
    };

    describe('with data', function () {
      shouldTransferSafely(transferAndCallWithData, data);
    });

    describe('without data', function () {
      shouldTransferSafely(transferAndCallWithoutData, null);
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
      describe('using an accepted ERC1363', function () {
        it('should call onApprovalReceived', async function () {
          const receipt = await approveFun.call(this, this.mock.address, value, { from: owner });

          await expectEvent.inTransaction(receipt.tx, ERC1363Payable, 'TokensApproved', {
            sender: owner,
            amount: value,
            data,
          });
        });

        it('should execute approvalReceived', async function () {
          let approvalNumber = await this.mock.approvalNumber();
          expect(approvalNumber).to.be.bignumber.equal(new BN(0));
          await approveFun.call(this, this.mock.address, value, { from: owner });
          approvalNumber = await this.mock.approvalNumber();
          expect(approvalNumber).to.be.bignumber.equal(new BN(1));
        });
      });

      describe('using a not accepted ERC1363', function () {
        it('reverts', async function () {
          this.token = this.notAcceptedToken;
          await expectRevert(
            approveFun.call(this, this.mock.address, value, { from: owner }),
            'ERC1363Payable: acceptedToken is not message sender',
          );
        });
      });
    };

    describe('with data', function () {
      shouldApproveSafely(approveAndCallWithData, data);
    });

    describe('without data', function () {
      shouldApproveSafely(approveAndCallWithoutData, null);
    });
  });

  shouldSupportInterfaces(['ERC165', 'ERC1363Receiver', 'ERC1363Spender']);
}

module.exports = {
  shouldBehaveLikeERC1363Payable,
};
