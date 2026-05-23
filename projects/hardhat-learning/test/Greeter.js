const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Greeter", function () {
  it("部署后应返回初始问候语", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, Hardhat!");
    await greeter.waitForDeployment();

    expect(await greeter.greet()).to.equal("Hello, Hardhat!");
  });

  it("setGreeting 应更新问候语并触发事件", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hi");
    await greeter.waitForDeployment();

    await expect(greeter.setGreeting("Learn Web3"))
      .to.emit(greeter, "GreetingUpdated")
      .withArgs("Hi", "Learn Web3");

    expect(await greeter.greet()).to.equal("Learn Web3");
  });
});
