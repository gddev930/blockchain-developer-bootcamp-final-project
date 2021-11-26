// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

/// @title A ConsensysTest token contract to be launced on Ethereum network
/// @author Gjergji Dano
/// @notice This contract is inherited from ConsensysTestBase.

import "./ConsensysTestBase.sol";

contract ConsensysTestETH is ConsensysTestBase {
    constructor(address swapRouterAddress, uint256 initialMintAmount) ConsensysTestBase(swapRouterAddress, initialMintAmount) {
        
    }
}