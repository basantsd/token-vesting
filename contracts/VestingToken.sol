// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract VestingToken is ERC20, Ownable, Pausable {

    // STATE VARIABLES
    uint256 public maxSupply;

    // ERRORS
    error MaxSupplyExceeded(uint256 requested, uint256 available);

    // EVENTS
    event TokensMinted(address indexed to, uint256 amount);
    event TokensBurned(address indexed from, uint256 amount);
    event MaxSupplyUpdated(uint256 newMaxSupply);

    // CONSTRUCTOR
    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _maxSupply
    ) ERC20(_name, _symbol) Ownable(msg.sender) {
        maxSupply = _maxSupply * 10 ** decimals();
    }

    // MINT & BURN
    function mint(
        address to,
        uint256 amount
    ) external onlyOwner whenNotPaused {
        if (totalSupply() + amount > maxSupply) {
            revert MaxSupplyExceeded(amount, maxSupply - totalSupply());
        }
        _mint(to, amount);
        emit TokensMinted(to, amount);
    }

    function burn(uint256 amount) external whenNotPaused {
        _burn(msg.sender, amount);
        emit TokensBurned(msg.sender, amount);
    }

    // PAUSE / UNPAUSE
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // OVERRIDE _update
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override whenNotPaused {
        super._update(from, to, value);
    }
}