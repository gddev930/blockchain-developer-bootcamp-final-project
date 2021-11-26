import Web3 from 'web3';
import * as dotenv from "dotenv";
import BridgeEthABI from '../constants/abis/BridgeEth.json';
import BridgeBscABI from '../constants/abis/BridgeBsc.json';

dotenv.config();

const INFURA_API_KEY = process.env.INFURA_API_KEY || "";

const web3Eth = new Web3(`https://rinkeby.infura.io/v3/${INFURA_API_KEY}`);
const web3EthWSS = new Web3(new Web3.providers.WebsocketProvider(`wss://rinkeby.infura.io/ws/v3/${INFURA_API_KEY}`));
const web3Bsc = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545/');
const adminPrivKey = process.env.OWNER_PRIVATE_KEY || "";
const { address: admin } = web3Bsc.eth.accounts.wallet.add(adminPrivKey);
web3Eth.eth.accounts.wallet.add(adminPrivKey);

const bridgeETHAddress = "0x8309ef2aD2248E547232181E2F9F619b762245Bb";
const bridgeBSCAddress = "0xF6A491763cf4D9D8ddf4aDAEF2Fbd4C72f9cf4E6";

const bridgeEthWSS = new web3EthWSS.eth.Contract(
  BridgeEthABI as any,
  bridgeETHAddress
);

const bridgeBsc = new web3Bsc.eth.Contract(
  BridgeBscABI as any,
  bridgeBSCAddress
);


export const brigdeEthToBscSubscribe = async () => {
    console.log('bridgeEth is running');
    const ethBlockNumber = await web3Eth.eth.getBlockNumber()
    bridgeEthWSS.events.Transfer({
        fromBlock: ethBlockNumber, 
        filter: { step: [0] }
      })
      .on('error', (error : any, receipt : any) => { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
        console.log('bridgeEth Error: ', error);
      })
      .on('data', (event: any) => {
        console.log('BridgeETH Transfer was triggerred.');
        const { from, to, amount, date, nonce, step } = event.returnValues;
        console.log('nonce: ', nonce);
        console.log('step: ', step);
        const tx = bridgeBsc.methods.mint(to, amount, nonce);
        const data = tx.encodeABI();
        const txData = {
          from: admin,
          to: bridgeBsc.options.address,
          data,
          gasLimit: web3Bsc.utils.toHex(2100000)
        };
        web3Bsc.eth.sendTransaction(txData).on('receipt', (receipt) => {
          console.log(`
            Processed transfer Mint To BSC:
            - from ${from} 
            - to ${to} 
            - amount ${amount} tokens
            - date ${date}
          `);
        })
      });
}
