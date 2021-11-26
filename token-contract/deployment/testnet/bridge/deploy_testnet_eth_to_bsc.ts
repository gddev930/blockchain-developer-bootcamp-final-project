import { ethers } from 'hardhat';
import { convertTokenValue } from '../../../helper/tokenHelper';
import ConsensysTestETHABI from '../../../constants/abi/ConsensysTestETH.json';

async function main() {
    
    // ethers is avaialble in the global scope
    const [deployer] = await ethers.getSigners();
    console.log(
      "Deploying the contracts with the account:",
      await deployer.getAddress()
    );
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const tokenEthAddress = "0x05E5451Cd9c042980CEbe3897743A9948E61e2BF";

    const Token = await ethers.getContractFactory("BridgeEth");
    const token = await Token.deploy(tokenEthAddress);
    await token.deployed();
  
    console.log("Token address:", token.address);

    const tokenEthcontract = new ethers.Contract(tokenEthAddress, ConsensysTestETHABI, deployer);
    
    await tokenEthcontract.addMintAvailableAddress(token.address);
    await tokenEthcontract.addBurnAvailableAddress(token.address);

    console.log("Successfully Deployed");
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });