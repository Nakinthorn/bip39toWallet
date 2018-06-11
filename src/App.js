import React, { Component } from 'react';
import './App.css';
import axios from 'axios'
import bip39 from 'bip39'
import crypto from 'crypto'
import bitcoin from 'bitcoinjs-lib';
import hdkey from 'ethereumjs-wallet/hdkey';
import ethUtil from 'ethereumjs-util';
import bitcoinCash from 'bitcore-lib-cash';
import QRCode from 'qrcode.react';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      btc: '',
      bch: '',
      eth: '',
      privateKey: '',
      privateEth: '',
      bip39: ''

    }
    this.genAddressByBip39 = this.genAddressByBip39.bind(this)
  }

  genAddressByBip39() {
    var bip39 = require('bip39')
    var crypto = require('crypto')
    //  'seed'
    var randomBytes = crypto.randomBytes(16) // 128 bits is enough

    //  12 word phrase
    var words = randomBytes.toString('hex');
    var mnemonic = bip39.entropyToMnemonic(words)

    console.log("--------BIP39---------")
    console.log("BIP39 : ", mnemonic)
    console.log("BIP39 Validation is : ", bip39.validateMnemonic(mnemonic))
    console.log("--------BTC---------")

    var seed = bip39.mnemonicToSeed(mnemonic)
    var bitcoinNetwork = bitcoin.networks.bitcoin.livenet
    var hdMaster = bitcoin.HDNode.fromSeedBuffer(seed, bitcoinNetwork) // seed from above
    var key1 = hdMaster.derivePath('m/0')
    var address = key1.getAddress().toString();
    console.log("BTC Address :", address);
    var WIF = key1.keyPair.toWIF().toString();
    console.log("BTC WIF : ", WIF)
    var generateBCHAddress = new bitcoinCash.PrivateKey.fromWIF(WIF);
    console.log("--------BCH---------")
    console.log("BCH Address :", generateBCHAddress.toAddress().toString());
    console.log("BTC WIF : ", WIF)

    var walletEth = hdkey.fromMasterSeed(seed)
    const acct = walletEth.derivePath(`m/44'/60'/0'/0/0`)

    const privateKey = acct.getWallet().getPrivateKey()
    const publicKey = ethUtil.privateToPublic(privateKey)
    var Ethaddress = ethUtil.publicToAddress(publicKey)
    console.log("--------ETH---------")
    console.log("ETH Address :", '0x' + Ethaddress.toString('hex'));
    console.log("ETH Private : ", '0x' + privateKey.toString('hex'))
    this.setState({
      btc: address,
      bch: generateBCHAddress.toAddress().toString(),
      eth: '0x' + Ethaddress.toString('hex'),
      privateKey: WIF,
      privateEth: '0x' + privateKey.toString('hex'),
      bip39: mnemonic
    })
  }
  componentDidMount() {
    this.genAddressByBip39();
  }
  render() {
    var QRSize = 200;
    return (
      <div className="App">
        <nav className="navbar" role="navigation" aria-label="main navigation">
          <div className="navbar-brand">
            <a className="navbar-item" href="https://bulma.io">
              <img src="https://www.buybitcoinworldwide.com/img/kb/crypto/crypto.png" alt="Bulma: a modern CSS framework based on Flexbox" />
            </a>
            <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>
        </nav>
        <div className="container">
          <div className="columns">
            <div className="column is-4">
              <div className="card">
                <div className="card-image">
                  <br />
                  <QRCode value={this.state.btc} size={QRSize} />
                </div>
                <div className="card-content">
                  <div className="media">
                    <div className="media-content">
                      <p className="title is-4">Bitcoin</p>
                      <p className="subtitle is-6" >{this.state.btc}</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
            <div className="column is-4">
              <div className="card">
                <div className="card-image">  <br />
                  <QRCode value={this.state.bch} size={QRSize} />
                </div>
                <div className="card-content">
                  <div className="media">
                    <div className="media-content">
                      <p className="title is-4">Bitcoin Cash</p>
                      <p className="subtitle is-6" >{this.state.bch.split(':')[1]}</p>
                    </div>
                  </div>
                </div>
              </div></div>
            <div className="column is-4"> <div className="card">
              <div className="card-image">  <br />
                <QRCode value={this.state.eth} size={QRSize} />
              </div>
              <div className="card-content">
                <div className="media">
                  <div className="media-content">
                    <p className="title is-4">Ethereum</p>
                    <p className="subtitle is-6" >{this.state.eth}</p>
                  </div>
                </div>

              </div>
            </div></div>
          </div>
          <div className="row">

            <span><strong>Your BIP39, Writing to paper for save</strong></span><br />
            <span>{this.state.bip39}</span><br /><br />
            <span><strong>BCH and BTC WIF Key</strong></span><br />
            <span>{this.state.privateKey}</span>
            <br /><br />
            <span><strong>ETH PrivateKey</strong></span><br />
            <span>{this.state.privateEth}</span><br />


          </div>
          <div className="row">
            <br />
            <br />
            <a className="button is-primary is-rounded" onClick={this.genAddressByBip39}>Generate new Address</a>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
