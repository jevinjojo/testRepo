// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TokenLedger {
  string public name = 'Assessment Token';
  string public symbol = 'AST';

  address public owner;
  uint256 public totalSupply;

  mapping(address => uint256) public balances;

  event TokensMinted(address indexed to, uint256 amount);
  event TokensTransferred(address indexed from, address indexed to, uint256 amount);

  modifier onlyOwner() {
    require(msg.sender == owner, 'Only owner can mint');
    _;
  }

  constructor() {
    owner = msg.sender;
  }

  function mint(address to, uint256 amount) public onlyOwner {
    require(to != address(0), 'Invalid recipient');
    require(amount > 0, 'Amount must be greater than zero');

    balances[to] += amount;
    totalSupply += amount;

    emit TokensMinted(to, amount);
  }

  function transfer(address to, uint256 amount) public returns (bool) {
    require(to != address(0), 'Invalid recipient');
    require(amount > 0, 'Amount must be greater than zero');
    require(balances[msg.sender] >= amount, 'Insufficient balance');

    balances[msg.sender] -= amount;
    balances[to] += amount;

    emit TokensTransferred(msg.sender, to, amount);

    return true;
  }

  function balanceOf(address account) public view returns (uint256) {
    return balances[account];
  }
}
