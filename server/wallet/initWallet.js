import { randomBytes, createCipheriv } from 'crypto';

export const createWallet = async (userId) => {
  try {
    console.log('Creating wallet for user:', userId);

    // Generate a new Ethereum wallet using ethers.js
    const wallet = Wallet.createRandom();

    // Access private key and convert to hex string directly
    const privateKey = wallet.privateKey;
    const address = wallet.address;
    const publicKey = wallet.publicKey;

    // Generate a random initialization vector
    const iv = randomBytes(16);

    // Create a cipher using the encryption key and initialization vector
    const cipher = createCipheriv('aes-256-ctr', ENCRYPTION_KEY, iv);

    // Encrypt the private key
    let encryptedPrivateKey = cipher.update(privateKey, 'utf8', 'hex');
    encryptedPrivateKey += cipher.final('hex');

    // Save wallet details in the Wallet collection
    const newWallet = new WalletModel({
      address: address,
      privateKey: encryptedPrivateKey,
      publicKey: publicKey,
      userId: userId,
    });

    console.log('Saving wallet:', newWallet);

    await newWallet.save();

    console.log('Wallet saved successfully');

    return newWallet;
  } catch (error) {
    handleError(error);
  }
};