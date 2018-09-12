const { makeInterfaceId } = require('../helpers/makeInterfaceId');

const INTERFACE_IDS = {
  ERC165: makeInterfaceId([
    'supportsInterface(bytes4)',
  ]),
  ERC1363Transfer: makeInterfaceId([
    'transferAndCall(address,uint256)',
    'transferAndCall(address,uint256,bytes)',
    'transferFromAndCall(address,address,uint256)',
    'transferFromAndCall(address,address,uint256,bytes)',
  ]),
  ERC1363Approve: makeInterfaceId([
    'approveAndCall(address,uint256)',
    'approveAndCall(address,uint256,bytes)',
  ]),
  ERC1363Receiver: makeInterfaceId([
    'onTransferReceived(address,address,uint256,bytes)',
  ]),
  ERC1363Spender: makeInterfaceId([
    'onApprovalReceived(address,uint256,bytes)',
  ]),
};

function shouldSupportInterfaces (interfaces = []) {
  describe('ERC165\'s supportsInterface(bytes4)', function () {
    beforeEach(function () {
      this.thing = this.mock || this.token;
    });

    for (const k of interfaces) {
      const interfaceId = INTERFACE_IDS[k];
      describe(k, function () {
        it('should use less than 30k gas', async function () {
          (await this.thing.supportsInterface.estimateGas(interfaceId)).should.be.lte(30000);
        });

        it('is supported', async function () {
          (await this.thing.supportsInterface(interfaceId)).should.equal(true);
        });
      });
    }
  });
}

module.exports = {
  shouldSupportInterfaces,
};
