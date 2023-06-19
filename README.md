# Real Estate NFT DApp

## Technology Stack & Tools

- Solidity (Writing Smart Contracts & Tests)
- Javascript (React & Testing)
- [Hardhat](https://hardhat.org/) (Development Framework)
- [Ethers.js](https://docs.ethers.io/v5/) (Blockchain Interaction)
- [React.js](https://reactjs.org/) (Frontend Framework)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/)

## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
`$ npm install`

### 3. Run tests
`$ npx hardhat test`

### 4. Start Hardhat node
`$ npx hardhat node`

### 5. Run deployment script
In a separate terminal execute:
`$ npx hardhat run ./scripts/deploy.js --network localhost`

### 7. Start frontend
`$ npm run start`

## Demo


https://github.com/adithyak-47/Prop-Find/assets/76245460/243f1a23-efc5-48ed-a52d-d2b89bc918ad

According to the deployment script, the first four accounts in the hardhat environment are the buyer, seller, lender and inspector respectively, These accounts are shown as `hardhat 0`,  `hardhat 1`,  `hardhat 2` and  `hardhat 3` respectively in the MetaMask wallet. Initially, the user connects their wallet. The first process is for the buyer to place a bid, which is placed in the escrow contract. Any additional money is lended by the lender. After sufficient checks, the inspector approves of the transaction. Finally, the seller approves and the sale is finalized. In the real world, this is expected to happen simultaneously. The transactions occur only if all the users approve of the transaction.
