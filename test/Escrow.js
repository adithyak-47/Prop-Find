const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Escrow', () => {
    let buyer, inspector, seller, lender;
    let realEstate, escrow;

    beforeEach(async() => {

        [buyer, seller, inspector, lender] = await ethers.getSigners();
        const RealEstate = await ethers.getContractFactory('RealEstate');
        realEstate = await RealEstate.deploy();
        let transaction = await realEstate.connect(seller).mint("https://ipfs.io/ipfs/QmQJc3tWrenPYqqHHWFVTTNxBww3Zagyr2udhPGCYn6mze?filename=1.json");
        await transaction.wait();

        const Escrow = await ethers.getContractFactory('Escrow');
        escrow = await Escrow.deploy(
            realEstate.address, 
            seller.address, 
            lender.address,
            inspector.address);
        
        transaction = await realEstate.connect(seller).approve(escrow.address, 1);
        await transaction.wait();

        transaction = await escrow.connect(seller).list(1, buyer.address, tokens(10), tokens(5));
        await transaction.wait();
    });

    describe('Deployment', async() => {

        it('returns NFT Address', async() => {
            const nft = await escrow.nftAddress();
            expect(nft).to.be.equal(realEstate.address);
        });

        it('Returns the seller', async() => {
            const selleraddr = await escrow.seller();
            expect(selleraddr).to.be.equal(seller.address);
        });

        it('Returns the inspector', async() => {
            const inspAddr = await escrow.inspector();
            expect(inspAddr).to.be.equal(inspector.address);
        });

        it('Returns the lender', async() => {
            const lenderAddr = await escrow.lender();
            expect(lenderAddr).to.equal(lender.address);
        });
    });

    describe('Listing property', async() => {

        it('Updates the ownership of NFT', async() => {
            expect(await realEstate.ownerOf(1)).to.equal(escrow.address);
        });

        it('Updates NFT as listed', async() => {
            expect(await escrow.isListed(1)).to.equal(true);
        });

        it('Returns buyer', async() => {
            expect(await escrow.buyer(1)).to.equal(buyer.address);
        });

        it('Returns purchase price', async() => {
            expect(await escrow.purchasePrice(1)).to.equal(tokens(10));
        });

        it('Returns the escrow price', async() => {
            expect(await escrow.escrowPrice(1)).to.equal(tokens(5));
        });

        it('Makes sure that only the owner can sell the NFT', async() => {
            await expect(escrow.connect(buyer).list(1, seller.address, tokens(10), tokens(5)))
            .to
            .be
            .revertedWith("Only owner can sell the NFT!");
        });
    });

    describe('Earnest deposit', async() => {

        it('Makes sure that only the buyer can deposit', async() => {
            await expect(escrow.connect(seller).depositEarnest(1, {value: tokens(5)}))
            .to
            .be
            .revertedWith('Only buyer can deposit earnest!');
        });

        it('Updates contract balance', async() => {
            const transaction = await escrow.connect(buyer).depositEarnest(1, {value: tokens(5)});
            await transaction.wait();
            const contractBalance = await escrow.getBalance();
            expect(contractBalance).to.equal(tokens(5));
        });

        it('Ensures that the deposit has to be above escrow price', async() => {
            await expect(escrow.connect(buyer).depositEarnest(1, {value: tokens(3)}))
            .to
            .be
            .revertedWith('Not enough funds!');
        });
    });

    describe('Inspection', async() => {

        it('makes sure that only the inspector can approve inspection', async() => {
            await expect(escrow.connect(seller).updateInspection(1, true))
            .to
            .be.revertedWith('Only inspector can approve inspection!');
        });

        it('Updates the inspection status', async() => {
            const transaction = await escrow.connect(inspector).updateInspection(1, true);
            await transaction.wait();
            const result = await escrow.inspectionPassed(1);
            expect(result).to.equal(true);
        });
    });

    describe('Approval', async() => {

        it('Updates approval status', async() => {
            let transaction = await escrow.connect(seller).approveSale(1);
            await transaction.wait();
            transaction = await escrow.connect(buyer).approveSale(1);
            await transaction.wait();
            transaction = await escrow.connect(lender).approveSale(1);
            await transaction.wait();

            expect(await escrow.approval(1, seller.address)).to.equal(true);
            expect(await escrow.approval(1, buyer.address)).to.equal(true);
            expect(await escrow.approval(1, lender.address)).to.equal(true);
        });
    });

    describe('Sale', async() => {

        beforeEach(async() =>{
            let transaction = await escrow.connect(buyer).depositEarnest(1, {value: tokens(5)});
            await transaction.wait();

            transaction = await escrow.connect(inspector).updateInspection(1, true);
            await transaction.wait();

            transaction = await escrow.connect(buyer).approveSale(1);
            await transaction.wait();

            transaction = await escrow.connect(seller).approveSale(1);
            await transaction.wait();

            transaction = await escrow.connect(lender).approveSale(1);
            await transaction.wait();

            await lender.sendTransaction({to: escrow.address, value: tokens(5)});

            transaction = await escrow.connect(seller).finalizeSale(1);
            await transaction.wait();
        });

        it("Updates the contract balance", async() => {
            expect(await escrow.getBalance()).to.be.equal(0);
        });

        it("Updates the NFT ownership", async() => {
            expect(await realEstate.ownerOf(1)).to.be.equal(buyer.address);
        });
    });
});
