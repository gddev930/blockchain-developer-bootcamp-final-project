import Web3 from 'web3';
import * as dotenv from "dotenv";
import BridgeEthABI from '../constants/abis/BridgeEth.json';
import BridgeBscABI from '../constants/abis/BridgeBsc.json';

dotenv.config();

const INFURA_API_KEY = process.env.INFURA_API_KEY || "";

const web3Eth = new Web3(`https://rinkeby.infura.io/v3/${INFURA_API_KEY}`);
const web3Bsc = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/');
const web3BscWSS = new Web3(new Web3.providers.WebsocketProvider('wss://speedy-nodes-nyc.moralis.io/ee835dbc8e886436b404d54e/bsc/testnet/ws'));
const adminPrivKey = process.env.OWNER_PRIVATE_KEY || "";
const { address: admin } = web3Bsc.eth.accounts.wallet.add(adminPrivKey);
web3Eth.eth.accounts.wallet.add(adminPrivKey);

const bridgeETHAddress = "0x8309ef2aD2248E547232181E2F9F619b762245Bb";
const bridgeBSCAddress = "0xF6A491763cf4D9D8ddf4aDAEF2Fbd4C72f9cf4E6";

const bridgeEth = new web3Eth.eth.Contract(
  BridgeEthABI as any,
  bridgeETHAddress
);

const bridgeBscWSS = new web3BscWSS.eth.Contract(
  BridgeBscABI as any,
  bridgeBSCAddress
);


export const brigdeBscToEthSubscribe = async () => {
    console.log('bridgeBsc is running');
    const bscBlockNumber = await web3Bsc.eth.getBlockNumber();
    bridgeBscWSS.events.Transfer({
        fromBlock: bscBlockNumber, 
        filter: { step: [0] }
      })
      .on('error', (error : any, receipt : any) => { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
        console.log('bridgeBsc Error: ', error);
      })
      .on('data', (event: any) => {
        console.log('BridgeBSC Transfer was triggerred.');
        const { from, to, amount, date, nonce, step } = event.returnValues;
        console.log('nonce: ', nonce);
        console.log('step: ', step);
        const tx = bridgeEth.methods.mint(to, amount, nonce);
        const data = tx.encodeABI();
        const txData = {
          from: admin,
          to: bridgeEth.options.address,
          data,
          gasLimit: web3Eth.utils.toHex(2100000)
        };
        web3Eth.eth.sendTransaction(txData).on('receipt', (receipt) => {
          console.log(`
            Processed transfer Mint To ETH:
            - from ${from} 
            - to ${to} 
            - amount ${amount} tokens
            - date ${date}
          `);
        })
      });
}
