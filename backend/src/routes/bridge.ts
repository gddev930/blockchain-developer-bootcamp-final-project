import express = require("express");
import { Request, Response } from "express";
import Web3 from 'web3';
import * as dotenv from "dotenv";
import BridgeEthABI from '../constants/abis/BridgeEth.json';
import BridgeBscABI from '../constants/abis/BridgeBsc.json';
import TokenEthABI from '../constants/abis/ConsensysTestETH.json';
import TokenBscABI from '../constants/abis/ConsensysTestBSC.json';
import BigNumber from 'bignumber.js';
dotenv.config();

const router = express.Router();

const INFURA_API_KEY = process.env.INFURA_API_KEY || "";

const web3Eth = new Web3(`https://rinkeby.infura.io/v3/${INFURA_API_KEY}`);
const web3Bsc = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/');
const adminPrivKey = process.env.OWNER_PRIVATE_KEY || "";
const { address: admin } = web3Bsc.eth.accounts.wallet.add(adminPrivKey);

web3Eth.eth.accounts.wallet.add(adminPrivKey);

const bridgeETHAddress = "0x8309ef2aD2248E547232181E2F9F619b762245Bb";
const bridgeBSCAddress = "0xF6A491763cf4D9D8ddf4aDAEF2Fbd4C72f9cf4E6";

const tokenETHAddress = "0x05E5451Cd9c042980CEbe3897743A9948E61e2BF";
const tokenBSCAddress = "0x96CAC1fE6132eEF92BD979D2dEA2650D9cE899E2";

const bridgeEth = new web3Eth.eth.Contract(
  BridgeEthABI as any,
  bridgeETHAddress
);

const bridgeBsc = new web3Bsc.eth.Contract(
  BridgeBscABI as any,
  bridgeBSCAddress
);

const tokenEth = new web3Eth.eth.Contract(
  TokenEthABI as any,
  tokenETHAddress
);

const tokenBsc = new web3Bsc.eth.Contract(
  TokenBscABI as any,
  tokenBSCAddress
);

function convertTokenValue(token: number) {
  return (new BigNumber(10).exponentiatedBy(18)).multipliedBy(token);
}

router.post("/ethtobsc", async (req: Request, res: Response) => {
  const from: string = req.body.from;
  const to: string = req.body.to;
  const amount: BigNumber = convertTokenValue(Number(req.body.amount));

  if (!from || !to || !amount) {
    return res.status(400).json({
      error: true,
      messsage: "bad request data :("
    });
  }
  
  const tx = bridgeEth.methods.burn(from, to, amount);
  const data = tx.encodeABI();

  const txData = {
    from: admin,
    to: bridgeEth.options.address,
    gasLimit: web3Eth.utils.toHex(2100000),
    data
  };

  /* tslint:disable-next-line */
  web3Eth.eth.sendTransaction(txData).on('error', function(err : any){console.log(err)});
  return res.json({
    result: "Successfully Called Burn ETH"
  });
});


router.post("/bsctoeth", async (req: Request, res: Response) => {
  const from: string = req.body.from;
  const to: string = req.body.to;
  const amount: BigNumber = convertTokenValue(req.body.amount);
  if (!from || !to || !amount) {
    return res.status(400).json({
      error: true,
      messsage: "bad request data :("
    });
  }
  const tx = bridgeBsc.methods.burn(from, to, amount);
  const data = tx.encodeABI();

  const txData = {
    from: admin,
    to: bridgeBsc.options.address,
    gasLimit: web3Bsc.utils.toHex(2100000),
    data
  };

  /* tslint:disable-next-line */
  web3Bsc.eth.sendTransaction(txData).on('error', function(err : any){console.log(err)});
  return res.json({
    result: "Successfully Called Burn BSC"
  });
});

router.post("/getfreecreditfrometh", async (req: Request, res: Response) => {
  const to: string = req.body.to;
  const amount: BigNumber = convertTokenValue(Number(10000));

  if (!to) {
    return res.status(400).json({
      error: true,
      messsage: "bad request data :("
    });
  }
  
  const tx = tokenEth.methods.transfer(to, amount);
  const data = tx.encodeABI();

  const txData = {
    from: admin,
    to: tokenEth.options.address,
    gasLimit: web3Eth.utils.toHex(2100000),
    data
  };

  /* tslint:disable-next-line */
  web3Eth.eth.sendTransaction(txData).on('error', function(err : any){console.log(err)});
  return res.json({
    result: "Successfully Called Getting Free Credit ETH"
  });
});

router.get('/', async (req: Request, res: Response) => {
  return res.json({
    result: "Success"
  });
})

router.post("/getfreecreditfrombsc", async (req: Request, res: Response) => {
  const to: string = req.body.to;
  const amount: BigNumber = convertTokenValue(Number(10000));

  if (!to) {
    return res.status(400).json({
      error: true,
      messsage: "bad request data :("
    });
  }
  
  const tx = tokenBsc.methods.transfer(to, amount);
  const data = tx.encodeABI();

  const txData = {
    from: admin,
    to: tokenBsc.options.address,
    gasLimit: web3Bsc.utils.toHex(2100000),
    data
  };

  /* tslint:disable-next-line */
  web3Bsc.eth.sendTransaction(txData).on('error', function(err : any){console.log(err)});
  return res.json({
    result: "Successfully Called Getting Free Credit BSC"
  });
});

export default router;
