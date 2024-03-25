const seedEthereumWallet = require('./seed-ethereum-wallet');

describe('Seed Ethereum Wallet Library', () => {
    it('should generate a seed phrase', () => {
        const seedPhrase = seedEthereumWallet.generateSeedPhrase();
        expect(seedPhrase).toBeDefined();
        // Add more specific assertions if needed
    });

    it('should create an Ethereum wallet from a seed phrase', () => {
        const ethereumWallet = seedEthereumWallet.createEthereumWallet();
        expect(ethereumWallet).toBeDefined();
        expect(ethereumWallet.address).toBeDefined();
        expect(ethereumWallet.privateKey).toBeDefined();
        // Add more specific assertions if needed
    });
});
