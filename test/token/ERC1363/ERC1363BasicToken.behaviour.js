const { shouldSupportInterfaces } = require('../../introspection/SupportsInterface.behavior');
const { assertRevert } = require('../../helpers/assertRevert');
const { decodeLogs } = require('../../helpers/decodeLogs');
const { sendTransaction } = require('../../helpers/sendTransaction');

const ERC20Receiver = artifacts.require('ERC20ReceiverMock.sol');

const BigNumber = web3.BigNumber;

require('chai')
  .use(require('chai-bignumber')(BigNumber))
  .should();

function shouldBehaveLikeERC1363BasicToken ([owner, spender, recipient], balance) {
  const value = balance;
  const data = '0x42';

  const RECEIVER_MAGIC_VALUE = '0x4fc35859';

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
      describe('to a valid receiver contract', function () {
        beforeEach(async function () {
          this.receiver = await ERC20Receiver.new(RECEIVER_MAGIC_VALUE, false);
          this.to = this.receiver.address;
        });

        it('should call onERC20Received', async function () {
          const result = await transferFun.call(this, owner, this.to, value, { from: spender });
          result.receipt.logs.length.should.be.equal(2);
          const [log] = decodeLogs([result.receipt.logs[1]], ERC20Receiver, this.receiver.address);
          log.event.should.be.eq('Received');
          log.args._operator.should.be.equal(spender);
          log.args._from.should.be.equal(owner);
          log.args._value.should.be.bignumber.equal(value);
          log.args._data.should.be.equal(data);
        });
      });
    };

    describe('with data', function () {
      shouldTransferFromSafely(transferFromAndCallWithData, data);
    });

    describe('without data', function () {
      shouldTransferFromSafely(transferFromAndCallWithoutData, '0x');
    });

    describe('to a receiver that is not a contract', function () {
      it('reverts', async function () {
        await assertRevert(transferFromAndCallWithoutData.call(this, owner, recipient, value, { from: owner }));
      });
    });

    describe('to a receiver contract returning unexpected value', function () {
      it('reverts', async function () {
        const invalidReceiver = await ERC20Receiver.new(data, false);
        await assertRevert(
          transferFromAndCallWithoutData.call(this, owner, invalidReceiver.address, value, { from: spender })
        );
      });
    });

    describe('to a receiver contract that throws', function () {
      it('reverts', async function () {
        const invalidReceiver = await ERC20Receiver.new(RECEIVER_MAGIC_VALUE, true);
        await assertRevert(
          transferFromAndCallWithoutData.call(this, owner, invalidReceiver.address, value, { from: spender })
        );
      });
    });

    describe('to a contract that does not implement the required function', function () {
      it('reverts', async function () {
        const invalidReceiver = this.token;
        await assertRevert(
          transferFromAndCallWithoutData.call(this, owner, invalidReceiver.address, value, { from: spender })
        );
      });
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
      describe('to a valid receiver contract', function () {
        beforeEach(async function () {
          this.receiver = await ERC20Receiver.new(RECEIVER_MAGIC_VALUE, false);
          this.to = this.receiver.address;
        });

        it('should call onERC20Received', async function () {
          const result = await transferFun.call(this, this.to, value, { from: owner });
          result.receipt.logs.length.should.be.equal(2);
          const [log] = decodeLogs([result.receipt.logs[1]], ERC20Receiver, this.receiver.address);
          log.event.should.be.eq('Received');
          log.args._operator.should.be.equal(owner);
          log.args._from.should.be.equal(owner);
          log.args._value.should.be.bignumber.equal(value);
          log.args._data.should.be.equal(data);
        });
      });
    };

    describe('with data', function () {
      shouldTransferSafely(transferAndCallWithData, data);
    });

    describe('without data', function () {
      shouldTransferSafely(transferAndCallWithoutData, '0x');
    });

    describe('to a receiver that is not a contract', function () {
      it('reverts', async function () {
        await assertRevert(transferAndCallWithoutData.call(this, recipient, value, { from: owner }));
      });
    });

    describe('to a receiver contract returning unexpected value', function () {
      it('reverts', async function () {
        const invalidReceiver = await ERC20Receiver.new(data, false);
        await assertRevert(transferAndCallWithoutData.call(this, invalidReceiver.address, value, { from: owner }));
      });
    });

    describe('to a receiver contract that throws', function () {
      it('reverts', async function () {
        const invalidReceiver = await ERC20Receiver.new(RECEIVER_MAGIC_VALUE, true);
        await assertRevert(transferAndCallWithoutData.call(this, invalidReceiver.address, value, { from: owner }));
      });
    });

    describe('to a contract that does not implement the required function', function () {
      it('reverts', async function () {
        const invalidReceiver = this.token;
        await assertRevert(transferAndCallWithoutData.call(this, invalidReceiver.address, value, { from: owner }));
      });
    });
  });

  shouldSupportInterfaces([
    'ERC1363',
  ]);
}

module.exports = {
  shouldBehaveLikeERC1363BasicToken,
};
