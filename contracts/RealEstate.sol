//SPDX-License-Identifier:UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract RealEstate is ERC721URIStorage{
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Property","PROP"){}
    
    function mint(string memory tokenURI) public returns(uint256)
    {
        _tokenIds.increment();

        uint newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        return newItemId;
    }

    function totalsupply() public view returns(uint256)
    {
        return _tokenIds.current();
    }
}
