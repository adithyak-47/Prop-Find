//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _id
    ) external;
}

contract Escrow {
    address public nftAddress; 
    address payable public seller;
    address public lender;
    address public inspector;

    mapping(uint256 => bool) public isListed;
    mapping(uint256 => address) public buyer; 
    mapping(uint256 => uint256) public purchasePrice;
    mapping(uint256 => uint256) public escrowPrice;
    mapping(uint256 => bool) public inspectionPassed;
    mapping(uint256 => mapping(address => bool)) public approval;

    modifier OnlySeller{
        require(msg.sender == seller, "Only owner can sell the NFT!");
        _;
    }

    modifier OnlyBuyer(uint256 _nftID){
        require(msg.sender == buyer[_nftID], "Only buyer can deposit earnest!");
        _;
    }

    modifier OnlyInspector{
        require(msg.sender == inspector, "Only inspector can approve inspection!");
        _;
    }

    constructor(address _nftAddress, address payable _seller, address _lender, address _inspector)
    {
        nftAddress = _nftAddress;
        seller = _seller;
        lender = _lender;
        inspector = _inspector;
    }

    function list(uint256 _nftID, address _buyer, uint256 _purchasePrice, uint256 _escrowPrice) public payable OnlySeller{
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftID);
        isListed[_nftID] = true;
        buyer[_nftID] = _buyer;
        purchasePrice[_nftID] = _purchasePrice;
        escrowPrice[_nftID] = _escrowPrice;
    }

    function depositEarnest(uint256 _nftID) public payable OnlyBuyer(_nftID){
        require(msg.value >= escrowPrice[_nftID], "Not enough funds!");
    }

    function updateInspection(uint256 _nftID, bool _passed) OnlyInspector public {
        inspectionPassed[_nftID] = _passed;
    }

    function approveSale(uint256 _nftID) public{
        approval[_nftID][msg.sender] = true;
    }

    function finalizeSale(uint256 _nftID) public{
        require(inspectionPassed[_nftID]);
        require(approval[_nftID][buyer[_nftID]]);
        require(approval[_nftID][seller]);
        require(approval[_nftID][lender]);
        require(address(this).balance >= purchasePrice[_nftID]);

        isListed[_nftID] = false;

        (bool success, ) = payable(seller).call{value: address(this).balance}("");
        require(success);

        IERC721(nftAddress).transferFrom(address(this), buyer[_nftID], _nftID);
    }

    // function cancelSale(uint256 _nftID) public{
    //     if(inspectionPassed[_nftID] == false)
    //     {
    //         payable(buyer[_nftID]).transfer(address(this).balance);
    //     }
    //     else
    //     {
    //         payable(seller).transfer(address(this).balance);
    //     }
    // }

    receive() external payable{}

    function getBalance() public view returns (uint256){
        return address(this).balance;
    }
}
