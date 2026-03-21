// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TokenVestToken{

    // Token State Variables
    string public name;
    string public symbol;
    uint8 public decimals = 18;
    uint256 public totalSupply;
    uint256 public maxSupply;
    address public owner;
    bool public paused;

    // Token Mapping Variables
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;


    // Token Events
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event Mint(address indexed to, uint256 value);
    event Burn(address indexed from, uint256 value);
    event Pause(address indexed by);
    event Unpause(address indexed by);


    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not Owner!");
        _;
    }

    modifier notPaused() {
        require(!paused,"Contract is paused!");
        _;
    }

    modifier validAddress(address _addr) {
        require(_addr != address(0), "Zero Address Not Allowed!");
        _;
    }


    
    constructor (
        string memory _name,
        string memory _symbol,
        uint256 _maxSupply
    ){
        name = _name;
        symbol = _symbol;
        maxSupply = _maxSupply * 10 ** decimals;

        owner = msg.sender;
    }


    function transfer (address to, uint256 amount) public notPaused validAddress(to) returns (bool) {
        require(balanceOf[msg.sender] >= amount, "Insufficient Balance");
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;

        emit Transfer(msg.sender, to, amount);
        return true;
    }


    function approve(address spender, uint256 amount) public notPaused validAddress(spender) returns (bool) {
        // require(balanceOf[msg.sender] >= amount, "Insufficient Balance");

        allowance[msg.sender][spender] = amount;

        emit Approval(msg.sender, spender, amount);
        return true; 
    } 

    function transferFrom(address from, address to, uint256 amount) public notPaused validAddress(to) returns (bool) {
        require(balanceOf[from] >= amount, "Insufficient Balance");
        require(allowance[from][msg.sender] >= amount, "Insufficient Balance");

        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;

        emit Transfer(from, to, amount);
        return true;
    }

    function mint(address to, uint256 amount) public onlyOwner notPaused validAddress(to) {
        require(totalSupply + amount <= maxSupply,"Max supply exceeded");

        totalSupply += amount;
        balanceOf[to] += amount;

        emit Mint(to, amount);
        emit Transfer(address(0), to, amount);
    }

    function burn(uint256 amount) public notPaused {
        require(balanceOf[msg.sender] >= amount, "Insufficient balance");

        balanceOf[msg.sender] -= amount;
        totalSupply -= amount;

        emit Burn(msg.sender, amount);
        emit Transfer(msg.sender, address(0), amount);
    }


    function pause() public onlyOwner{
        paused = true;
        emit Pause(msg.sender);
    }

    function unpause() public onlyOwner {
        paused = false;
        emit Unpause(msg.sender);
    }


    function transferOwnership(address newOwner) public onlyOwner validAddress(newOwner) {
        owner = newOwner;
    }

    

}