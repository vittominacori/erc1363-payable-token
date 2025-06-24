function shouldHaveERC20Properties(
  name,
  symbol,
  decimals,
  initialBalance,
  initialSupply,
  [initialHolder, anotherAccount],
) {
  it('has a name', async function () {
    expect(await this.token.name()).to.equal(name);
  });

  it('has a symbol', async function () {
    expect(await this.token.symbol()).to.equal(symbol);
  });

  it('has an amount of decimals', async function () {
    expect(await this.token.decimals()).to.be.bignumber.equal(decimals);
  });

  describe('total supply', function () {
    it('returns the total token value', async function () {
      expect(await this.token.totalSupply()).to.be.bignumber.equal(initialSupply);
    });
  });

  describe('balanceOf', function () {
    describe('when the requested account has no tokens', function () {
      it('returns zero', async function () {
        expect(await this.token.balanceOf(anotherAccount)).to.be.bignumber.equal('0');
      });
    });

    describe('when the requested account has some tokens', function () {
      it('returns the total token value', async function () {
        expect(await this.token.balanceOf(initialHolder)).to.be.bignumber.equal(initialBalance);
      });
    });
  });
}

module.exports = {
  shouldHaveERC20Properties,
};
