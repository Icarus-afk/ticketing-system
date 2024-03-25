const seedEthereumWallet = require('./seed-ethereum-wallet');

const seedPhrase = seedEthereumWallet.generateSeedPhrase();
console.log('Seed Phrase:', seedPhrase);

const ethereumWallet = seedEthereumWallet.createEthereumWallet();
console.log('Ethereum Wallet:');
console.log('Address:', ethereumWallet.address);
console.log('Private Key:', ethereumWallet.privateKey);

