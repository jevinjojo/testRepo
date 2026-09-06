class TokenLedger {
  constructor() {
    this.balances = {}; // { account1 : 100 }
    this.totalSupply = 0;
  }

  validateAddress(address) {
    if (!address || typeof address !== 'string') {
      throw new Error('A valid address is required');
    }
  }

  validateAmount(amount) {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new Error('Amount must be a positive integer');
    }
  }

  mint(to, amount) {
    this.validateAddress(to);
    this.validateAmount(amount);

    if (!this.balances[to]) {
      this.balances[to] = 0;
    }

    this.balances[to] += amount;
    this.totalSupply += amount;

    return {
      to,
      amount,
      balance: this.balances[to],
      totalSupply: this.totalSupply,
    };
  }

  transfer(from, to, amount) {
    this.validateAddress(from);
    this.validateAddress(to);
    this.validateAmount(amount);

    const senderBalance = this.balances[from] || 0;

    if (senderBalance < amount) {
      throw new Error('Insufficient balance');
    }

    if (!this.balances[to]) {
      this.balances[to] = 0;
    }

    this.balances[from] -= amount;
    this.balances[to] += amount;

    return {
      from,
      to,
      amount,
      senderBalance: this.balances[from],
      receiverBalance: this.balances[to],
    };
  }

  balanceOf(address) {
    this.validateAddress(address);

    return {
      address,
      balance: this.balances[address] || 0,
    };
  }

  getTotalSupply() {
    return this.totalSupply;
  }
}

module.exports = TokenLedger;
