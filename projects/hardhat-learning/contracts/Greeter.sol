// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title Greeter — Hardhat 入门示例合约
/// @notice 存储并读写一条问候语，用于熟悉编译、测试与部署流程
contract Greeter {
    string private greeting;

    event GreetingUpdated(string oldGreeting, string newGreeting);

    constructor(string memory initialGreeting) {
        greeting = initialGreeting;
    }

    function greet() public view returns (string memory) {
        return greeting;
    }

    function setGreeting(string memory newGreeting) public {
        string memory old = greeting;
        greeting = newGreeting;
        emit GreetingUpdated(old, newGreeting);
    }
}
