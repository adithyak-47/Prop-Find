// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

async function main() {

  const [buyer, seller, inspector, lender] = await ethers.getSigners();
  const RealEstate = await ethers.getContractFactory('RealEstate');
  const realEstate = await RealEstate.deploy();
  await realEstate.deployed();

  console.log(`Contract deployed at ${realEstate.address}`);
  console.log(`Minting 6 properties...\n`);

  let transaction = await realEstate.connect(seller).mint("https://ipfs.io/ipfs/QmQJc3tWrenPYqqHHWFVTTNxBww3Zagyr2udhPGCYn6mze?filename=1.json");
  await transaction.wait();

  transaction = await realEstate.connect(seller).mint("https://ipfs.io/ipfs/QmcpphVWNwi5BvKS5ztxjHVwTmz1ueJPTYKVjghLF1RE6b?filename=2.json");
  await transaction.wait();

  transaction = await realEstate.connect(seller).mint("https://ipfs.io/ipfs/QmS9iosc3ux7vC2D7ijWHhvW3LsjoEnMbcfLpDCiqQoZWf?filename=3.json");
  await transaction.wait();

  transaction = await realEstate.connect(seller).mint("https://ipfs.io/ipfs/QmWc6cE13rYQFZVH4aYNKHKC8ZGAmSm5kfLP46d1J1oPY1?filename=4.json");
  await transaction.wait();

  transaction = await realEstate.connect(seller).mint("https://ipfs.io/ipfs/QmVW8evmgY4ZMMghJKX51mPJVLdXnv57NGEb9KRaMkanzs?filename=5.json");
  await transaction.wait();

  transaction = await realEstate.connect(seller).mint("https://ipfs.io/ipfs/QmRSWinRLYXKbs1Q96DiMJS2BrqLDdqpAPUCQdZempSwmU?filename=6.json");
  await transaction.wait();

  const Escrow = await ethers.getContractFactory('Escrow');
  const escrow = await Escrow.deploy(
    realEstate.address,
    seller.address,
    inspector.address,
    lender.address
  );
  await escrow.deployed();
  console.log(`Escrow contract deployed at address: ${escrow.address}`);

  for(let i=0;i<6;i++)
  {
    let trans = await realEstate.connect(seller).approve(escrow.address, i+1);
    await trans.wait();
  }

  transaction = await escrow.connect(seller).list(1, buyer.address, tokens(20), tokens(10));
  await transaction.wait();

  transaction = await escrow.connect(seller).list(2, buyer.address, tokens(15), tokens(5));
  await transaction.wait();

  transaction = await escrow.connect(seller).list(3, buyer.address, tokens(10), tokens(2));
  await transaction.wait();

  transaction = await escrow.connect(seller).list(4, buyer.address, tokens(12), tokens(3));
  await transaction.wait();

  transaction = await escrow.connect(seller).list(5, buyer.address, tokens(15), tokens(5));
  await transaction.wait();

  transaction = await escrow.connect(seller).list(6, buyer.address, tokens(25), tokens(12));
  await transaction.wait();

  console.log("Finished....");

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
