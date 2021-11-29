# Avvoiding Common Attacks.
1. Proper Use of Require, Assert and Revert : The ConsensysTestBase contract is using "require" before executing codes.
2. Use Modifiers Only for Validation : The ConsensysTestBase contract is using modifiers for only validation.
3. Checks-Effects-Interactions : All of modifying state codes are executed before external calls.

