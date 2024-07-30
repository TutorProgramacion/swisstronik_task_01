// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CMAToken is ERC20 {
    constructor() ERC20("CMAToken", "CMA") {}

    function mint1000tokens() public {
        _mint(msg.sender, 1000 * 10 ** 18);
    }

    function burn1000tokens() public {
        _burn(msg.sender, 1000 * 10 ** 18);
    }
}
