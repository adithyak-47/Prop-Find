# Real Estate DApp

## Description

A Web3 DApp (Decentralized App) that focuses on a use-case of the Blockchain technology. The DApp is built using the following technologies:
- Solidity: Writing smart contracts
- Hardhat: Blockchain development framework
- Chai.js: Testing library used to test the smart contract functionalities
- Ethers.js: Used for blockchain interaction
- React.js: Frontend for the DApp
- MetaMask: Used to import the hardhat accounts and use them for transactions

## Steps to Run
1. Install Node.js
2. Clone the repository and install the dependencies by running the command: `npm install`
3. Run the command: `npx hardhat node` to start the blockchain environment
4. Deploy the contracts using the deploy.js script by using the following command: `npx run scripts/deploy.js --network localhost`
5. Add the hardhat network to the MetaMask wallet, and add each hardhat account
6. Run the frontend using the command: `npm run start`
