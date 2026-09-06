const test = require('node:test');
const assert = require('node:assert/strict');

const TokenLedger = require('./tokenLedger');

test('mints tokens and updates the balance', () => {
  const ledger = new TokenLedger();

  const result = ledger.mint('account1', 100);

  assert.equal(result.balance, 100);
  assert.equal(result.totalSupply, 100);
  assert.deepEqual(ledger.balanceOf('account1'), {
    address: 'account1',
    balance: 100,
  });
});

test('allows multiple mint operations', () => {
  const ledger = new TokenLedger();

  ledger.mint('account1', 100);
  ledger.mint('account1', 50);

  assert.equal(ledger.balanceOf('account1').balance, 150);
  assert.equal(ledger.getTotalSupply(), 150);
});

test('transfers tokens between accounts', () => {
  const ledger = new TokenLedger();

  ledger.mint('account1', 100);

  const result = ledger.transfer('account1', 'account2', 25);

  assert.equal(result.senderBalance, 75);
  assert.equal(result.receiverBalance, 25);
  assert.equal(ledger.balanceOf('account1').balance, 75);
  assert.equal(ledger.balanceOf('account2').balance, 25);
  assert.equal(ledger.getTotalSupply(), 100);
});

test('returns zero for an account with no balance', () => {
  const ledger = new TokenLedger();

  assert.deepEqual(ledger.balanceOf('account2'), {
    address: 'account2',
    balance: 0,
  });
});

test('rejects transfers with insufficient balance', () => {
  const ledger = new TokenLedger();

  ledger.mint('account1', 50);

  assert.throws(() => ledger.transfer('account1', 'account2', 100), {
    message: 'Insufficient balance',
  });
});

test('rejects invalid mint amounts', () => {
  const ledger = new TokenLedger();

  assert.throws(() => ledger.mint('account1', 0), {
    message: 'Amount must be a positive integer',
  });

  assert.throws(() => ledger.mint('account1', -10), {
    message: 'Amount must be a positive integer',
  });

  assert.throws(() => ledger.mint('account1', 10.5), {
    message: 'Amount must be a positive integer',
  });
});

test('rejects invalid addresses', () => {
  const ledger = new TokenLedger();

  assert.throws(() => ledger.mint('', 100), {
    message: 'A valid address is required',
  });

  assert.throws(() => ledger.balanceOf(null), {
    message: 'A valid address is required',
  });
});
