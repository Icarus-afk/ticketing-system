import cron from 'node-cron';
import ethers from 'ethers';
import Wallet from './models/wallet.js'; 
import mongoose from 'mongoose';

import dotenv from 'dotenv'

dotenv.config()

const MONGO_STRING = process.env.MONGO_STRING;

mongoose.connect(String(MONGO_STRING))
  .then(() => {
    console.log(`Successfully connect}`);
  })
  .catch(error => {
    console.error('Error connecting to MongoDB:', error);
  });

const provider = new ethers.providers.JsonRpcProvider('http://localhost:7545'); 
console.log('Provider created');

async function syncBalances() {
  console.log('Syncing balances...');

  try {
    const wallets = await Wallet.find({});
    console.log(`Found ${wallets.length} wallets`);
    for (const wallet of wallets) {
      console.log(`Processing wallet ${wallet.address}`);
      const blockchainBalance = await provider.getBalance(wallet.address);
      console.log(`Blockchain balance: ${blockchainBalance}`);

      const balanceInEther = ethers.utils.formatEther(blockchainBalance);
      const balanceInEtherNumber = parseFloat(balanceInEther);
      console.log(`Balance in Ether: ${balanceInEther}`);

      if (wallet.balance !== balanceInEtherNumber) {
        console.log('Balance mismatch detected, updating database');
        wallet.balance = balanceInEther;
        await wallet.save();

        console.log('Database updated');
      }
    }
  } catch (error) {
    console.error('Error during sync:', error);
  }

  console.log('Syncing completed');
}

// Schedule the function to run every 5 seconds
cron.schedule('*/5 * * * * *', syncBalances);
console.log('Cron job scheduled');