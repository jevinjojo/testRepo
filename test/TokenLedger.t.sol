// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import 'forge-std/Test.sol';
import '../contracts/TokenLedger.sol';

contract TokenLedgerTest is Test {
  TokenLedger tokenLedger;

  address account1 = address(1);
  address account2 = address(2);

  function setUp() public {
    tokenLedger = new TokenLedger();
  }

  function testOwnerIsSetCorrectly() public {
    assertEq(tokenLedger.owner(), address(this));
  }

  function testMintTokens() public {
    tokenLedger.mint(account1, 100);

    assertEq(tokenLedger.balanceOf(account1), 100);
    assertEq(tokenLedger.totalSupply(), 100);
  }

  function testMultipleMints() public {
    tokenLedger.mint(account1, 100);
    tokenLedger.mint(account1, 50);

    assertEq(tokenLedger.balanceOf(account1), 150);
    assertEq(tokenLedger.totalSupply(), 150);
  }

  function testTransferTokens() public {
    tokenLedger.mint(account1, 100);

    vm.prank(account1);
    bool transferred = tokenLedger.transfer(account2, 25);

    assertTrue(transferred);
    assertEq(tokenLedger.balanceOf(account1), 75);
    assertEq(tokenLedger.balanceOf(account2), 25);
    assertEq(tokenLedger.totalSupply(), 100);
  }

  function testOnlyOwnerCanMint() public {
    vm.prank(account1);

    vm.expectRevert(bytes('Only owner can mint'));
    tokenLedger.mint(account1, 100);
  }

  function testCannotMintToZeroAddress() public {
    vm.expectRevert(bytes('Invalid recipient'));
    tokenLedger.mint(address(0), 100);
  }

  function testCannotMintZeroAmount() public {
    vm.expectRevert(bytes('Amount must be greater than zero'));
    tokenLedger.mint(account1, 0);
  }

  function testCannotTransferWithoutEnoughBalance() public {
    vm.prank(account1);

    vm.expectRevert(bytes('Insufficient balance'));
    tokenLedger.transfer(account2, 100);
  }

  function testCannotTransferToZeroAddress() public {
    tokenLedger.mint(account1, 100);

    vm.prank(account1);

    vm.expectRevert(bytes('Invalid recipient'));
    tokenLedger.transfer(address(0), 25);
  }
}
