const { BN, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const { shouldBehaveLikeERC1363Guardian } = require('./ERC1363Guardian.behavior');
const { expectRevertCustomError } = require('../helpers/customError');

const ERC1363 = artifacts.require('$ERC1363');
const ERC1363Payable = artifacts.require('$ERC1363PayableMock');
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

  context('ERC1363Payable behavior', function () {
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

    context('with accepted token', function () {
      describe('accept payments and behave like a ERC1363Guardian', function () {
        shouldBehaveLikeERC1363Guardian([initialHolder, spender], balance);
      });
    });

    context('with not accepted token', function () {
      const value = balance;
      const data = '0x42';

      describe('receiving transfers', function () {
        describe('via transferFromAndCall', function () {
          beforeEach(async function () {
            await this.notAcceptedToken.approve(spender, value, { from: initialHolder });
          });

          const transferFromAndCallWithData = function (from, to, value, opts) {
            return this.notAcceptedToken.methods['transferFromAndCall(address,address,uint256,bytes)'](
              from,
              to,
              value,
              data,
              opts,
            );
          };

          const transferFromAndCallWithoutData = function (from, to, value, opts) {
            return this.notAcceptedToken.methods['transferFromAndCall(address,address,uint256)'](from, to, value, opts);
          };

          it('reverts', async function () {
            await expectRevertCustomError(
              transferFromAndCallWithData.call(this, initialHolder, this.mock.address, value, { from: spender }),
              'NotAcceptedToken',
              [this.notAcceptedToken.address, this.token.address],
            );

            await expectRevertCustomError(
              transferFromAndCallWithoutData.call(this, initialHolder, this.mock.address, value, { from: spender }),
              'NotAcceptedToken',
              [this.notAcceptedToken.address, this.token.address],
            );
          });
        });

        describe('via transferAndCall', function () {
          const transferAndCallWithData = function (to, value, opts) {
            return this.notAcceptedToken.methods['transferAndCall(address,uint256,bytes)'](to, value, data, opts);
          };

          const transferAndCallWithoutData = function (to, value, opts) {
            return this.notAcceptedToken.methods['transferAndCall(address,uint256)'](to, value, opts);
          };

          it('reverts', async function () {
            await expectRevertCustomError(
              transferAndCallWithData.call(this, this.mock.address, value, { from: initialHolder }),
              'NotAcceptedToken',
              [this.notAcceptedToken.address, this.token.address],
            );

            await expectRevertCustomError(
              transferAndCallWithoutData.call(this, this.mock.address, value, { from: initialHolder }),
              'NotAcceptedToken',
              [this.notAcceptedToken.address, this.token.address],
            );
          });
        });
      });

      describe('receiving approvals', function () {
        describe('via approveAndCall', function () {
          const approveAndCallWithData = function (spender, value, opts) {
            return this.notAcceptedToken.methods['approveAndCall(address,uint256,bytes)'](spender, value, data, opts);
          };

          const approveAndCallWithoutData = function (spender, value, opts) {
            return this.notAcceptedToken.methods['approveAndCall(address,uint256)'](spender, value, opts);
          };

          it('reverts', async function () {
            await expectRevertCustomError(
              approveAndCallWithData.call(this, this.mock.address, value, { from: initialHolder }),
              'NotAcceptedToken',
              [this.notAcceptedToken.address, this.token.address],
            );

            await expectRevertCustomError(
              approveAndCallWithoutData.call(this, this.mock.address, value, { from: initialHolder }),
              'NotAcceptedToken',
              [this.notAcceptedToken.address, this.token.address],
            );
          });
        });
      });
    });
  });
});
