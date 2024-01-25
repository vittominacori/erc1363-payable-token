const { BN } = require('@openzeppelin/test-helpers');

const { expectRevertCustomError } = require('../helpers/customError');

const ERC1363ReturnFalseOnERC20 = artifacts.require('$ERC1363ReturnFalseOnERC20Mock');

contract('ERC1363ReturnFalseOnERC20', function (accounts) {
  const [owner, spender, recipient] = accounts;

  const name = 'My Token';
  const symbol = 'MTKN';
  const initialSupply = new BN(100);

  const data = '0x42';

  beforeEach(async function () {
    this.token = await ERC1363ReturnFalseOnERC20.new(name, symbol);
    await this.token.$_mint(owner, initialSupply);
  });

  context('when ERC20 methods return false', function () {
    describe('transfers', function () {
      describe('via transferAndCall', function () {
        const transferAndCallWithData = function (to, value, opts) {
          return this.token.methods['transferAndCall(address,uint256,bytes)'](to, value, data, opts);
        };

        const transferAndCallWithoutData = function (to, value, opts) {
          return this.token.methods['transferAndCall(address,uint256)'](to, value, opts);
        };

        describe('with data', function () {
          it('reverts', async function () {
            await expectRevertCustomError(
              transferAndCallWithData.call(this, recipient, initialSupply, { from: owner }),
              'ERC1363TransferFailed',
              [recipient, initialSupply],
            );
          });
        });

        describe('without data', function () {
          it('reverts', async function () {
            await expectRevertCustomError(
              transferAndCallWithoutData.call(this, recipient, initialSupply, { from: owner }),
              'ERC1363TransferFailed',
              [recipient, initialSupply],
            );
          });
        });
      });

      describe('via transferFromAndCall', function () {
        beforeEach(async function () {
          await this.token.approve(spender, initialSupply, { from: owner });
        });

        const transferFromAndCallWithData = function (from, to, value, opts) {
          return this.token.methods['transferFromAndCall(address,address,uint256,bytes)'](from, to, value, data, opts);
        };

        const transferFromAndCallWithoutData = function (from, to, value, opts) {
          return this.token.methods['transferFromAndCall(address,address,uint256)'](from, to, value, opts);
        };

        describe('with data', function () {
          it('reverts', async function () {
            await expectRevertCustomError(
              transferFromAndCallWithData.call(this, owner, recipient, initialSupply, { from: spender }),
              'ERC1363TransferFromFailed',
              [owner, recipient, initialSupply],
            );
          });
        });

        describe('without data', function () {
          it('reverts', async function () {
            await expectRevertCustomError(
              transferFromAndCallWithoutData.call(this, owner, recipient, initialSupply, { from: spender }),
              'ERC1363TransferFromFailed',
              [owner, recipient, initialSupply],
            );
          });
        });
      });
    });

    describe('approvals', function () {
      describe('via approveAndCall', function () {
        const approveAndCallWithData = function (spender, value, opts) {
          return this.token.methods['approveAndCall(address,uint256,bytes)'](spender, value, data, opts);
        };

        const approveAndCallWithoutData = function (spender, value, opts) {
          return this.token.methods['approveAndCall(address,uint256)'](spender, value, opts);
        };

        describe('with data', function () {
          it('reverts', async function () {
            await expectRevertCustomError(
              approveAndCallWithData.call(this, recipient, initialSupply, { from: owner }),
              'ERC1363ApproveFailed',
              [recipient, initialSupply],
            );
          });
        });

        describe('without data', function () {
          it('reverts', async function () {
            await expectRevertCustomError(
              approveAndCallWithoutData.call(this, recipient, initialSupply, { from: owner }),
              'ERC1363ApproveFailed',
              [recipient, initialSupply],
            );
          });
        });
      });
    });
  });
});
