const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');

const ERC1363MethodCallReceiver = artifacts.require('ERC1363MethodCallReceiver');

function shouldBehaveLikeERC1363MethodCallReceiver([sender, operator]) {
  const value = new BN('1000000000000000000');

  beforeEach(async function () {
    this.mock = await ERC1363MethodCallReceiver.new();
  });

  describe('calling methods', function () {
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

            await expectRevert(
              transferFromAndCallWithData.call(this, sender, this.mock.address, value, abiEncodedCall, {
                from: operator,
              }),
              'Low level call failed',
            );
          });
        });

        describe('when data is not a valid method signature', function () {
          it('reverts', async function () {
            await expectRevert(
              transferFromAndCallWithData.call(this, sender, this.mock.address, value, '0x42', { from: operator }),
              'Low level call failed',
            );
          });
        });
      });

      describe('without data', function () {
        it('reverts', async function () {
          await expectRevert(
            transferFromAndCallWithoutData.call(this, sender, this.mock.address, value, { from: operator }),
            'Low level call failed',
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

            await expectRevert(
              transferAndCallWithData.call(this, this.mock.address, value, abiEncodedCall, { from: sender }),
              'Low level call failed',
            );
          });
        });

        describe('when data is not a valid method signature', function () {
          it('reverts', async function () {
            await expectRevert(
              transferAndCallWithData.call(this, this.mock.address, value, '0x42', { from: sender }),
              'Low level call failed',
            );
          });
        });
      });

      describe('without data', function () {
        it('reverts', async function () {
          await expectRevert(
            transferAndCallWithoutData.call(this, this.mock.address, value, { from: sender }),
            'Low level call failed',
          );
        });
      });
    });
  });
}

module.exports = {
  shouldBehaveLikeERC1363MethodCallReceiver,
};
