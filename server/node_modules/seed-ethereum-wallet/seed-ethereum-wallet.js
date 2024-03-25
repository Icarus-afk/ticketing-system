const seedPhraseGenerator = require('seed-phrase-generator');

function generateSeedPhrase() {
    return seedPhraseGenerator.generateSeedPhrase();
}

function createEthereumWallet() {
    const seedPhrase = generateSeedPhrase();
    const ethereumWallet = seedPhraseGenerator.createEthereumWalletFromSeedPhrase(seedPhrase);
    return ethereumWallet;
}

module.exports = {
    generateSeedPhrase: generateSeedPhrase,
    createEthereumWallet: createEthereumWallet
};

