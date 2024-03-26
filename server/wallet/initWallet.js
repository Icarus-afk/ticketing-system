import { randomBytes, createCipheriv } from 'crypto';
import { Wallet } from 'ethers'
import dotenv from 'dotenv'
import walletSchema from '../models/wallet.js'
import Web3 from 'web3';

dotenv.config()

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY

// Connect to the Ganache network
const web3 = new Web3('http://localhost:7545'); // Replace with your Ganache network URL

function handleError(error) {
  console.error(error);
}

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
    const newWallet = new walletSchema({
      address: address,
      privateKey: encryptedPrivateKey,
      publicKey: publicKey,
      userId: userId,
    });

    console.log('Saving wallet:', newWallet);

    await newWallet.save();

    console.log('Wallet saved successfully');

    // Connect the wallet to the Ganache network
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;

    console.log('Wallet connected to Ganache network');

    return newWallet;
  } catch (error) {
    handleError(error);
  }
};