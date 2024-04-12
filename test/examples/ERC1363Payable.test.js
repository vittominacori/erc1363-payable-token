const { BN, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const { expectRevertCustomError } = require('../helpers/customError');

const ERC1363 = artifacts.require('$ERC1363');
const ERC1363Payable = artifacts.require('$ERC1363Payable');
const ERC20 = artifacts.require('$ERC20Mock');

contract('ERC1363Payable', function ([initialHolder, spender]) {
  const name = 'My Token';
  const symbol = 'MTKN';
  const balance = new BN(100);

  context('creating valid contract', function () {
    describe('with invalid ERC1363', function () {
      it('should fail', async function () {
        const invalidToken = await ERC20.new();

        await expectRevert.unspecified(ERC1363Payable.new(invalidToken.address));
      });
    });
  });

  context('once created', function () {
    beforeEach(async function () {
      this.token = await ERC1363.new(name, symbol);
      this.notAcceptedToken = await ERC1363.new(name, symbol);

      await this.token.$_mint(initialHolder, balance);
      await this.notAcceptedToken.$_mint(initialHolder, balance);

      this.mock = await ERC1363Payable.new(this.token.address);
    });

    it('acceptedToken should be right set', async function () {
      expect(await this.mock.acceptedToken()).to.be.equal(this.token.address);
    });

    describe('receiving payments', function () {
      const value = balance;
      const data = '0x42';

      const transferFromAndCallWithData = function (token, from, to, value, opts) {
        return token.methods['transferFromAndCall(address,address,uint256,bytes)'](from, to, value, data, opts);
      };

      const transferFromAndCallWithoutData = function (token, from, to, value, opts) {
        return token.methods['transferFromAndCall(address,address,uint256)'](from, to, value, opts);
      };

      const transferAndCallWithData = function (token, to, value, opts) {
        return token.methods['transferAndCall(address,uint256,bytes)'](to, value, data, opts);
      };

      const transferAndCallWithoutData = function (token, to, value, opts) {
        return token.methods['transferAndCall(address,uint256)'](to, value, opts);
      };

      const approveAndCallWithData = function (token, spender, value, opts) {
        return token.methods['approveAndCall(address,uint256,bytes)'](spender, value, data, opts);
      };

      const approveAndCallWithoutData = function (token, spender, value, opts) {
        return token.methods['approveAndCall(address,uint256)'](spender, value, opts);
      };

      context('with accepted token', function () {
        describe('via transferFromAndCall', function () {
          beforeEach(async function () {
            await this.token.approve(spender, value, { from: initialHolder });
          });

          const shouldTransferFromSafely = function (transferFun) {
            it('should increase user credits', async function () {
              let creditOf = await this.mock.creditOf(initialHolder);
              expect(creditOf).to.be.bignumber.equal(new BN(0));
              await transferFun(this.token, initialHolder, this.mock.address, value, { from: spender });
              creditOf = await this.mock.creditOf(initialHolder);
              expect(creditOf).to.be.bignumber.equal(value);
            });
          };

          describe('with data', function () {
            shouldTransferFromSafely(transferFromAndCallWithData);
          });

          describe('without data', function () {
            shouldTransferFromSafely(transferFromAndCallWithoutData);
          });
        });

        describe('via transferAndCall', function () {
          const shouldTransferSafely = function (transferFun) {
            it('should increase user credits', async function () {
              let creditOf = await this.mock.creditOf(initialHolder);
              expect(creditOf).to.be.bignumber.equal(new BN(0));
              await transferFun(this.token, this.mock.address, value, { from: initialHolder });
              creditOf = await this.mock.creditOf(initialHolder);
              expect(creditOf).to.be.bignumber.equal(value);
            });
          };

          describe('with data', function () {
            shouldTransferSafely(transferAndCallWithData);
          });

          describe('without data', function () {
            shouldTransferSafely(transferAndCallWithoutData);
          });
        });

        describe('via approveAndCall', function () {
          const shouldApproveSafely = function (approveFun) {
            it('should increase user credits', async function () {
              let creditOf = await this.mock.creditOf(initialHolder);
              expect(creditOf).to.be.bignumber.equal(new BN(0));
              await approveFun(this.token, this.mock.address, value, { from: initialHolder });
              creditOf = await this.mock.creditOf(initialHolder);
              expect(creditOf).to.be.bignumber.equal(value);
            });
          };

          describe('with data', function () {
            shouldApproveSafely(approveAndCallWithData);
          });

          describe('without data', function () {
            shouldApproveSafely(approveAndCallWithoutData);
          });
        });
      });

      context('with not accepted token', function () {
        describe('via transferFromAndCall', function () {
          beforeEach(async function () {
            await this.notAcceptedToken.approve(spender, value, { from: initialHolder });
          });

          it('reverts', async function () {
            await expectRevertCustomError(
              transferFromAndCallWithData(this.notAcceptedToken, initialHolder, this.mock.address, value, {
                from: spender,
              }),
              'NotAcceptedToken',
              [this.notAcceptedToken.address, this.token.address],
            );

            await expectRevertCustomError(
              transferFromAndCallWithoutData(this.notAcceptedToken, initialHolder, this.mock.address, value, {
                from: spender,
              }),
              'NotAcceptedToken',
              [this.notAcceptedToken.address, this.token.address],
            );
          });
        });

        describe('via transferAndCall', function () {
          it('reverts', async function () {
            await expectRevertCustomError(
              transferAndCallWithData(this.notAcceptedToken, this.mock.address, value, { from: initialHolder }),
              'NotAcceptedToken',
              [this.notAcceptedToken.address, this.token.address],
            );

            await expectRevertCustomError(
              transferAndCallWithoutData(this.notAcceptedToken, this.mock.address, value, { from: initialHolder }),
              'NotAcceptedToken',
              [this.notAcceptedToken.address, this.token.address],
            );
          });
        });

        describe('via approveAndCall', function () {
          it('reverts', async function () {
            await expectRevertCustomError(
              approveAndCallWithData(this.notAcceptedToken, this.mock.address, value, { from: initialHolder }),
              'NotAcceptedToken',
              [this.notAcceptedToken.address, this.token.address],
            );

            await expectRevertCustomError(
              approveAndCallWithoutData(this.notAcceptedToken, this.mock.address, value, { from: initialHolder }),
              'NotAcceptedToken',
              [this.notAcceptedToken.address, this.token.address],
            );
          });
        });
      });
    });
  });
});
