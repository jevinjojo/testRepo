const TokenLedger = require('../services/tokenLedger');

const ledger = new TokenLedger();

exports.mintTokens = (req, res) => {
  try {
    const { to, amount } = req.body;

    const result = ledger.mint(to, amount);

    res.status(201).json({
      success: true,
      message: 'Tokens minted successfully',
      result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.transferTokens = (req, res) => {
  try {
    const { from, to, amount } = req.body;

    const result = ledger.transfer(from, to, amount);

    res.status(200).json({
      success: true,
      message: 'Tokens transferred successfully',
      result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getBalance = (req, res) => {
  try {
    const { address } = req.params;

    const result = ledger.balanceOf(address);

    res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getTotalSupply = (req, res) => {
  res.status(200).json({
    success: true,
    totalSupply: ledger.getTotalSupply(),
  });
};
