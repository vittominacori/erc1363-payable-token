const { shouldSupportInterfaces } = require('../../introspection/SupportsInterface.behavior');
const { assertRevert } = require('../../helpers/assertRevert');
const { decodeLogs } = require('../../helpers/decodeLogs');
const { sendTransaction } = require('../../helpers/sendTransaction');

const ERC1363Payable = artifacts.require('ERC1363PayableMock.sol');

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

function shouldBehaveLikeERC1363Payable ([owner, spender], balance) {
  const value = balance;
  const data = '0x42';

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
        it('should call onERC1363Received', async function () {
          const result = await transferFun.call(this, owner, this.mock.address, value, { from: spender });
          result.receipt.logs.length.should.be.equal(2);
          const [log] = decodeLogs([result.receipt.logs[1]], ERC1363Payable, this.mock.address);
          log.event.should.be.eq('Received');
          log.args._operator.should.be.equal(spender);
          log.args._from.should.be.equal(owner);
          log.args._value.should.be.bignumber.equal(value);
          log.args._data.should.be.equal(data);
        });
      });

      describe('using a not accepted ERC1363', function () {
        it('reverts', async function () {
          this.token = this.notAcceptedToken;
          await assertRevert(transferFun.call(this, owner, this.mock.address, value, { from: spender }));
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
        it('should call onERC1363Received', async function () {
          const result = await transferFun.call(this, this.mock.address, value, { from: owner });
          result.receipt.logs.length.should.be.equal(2);
          const [log] = decodeLogs([result.receipt.logs[1]], ERC1363Payable, this.mock.address);
          log.event.should.be.eq('Received');
          log.args._operator.should.be.equal(owner);
          log.args._from.should.be.equal(owner);
          log.args._value.should.be.bignumber.equal(value);
          log.args._data.should.be.equal(data);
        });
      });

      describe('using a not accepted ERC1363', function () {
        it('reverts', async function () {
          this.token = this.notAcceptedToken;
          await assertRevert(transferFun.call(this, this.mock.address, value, { from: owner }));
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

  shouldSupportInterfaces([
    'ERC1363Receiver',
  ]);
}

module.exports = {
  shouldBehaveLikeERC1363Payable,
};
