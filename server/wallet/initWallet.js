import { Wallet } from 'ethers'; // Import only the Wallet class
import WalletModel from '../models/wallet.js';
import { scryptSync, randomBytes } from 'crypto'; // Using scrypt for strong encryption

// Environment variable approach for encryption key (more secure)
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

// Error handling (consider using a logging library for production)
function handleError(error) {
  console.error('Error creating wallet:', error);
  throw error; // Re-throw for caller to handle
}

export const createWallet = async (userId) => {
  try {
    console.log('Creating wallet for user:', userId);

    // Generate a new Ethereum wallet using ethers.js
    const wallet = Wallet.createRandom();

    // Access private key and convert to hex string directly
    const privateKey = wallet.privateKey; // Convert BigNumber to hex string
    const address = wallet.address;
    const publicKey = wallet.publicKey;

    // Encrypt the private key using scrypt with a random salt
    const salt = randomBytes(32).toString('hex');
    const encryptedPrivateKey = scryptSync(privateKey, salt, {
      n: 1024, // Adjust parameters as needed
      r: 8,
      p: 1,
      dklen: 32
    }).toString('hex');

    // Save wallet details in the Wallet collection
    const newWallet = new WalletModel({
      address: address,
      privateKey: encryptedPrivateKey, // Store the encrypted key
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
