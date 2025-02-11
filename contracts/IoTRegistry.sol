// contracts/IoTRegistry.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract IoTRegistry {
    mapping(string => bool) public registeredDevices;
    
    function registerDevice(string memory deviceId) public {
        require(!registeredDevices[deviceId], "Device already registered");
        registeredDevices[deviceId] = true;
    }

    function isRegistered(string memory deviceId) public view returns (bool) {
        return registeredDevices[deviceId];
    }
}