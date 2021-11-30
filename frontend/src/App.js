import { useState, useEffect } from "react";
import Page from './component/Page';
import './App.css';
import {
  Select,
  MenuItem
} from '@material-ui/core';
import Web3 from "web3";
import getWeb3 from "./component/getWeb3";

function App() {
  const [network, setNetwork] = useState('eth');
  const [web3, setWeb3] = useState(null);

  useEffect(() => {
    if(!web3) {
      getWeb3().then((res) => {
        setWeb3(res);
      });
    }

    try {
      window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x4'}],
      }).then(async (res) => {
        setWeb3(new Web3(window.ethereum));  
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      console.log(switchError);
    }
  }, []);

  async function handleChangeNetwork (event) {
    setNetwork(event.target.value);
    if(event.target.value === "bsc") {    
      try {
        window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x61'}],
        })
        .then(async (res) => {
          setWeb3(new Web3(window.ethereum));         
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        console.log(switchError);
      }
    }
    else {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x4'}],
        }).then(async (res) => {
          setWeb3(new Web3(window.ethereum));  
        });
      } catch (switchError) {
        // This error code indicates that the chain has not been added to MetaMask.
        console.log(switchError);
      }
    }
  }


  return (
    <div className="App">
      <div className="flex flex-col items-center justify-center">
        <div className="py-2 mb-4 flex flex-col items-center justify-center">
          <Select style={{width: "200px", margin: "15px"}} value={network} onChange={handleChangeNetwork}>
            <MenuItem value="eth">Rinkeby Network</MenuItem>
            <MenuItem value="bsc">BSC Test Network</MenuItem>
          </Select>
        </div>
        {network === "eth"
          ? 
            <Page network="eth" web3={web3}/>
          :
            <Page network="bsc" web3={web3}/> 
        }
      </div>
    </div>
  );
}

export default App;
