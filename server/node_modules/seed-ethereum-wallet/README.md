# Seed Ethereum Wallet

## Introduction
Seed Ethereum Wallet is a simple JavaScript library that allows you to generate seed phrases and create Ethereum wallets from these seed phrases. 

## Installation
You can install the library via npm or yarn:

```
npm install seed-ethereum-wallet
```
or
```
yarn add seed-ethereum-wallet
```

## Usage
Here's how to use the library to generate a seed phrase and create an Ethereum wallet from the seed phrase:
```
const seedEthereumWallet = require('seed-ethereum-wallet');

// Generate a seed phrase
const seedPhrase = seedEthereumWallet.generateSeedPhrase();
console.log('Seed Phrase:', seedPhrase);

// Create an Ethereum wallet from the seed phrase
const ethereumWallet = seedEthereumWallet.createEthereumWallet();
console.log('Ethereum Wallet:');
console.log('Address:', ethereumWallet.address);
console.log('Private Key:', ethereumWallet.privateKey);
```

## License
This library is released under the MIT License.
