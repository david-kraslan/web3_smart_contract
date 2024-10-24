const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Transactions", function () {
  let Transactions;
  let transactions;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    Transactions = await ethers.getContractFactory("Transactions");
    [owner, addr1, addr2, _] = await ethers.getSigners();
    transactions = await Transactions.deploy();
    await transactions.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await transactions.owner()).to.equal(owner.address);
    });
  });

  describe("Transactions", function () {
    it("Should transfer funds between accounts", async function () {
      await addr1.sendTransaction({
        to: transactions.address,
        value: ethers.utils.parseEther("1.0"), // Send 1 ether
      });

      await expect(
        transactions.connect(addr1).transfer(addr2.address, ethers.utils.parseEther("1.0"))
      ).to.emit(transactions, "Transfer").withArgs(addr1.address, addr2.address, ethers.utils.parseEther("1.0"));

      const addr2Balance = await ethers.provider.getBalance(addr2.address);
      expect(ethers.utils.formatEther(addr2Balance)).to.equal("10001.0");
    });

    it("Should fail if sender doesn't have enough funds", async function () {
      await expect(
        transactions.connect(addr1).transfer(addr2.address, ethers.utils.parseEther("1.0"))
      ).to.be.revertedWith("Amount must be greater than zero");
    });
  });
});

