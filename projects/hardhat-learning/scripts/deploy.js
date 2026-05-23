const hre = require("hardhat");

async function main() {
  const Greeter = await hre.ethers.getContractFactory("Greeter");
  const greeter = await Greeter.deploy("Hello, Hard3 Career!");
  await greeter.waitForDeployment();

  const address = await greeter.getAddress();
  console.log("Greeter deployed to:", address);
  console.log("greet():", await greeter.greet());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
