import { ethers } from 'hardhat';
import { convertTokenValue } from '../../../helper/tokenHelper';
import ConsensysTestBSCABI from '../../../constants/abi/ConsensysTestBSC.json';

async function main() {
    
    // ethers is avaialble in the global scope
    const [deployer] = await ethers.getSigners();
    console.log(
      "Deploying the contracts with the account:",
      await deployer.getAddress()
    );
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const tokenBscAddress = "0x96CAC1fE6132eEF92BD979D2dEA2650D9cE899E2";

    const Token = await ethers.getContractFactory("BridgeBsc");
    const token = await Token.deploy(tokenBscAddress);
    await token.deployed();
  
    console.log("Token address:", token.address);

    const tokenBsccontract = new ethers.Contract(tokenBscAddress, ConsensysTestBSCABI, deployer);
    
    await tokenBsccontract.addMintAvailableAddress(token.address);
    await tokenBsccontract.addBurnAvailableAddress(token.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });