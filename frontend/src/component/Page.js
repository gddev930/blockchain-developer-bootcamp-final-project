import React, { Component } from "react";
import EthAbi from "../abi/Eth.json";
import BscAbi from "../abi/Bsc.json";
import { ethContractAddress, bscContractAddress } from "../contracts";
import BigNumber from 'bignumber.js';
import axios from "axios";
import Web3 from "web3";

class Page extends Component {
    state = {
        symbol: "",
        balance: 0,
        decimals: 0,
        internalAddress: "",
        externalAddress: "",
        internalAmount: "",
        externalAmount: "",
        account: "",
        ethInstance: null,
        loading: false,
    }

    componentDidMount = async () =>  {
        console.log("did mount");
        this.connect();
    }

    componentDidUpdate = (prevProps, prevState) => {
        if(prevProps.web3 !== this.props.web3) {
            this.connect();
        }
    }

    connect = async () =>  {
        this.setState({
            loading: true
        });
        try {
            const web3 = this.props.web3;
            const accounts = await web3.eth.getAccounts();
            console.log('connected');
            console.log(accounts);
            this.setState({
                account: accounts[0]
            });
            const ethInstance = new web3.eth.Contract(
                this.props.network === "eth" ? EthAbi : BscAbi, this.props.network === "eth" ? ethContractAddress : bscContractAddress
            );

            ethInstance.methods.symbol().call().then((res) => {
                this.setState({
                    symbol: res
                });
            });
            ethInstance.methods.balanceOf(accounts[0]).call().then((res) => {
                this.setState({
                    balance: res
                });
            });
            ethInstance.methods.decimals().call().then((res) => {
                this.setState({
                    decimals: res
                });
            });

            this.setState({
                ethInstance: ethInstance
            });
            
            this.setState({
                loading: false
            });
        } catch (error) {
            console.error(error);
            this.setState({
                loading: false
            });
        }
    }

    changeInternalToAddress = (event) => {
        this.setState({
            internalAddress: event.target.value
        });
    }
    
    changeExternalToAddress = (event) => {
        this.setState({
            externalAddress: event.target.value
        });
    }
    
    changeInternalToAmount = (event) => {
        this.setState({
            internalAmount: event.target.value
        });
    }
    
    changeExternalToAmount = (event) => {
        this.setState({
            externalAmount: event.target.value
        });
    }
    
    getFreeToken = () => {
        axios({
            method: 'post',
            url: `https://calm-island-22697.herokuapp.com/api/v1/bridge/${this.props.network === 
            "eth" ? "getfreecreditfrometh" : "getfreecreditfrombsc"}`,
            data: {
                to: this.state.account
            },
            headers: {
            "Content-Type": "application/json"
            }
        }).then((res) => {
            alert("Operation successed. You will receive 10000 CTT soon!");
        })
    }

    externalTransfer = () => {
        axios({
            method: 'post',
            url: `https://calm-island-22697.herokuapp.com/api/v1/bridge/${this.props.network === 
            "eth" ? "ethtobsc" : "bsctoeth"}`,
            data: {
                from: this.state.account,
                to: this.state.externalAddress,
                amount: this.state.externalAmount
            },
            headers: {
            "Content-Type": "application/json"
            }
        }).then((res) => {
            this.setState({
                externalAddress: "",
                externalAmount: 0
            });
            this.connect();
        }).catch((err) => {
            console.log(err);
        });
    }

    internalTransfer = () => {
        let account = this.state.account;
        let amount = Web3.utils.toWei(this.state.internalAmount);
        if(this.state.ethInstance) {
            this.state.ethInstance.methods.transfer(this.state.internalAddress, amount).send({from: account}).then((res) => {
                console.log(res);
                this.setState({
                    internalAddress: "",
                    internalAmount: 0
                });
                this.connect();
            }).catch((error) => {
                console.log(error);
            });
        }
        else {
            alert("Metamask is not connected!");
        }
    }

    render() {
        return (
            <div className="py-2 mb-4 flex flex-col items-center justify-center">
                <h1 style={{fontSize: '30px'}}>{this.props.network === "eth" ? "Rinkeby Network" : "BSC Test Network"}</h1>
                {
                this.state.symbol !== "" 
                    ? <span>Balance: {this.state.balance ? Web3.utils.fromWei(this.state.balance) : 0} {this.state.symbol ? this.state.symbol : ""}</span>
                    : <span>Not connected</span>
                }
                <div className="py-2 mb-4 flex flex-col items-center justify-center">
                    <button onClick={this.getFreeToken} className="py-2 mt-10 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">Get Free Token</button>
                </div>
                <div className="py-2 mb-4 mt-20 flex items-center justify-center">
                    <div className="py-2 mb-4 mr-2 flex flex-col items-center justify-center border-2">
                        <label>Internal Transfer</label>
                        <input 
                        onChange={this.changeInternalToAddress} 
                        value={this.state.internalAddress}
                        placeholder="Input address to transfer"
                        className="py-2 text-lg ml-2 mr-2 font-bold rounded-lg w-100 border-blue-600 border-2" 
                        type="text"/>
                        <input 
                        onChange={this.changeInternalToAmount} 
                        value={this.state.internalAmount}
                        placeholder="Input amount to transfer"
                        className="py-2 mt-2 mb-2 text-lg font-bold rounded-lg w-100 border-blue-600 border-2" 
                        type="number"/>
                        <button 
                        onClick={this.internalTransfer} 
                        className="py-2 mt-2 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">
                        Transfer
                        </button>
                    </div>
                    <div className="py-2 mb-4 ml-2 flex flex-col items-center justify-center border-2">
                        <label>Transfer to {this.props.network === "eth" ? "BSC testnet" : "Rinkeby"} account</label>
                        <input 
                            onChange={this.changeExternalToAddress} 
                            value={this.state.externalAddress}
                            placeholder="Input address to transfer"
                            className="py-2 text-lg mr-2 ml-2 font-bold rounded-lg w-100 border-blue-600 border-2" 
                            type="text"/>
                        <input 
                            onChange={this.changeExternalToAmount} 
                            value={this.state.externalAmount}
                            placeholder="Input amount to transfer"
                            className="py-2 mt-2 mb-2 text-lg font-bold rounded-lg w-100 border-blue-600 border-2" 
                            type="number"/>
                        <button 
                            onClick={this.externalTransfer} 
                            className="py-2 mt-2 mb-4 text-lg font-bold text-white rounded-lg w-56 bg-blue-600 hover:bg-blue-800">
                            Transfer
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default Page;