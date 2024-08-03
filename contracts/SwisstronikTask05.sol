// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PrivateNFT is ERC721, Ownable {
    uint256 private _currentTokenId = 0;

    constructor() ERC721("PrivateNFT", "PNF") Ownable() {}

    function mint(address recipient) public onlyOwner returns (uint256) {
        _currentTokenId += 1;
        uint256 newItemId = _currentTokenId;
        _mint(recipient, newItemId);

        return newItemId;
    }

    function balanceOf(address account) public view override returns (uint256) {
        require(msg.sender == account, "Error: You're not owner");
        return super.balanceOf(account);
    }
}
