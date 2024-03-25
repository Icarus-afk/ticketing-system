import mongoose from "mongoose";

const walletSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
        unique: true
    },
    privateKey: {
        type: String,
        required: true
    },
    publicKey: {
        type: String,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

export default mongoose.model('Wallet', walletSchema);