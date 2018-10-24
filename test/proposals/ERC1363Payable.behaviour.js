const shouldFail = require('openzeppelin-solidity/test/helpers/shouldFail');
const { decodeLogs } = require('openzeppelin-solidity/test/helpers/decodeLogs');
const { sendTransaction } = require('openzeppelin-solidity/test/helpers/sendTransaction');
const { shouldSupportInterfaces } = require('../introspection/SupportsInterface.behavior');
const { ZERO_ADDRESS } = require('openzeppelin-solidity/test/helpers/constants');

const ERC20 = artifacts.require('ERC20');
const ERC1363Payable = artifacts.require('ERC1363PayableMock');

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

function shouldBehaveLikeERC1363Payable ([owner, spender], balance) {
  const value = balance;
  const data = '0x42';

  describe('creating a valid contract', function () {
    describe('if accepted token is the zero address', function () {
      it('reverts', async function () {
        await shouldFail.reverting(ERC1363Payable.new(ZERO_ADDRESS));
      });
    });

    describe('if token does not support ERC1363 interface', function () {
      it('reverts', async function () {
        const erc20Token = await ERC20.new();
        await shouldFail.reverting(ERC1363Payable.new(erc20Token.address));
      });
    });
  });

  describe('via transferFromAndCall', function () {
    beforeEach(async function () {
      await this.token.approve(spender, value, { from: owner });
    });

    const transferFromAndCallWithData = function (from, to, value, opts) {
      return sendTransaction(
        this.token,
        'transferFromAndCall',
        'address,address,uint256,bytes',
        [from, to, value, data],
        opts
      );
    };

    const transferFromAndCallWithoutData = function (from, to, value, opts) {
      return sendTransaction(
        this.token,
        'transferFromAndCall',
        'address,address,uint256',
        [from, to, value],
        opts
      );
    };

    const shouldTransferFromSafely = function (transferFun, data) {
      describe('using an accepted ERC1363', function () {
        it('should call onTransferReceived', async function () {
          const result = await transferFun.call(this, owner, this.mock.address, value, { from: spender });
          result.receipt.logs.length.should.be.equal(2);
          const [log] = decodeLogs([result.receipt.logs[1]], ERC1363Payable, this.mock.address);
          log.event.should.be.eq('TokensReceived');
          log.args.operator.should.be.equal(spender);
          log.args.from.should.be.equal(owner);
          log.args.value.should.be.bignumber.equal(value);
          log.args.data.should.be.equal(data);
        });

        it('should execute transferReceived', async function () {
          let transferNumber = await this.mock.transferNumber();
          transferNumber.should.be.bignumber.equal(0);
          await transferFun.call(this, owner, this.mock.address, value, { from: spender });
          transferNumber = await this.mock.transferNumber();
          transferNumber.should.be.bignumber.equal(1);
        });
      });

      describe('using a not accepted ERC1363', function () {
        it('reverts', async function () {
          this.token = this.notAcceptedToken;
          await shouldFail.reverting(transferFun.call(this, owner, this.mock.address, value, { from: spender }));
        });
      });
    };

    describe('with data', function () {
      shouldTransferFromSafely(transferFromAndCallWithData, data);
    });

    describe('without data', function () {
      shouldTransferFromSafely(transferFromAndCallWithoutData, '0x');
    });
  });

  describe('via transferAndCall', function () {
    const transferAndCallWithData = function (to, value, opts) {
      return sendTransaction(
        this.token,
        'transferAndCall',
        'address,uint256,bytes',
        [to, value, data],
        opts
      );
    };

    const transferAndCallWithoutData = function (to, value, opts) {
      return sendTransaction(
        this.token,
        'transferAndCall',
        'address,uint256',
        [to, value],
        opts
      );
    };

    const shouldTransferSafely = function (transferFun, data) {
      describe('using an accepted ERC1363', function () {
        it('should call onTransferReceived', async function () {
          const result = await transferFun.call(this, this.mock.address, value, { from: owner });
          result.receipt.logs.length.should.be.equal(2);
          const [log] = decodeLogs([result.receipt.logs[1]], ERC1363Payable, this.mock.address);
          log.event.should.be.eq('TokensReceived');
          log.args.operator.should.be.equal(owner);
          log.args.from.should.be.equal(owner);
          log.args.value.should.be.bignumber.equal(value);
          log.args.data.should.be.equal(data);
        });

        it('should execute transferReceived', async function () {
          let transferNumber = await this.mock.transferNumber();
          transferNumber.should.be.bignumber.equal(0);
          await transferFun.call(this, this.mock.address, value, { from: owner });
          transferNumber = await this.mock.transferNumber();
          transferNumber.should.be.bignumber.equal(1);
        });
      });

      describe('using a not accepted ERC1363', function () {
        it('reverts', async function () {
          this.token = this.notAcceptedToken;
          await shouldFail.reverting(transferFun.call(this, this.mock.address, value, { from: owner }));
        });
      });
    };

    describe('with data', function () {
      shouldTransferSafely(transferAndCallWithData, data);
    });

    describe('without data', function () {
      shouldTransferSafely(transferAndCallWithoutData, '0x');
    });
  });

  describe('via approveAndCall', function () {
    const approveAndCallWithData = function (spender, value, opts) {
      return sendTransaction(
        this.token,
        'approveAndCall',
        'address,uint256,bytes',
        [spender, value, data],
        opts
      );
    };

    const approveAndCallWithoutData = function (spender, value, opts) {
      return sendTransaction(
        this.token,
        'approveAndCall',
        'address,uint256',
        [spender, value],
        opts
      );
    };

    const shouldApproveSafely = function (approveFun, data) {
      describe('using an accepted ERC1363', function () {
        it('should call onApprovalReceived', async function () {
          const result = await approveFun.call(this, this.mock.address, value, { from: owner });
          result.receipt.logs.length.should.be.equal(2);
          const [log] = decodeLogs([result.receipt.logs[1]], ERC1363Payable, this.mock.address);
          log.event.should.be.eq('TokensApproved');
          log.args.owner.should.be.equal(owner);
          log.args.value.should.be.bignumber.equal(value);
          log.args.data.should.be.equal(data);
        });

        it('should execute approvalReceived', async function () {
          let approvalNumber = await this.mock.approvalNumber();
          approvalNumber.should.be.bignumber.equal(0);
          await approveFun.call(this, this.mock.address, value, { from: owner });
          approvalNumber = await this.mock.approvalNumber();
          approvalNumber.should.be.bignumber.equal(1);
        });
      });

      describe('using a not accepted ERC1363', function () {
        it('reverts', async function () {
          this.token = this.notAcceptedToken;
          await shouldFail.reverting(approveFun.call(this, this.mock.address, value, { from: owner }));
        });
      });
    };

    describe('with data', function () {
      shouldApproveSafely(approveAndCallWithData, data);
    });

    describe('without data', function () {
      shouldApproveSafely(approveAndCallWithoutData, '0x');
    });
  });

  shouldSupportInterfaces([
    'ERC1363Receiver',
    'ERC1363Spender',
  ]);
}

module.exports = {
  shouldBehaveLikeERC1363Payable,
};
