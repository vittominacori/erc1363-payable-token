const { BN, expectEvent } = require('@openzeppelin/test-helpers');

const { expectRevertCustomError } = require('../helpers/customError');

const ERC1363 = artifacts.require('$ERC1363');
const ERC1363MethodCallReceiver = artifacts.require('ERC1363MethodCallReceiver');

contract('ERC1363MethodCallReceiver', function ([sender, operator]) {
  const name = 'My Token';
  const symbol = 'MTKN';
  const balance = new BN(100);

  beforeEach(async function () {
    this.token = await ERC1363.new(name, symbol);

    await this.token.$_mint(sender, balance);

    this.mock = await ERC1363MethodCallReceiver.new();
  });

  describe('calling methods', function () {
    const value = balance;

    describe('via transferFromAndCall', function () {
      beforeEach(async function () {
        await this.token.approve(operator, value, { from: sender });
      });

      const transferFromAndCallWithData = function (from, to, value, data, opts) {
        return this.token.methods['transferFromAndCall(address,address,uint256,bytes)'](from, to, value, data, opts);
      };

      const transferFromAndCallWithoutData = function (from, to, value, opts) {
        return this.token.methods['transferFromAndCall(address,address,uint256)'](from, to, value, opts);
      };

      describe('with data', function () {
        describe('without param', function () {
          it('should call method', async function () {
            const abiEncodedCall = web3.eth.abi.encodeFunctionCall(
              {
                name: 'methodWithoutParam',
                type: 'function',
                inputs: [],
              },
              [],
            );

            const receipt = await transferFromAndCallWithData.call(
              this,
              sender,
              this.mock.address,
              value,
              abiEncodedCall,
              { from: operator },
            );

            await expectEvent.inTransaction(receipt.tx, ERC1363MethodCallReceiver, 'MethodCall', {
              method: 'methodWithoutParam',
              param: '',
            });
          });
        });

        describe('with param', function () {
          it('should call method', async function () {
            const abiEncodedCall = web3.eth.abi.encodeFunctionCall(
              {
                name: 'methodWithParam',
                type: 'function',
                inputs: [
                  {
                    type: 'string',
                    name: 'param',
                  },
                ],
              },
              ['AAA'],
            );

            const receipt = await transferFromAndCallWithData.call(
              this,
              sender,
              this.mock.address,
              value,
              abiEncodedCall,
              { from: operator },
            );

            await expectEvent.inTransaction(receipt.tx, ERC1363MethodCallReceiver, 'MethodCall', {
              method: 'methodWithParam',
              param: 'AAA',
            });
          });
        });

        describe('when method does not exist', function () {
          it('reverts', async function () {
            const abiEncodedCall = web3.eth.abi.encodeFunctionCall(
              {
                name: 'methodDoesNotExist',
                type: 'function',
                inputs: [],
              },
              [],
            );

            await expectRevertCustomError(
              transferFromAndCallWithData.call(this, sender, this.mock.address, value, abiEncodedCall, {
                from: operator,
              }),
              'LowLevelCallFailed',
              [],
            );
          });
        });

        describe('when data is not a valid method signature', function () {
          it('reverts', async function () {
            await expectRevertCustomError(
              transferFromAndCallWithData.call(this, sender, this.mock.address, value, '0x42', { from: operator }),
              'LowLevelCallFailed',
              [],
            );
          });
        });
      });

      describe('without data', function () {
        it('reverts', async function () {
          await expectRevertCustomError(
            transferFromAndCallWithoutData.call(this, sender, this.mock.address, value, { from: operator }),
            'LowLevelCallFailed',
            [],
          );
        });
      });
    });

    describe('via transferAndCall', function () {
      const transferAndCallWithData = function (to, value, data, opts) {
        return this.token.methods['transferAndCall(address,uint256,bytes)'](to, value, data, opts);
      };

      const transferAndCallWithoutData = function (to, value, opts) {
        return this.token.methods['transferAndCall(address,uint256)'](to, value, opts);
      };

      describe('with data', function () {
        describe('without param', function () {
          it('should call method', async function () {
            const abiEncodedCall = web3.eth.abi.encodeFunctionCall(
              {
                name: 'methodWithoutParam',
                type: 'function',
                inputs: [],
              },
              [],
            );

            const receipt = await transferAndCallWithData.call(this, this.mock.address, value, abiEncodedCall, {
              from: sender,
            });

            await expectEvent.inTransaction(receipt.tx, ERC1363MethodCallReceiver, 'MethodCall', {
              method: 'methodWithoutParam',
              param: '',
            });
          });
        });

        describe('with param', function () {
          it('should call method', async function () {
            const abiEncodedCall = web3.eth.abi.encodeFunctionCall(
              {
                name: 'methodWithParam',
                type: 'function',
                inputs: [
                  {
                    type: 'string',
                    name: 'param',
                  },
                ],
              },
              ['AAA'],
            );

            const receipt = await transferAndCallWithData.call(this, this.mock.address, value, abiEncodedCall, {
              from: sender,
            });

            await expectEvent.inTransaction(receipt.tx, ERC1363MethodCallReceiver, 'MethodCall', {
              method: 'methodWithParam',
              param: 'AAA',
            });
          });
        });

        describe('when method does not exist', function () {
          it('reverts', async function () {
            const abiEncodedCall = web3.eth.abi.encodeFunctionCall(
              {
                name: 'methodDoesNotExist',
                type: 'function',
                inputs: [],
              },
              [],
            );

            await expectRevertCustomError(
              transferAndCallWithData.call(this, this.mock.address, value, abiEncodedCall, { from: sender }),
              'LowLevelCallFailed',
              [],
            );
          });
        });

        describe('when data is not a valid method signature', function () {
          it('reverts', async function () {
            await expectRevertCustomError(
              transferAndCallWithData.call(this, this.mock.address, value, '0x42', { from: sender }),
              'LowLevelCallFailed',
              [],
            );
          });
        });
      });

      describe('without data', function () {
        it('reverts', async function () {
          await expectRevertCustomError(
            transferAndCallWithoutData.call(this, this.mock.address, value, { from: sender }),
            'LowLevelCallFailed',
            [],
          );
        });
      });
    });
  });
});
