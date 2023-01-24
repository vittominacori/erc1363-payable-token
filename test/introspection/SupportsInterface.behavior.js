const { makeInterfaceId } = require('@openzeppelin/test-helpers');

const INTERFACES = {
  ERC165: ['supportsInterface(bytes4)'],
  ERC1363: [
    'transferAndCall(address,uint256)',
    'transferAndCall(address,uint256,bytes)',
    'transferFromAndCall(address,address,uint256)',
    'transferFromAndCall(address,address,uint256,bytes)',
    'approveAndCall(address,uint256)',
    'approveAndCall(address,uint256,bytes)',
  ],
  ERC1363Receiver: ['onTransferReceived(address,address,uint256,bytes)'],
  ERC1363Spender: ['onApprovalReceived(address,uint256,bytes)'],
};

const INTERFACE_IDS = {};
const FN_SIGNATURES = {};
for (const k of Object.getOwnPropertyNames(INTERFACES)) {
  INTERFACE_IDS[k] = makeInterfaceId.ERC165(INTERFACES[k]);
  for (const fnName of INTERFACES[k]) {
    // the interface id of a single function is equivalent to its function signature
    FN_SIGNATURES[fnName] = makeInterfaceId.ERC165([fnName]);
  }
}

function shouldSupportInterfaces (interfaces = []) {
  describe('Contract interface', function () {
    beforeEach(function () {
      this.contractUnderTest = this.mock || this.token || this.holder;
    });

    for (const k of interfaces) {
      const interfaceId = INTERFACE_IDS[k];
      describe(k, function () {
        describe('ERC165\'s supportsInterface(bytes4)', function () {
          it('uses less than 30k gas [skip-on-coverage]', async function () {
            expect(await this.contractUnderTest.supportsInterface.estimateGas(interfaceId)).to.be.lte(30000);
          });

          it('claims support', async function () {
            expect(await this.contractUnderTest.supportsInterface(interfaceId)).to.equal(true);
          });
        });

        for (const fnName of INTERFACES[k]) {
          const fnSig = FN_SIGNATURES[fnName];
          describe(fnName, function () {
            it('has to be implemented', function () {
              expect(this.contractUnderTest.abi.filter(fn => fn.signature === fnSig).length).to.equal(1);
            });
          });
        }
      });
    }
  });
}

module.exports = {
  shouldSupportInterfaces,
};
