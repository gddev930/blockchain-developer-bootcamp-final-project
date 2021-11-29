# Design Pattern Decisions taken.
1. Inheritance and Interfaces: The CensensysTestBase contract imported ERC20, SafeMath, Ownable, Address, Pausable contracts from openzeppelin. 
And CensensysTestETH and ConsensysTestBSC contracts inerited ConsensysTestBase contract.
2. Access Control Design Patterns: The ConsensysTestBase contract uses Owanable and Pausable to restrict access to ertain functions and pause/unpause ownable.
