const { BN, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const ERC1363Guardian = artifacts.require('ERC1363GuardianMock');

function shouldBehaveLikeERC1363Guardian([owner, spender], balance) {
  const value = balance;
  const data = '0x42';

  beforeEach(async function () {
    this.mock = await ERC1363Guardian.new(this.token.address);
  });

  describe('receiving transfers', function () {
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
        it('should call onTransferReceived', async function () {
          const receipt = await transferFun.call(this, owner, this.mock.address, value, { from: spender });

          await expectEvent.inTransaction(receipt.tx, ERC1363Guardian, 'TokensReceived', {
            token: this.token.address,
            operator: spender,
            from: owner,
            value: value,
            data,
          });
        });

        it('should execute _transferReceived', async function () {
          let transferNumber = await this.mock.transferNumber();
          expect(transferNumber).to.be.bignumber.equal(new BN(0));
          await transferFun.call(this, owner, this.mock.address, value, { from: spender });
          transferNumber = await this.mock.transferNumber();
          expect(transferNumber).to.be.bignumber.equal(new BN(1));
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
        it('should call onTransferReceived', async function () {
          const receipt = await transferFun.call(this, this.mock.address, value, { from: owner });

          await expectEvent.inTransaction(receipt.tx, ERC1363Guardian, 'TokensReceived', {
            operator: owner,
            from: owner,
            value: value,
            data,
          });
        });

        it('should execute _transferReceived', async function () {
          let transferNumber = await this.mock.transferNumber();
          expect(transferNumber).to.be.bignumber.equal(new BN(0));
          await transferFun.call(this, this.mock.address, value, { from: owner });
          transferNumber = await this.mock.transferNumber();
          expect(transferNumber).to.be.bignumber.equal(new BN(1));
        });
      };

      describe('with data', function () {
        shouldTransferSafely(transferAndCallWithData, data);
      });

      describe('without data', function () {
        shouldTransferSafely(transferAndCallWithoutData, null);
      });
    });
  });

  describe('receiving approvals', function () {
    describe('via approveAndCall', function () {
      const approveAndCallWithData = function (spender, value, opts) {
        return this.token.methods['approveAndCall(address,uint256,bytes)'](spender, value, data, opts);
      };

      const approveAndCallWithoutData = function (spender, value, opts) {
        return this.token.methods['approveAndCall(address,uint256)'](spender, value, opts);
      };

      const shouldApproveSafely = function (approveFun, data) {
        it('should call onApprovalReceived', async function () {
          const receipt = await approveFun.call(this, this.mock.address, value, { from: owner });

          await expectEvent.inTransaction(receipt.tx, ERC1363Guardian, 'TokensApproved', {
            token: this.token.address,
            owner: owner,
            value: value,
            data,
          });
        });

        it('should execute _approvalReceived', async function () {
          let approvalNumber = await this.mock.approvalNumber();
          expect(approvalNumber).to.be.bignumber.equal(new BN(0));
          await approveFun.call(this, this.mock.address, value, { from: owner });
          approvalNumber = await this.mock.approvalNumber();
          expect(approvalNumber).to.be.bignumber.equal(new BN(1));
        });
      };

      describe('with data', function () {
        shouldApproveSafely(approveAndCallWithData, data);
      });

      describe('without data', function () {
        shouldApproveSafely(approveAndCallWithoutData, null);
      });
    });
  });
}

module.exports = {
  shouldBehaveLikeERC1363Guardian,
};
