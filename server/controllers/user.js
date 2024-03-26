import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { mongoose } from "mongoose";
import UserModel from "../models/user.js";
import { createWallet } from "../wallet/initWallet.js";

const secret = 'test';

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await UserModel.findOne({ email });

    if (!oldUser) return res.status(404).json({ code: 404, success: false, message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ code: 400, success: false, message: "Invalid credentials" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: "1h" });

    res.status(200).json({ code: 200, success: true, message: "Signed in successfully", data: { result: oldUser, token } });

  } catch (err) {

    res.status(500).json({ code: 500, success: false, message: "Something went wrong" });
  }
};


export const signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  try {
    const oldUser = await UserModel.findOne({ email });

    if (oldUser) return res.status(400).json({ code: 400, success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 12);
    try {
      const result = await UserModel.create({ email, password: hashedPassword, name: `${firstName} ${lastName}` });
      const wallet = await createWallet(result._id);
      console.log('Wallet created:', wallet);

      const token = jwt.sign({ email: result.email, id: result._id }, secret, { expiresIn: "1h" });

      return res.status(201).json({ code: 201, success: true, message: "User successfully created", data: { result, token} });
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error; // Rethrow the error to be caught by the outer catch block
    }

  } catch (error) {
    console.error('Error in signup:', error);
    return res.status(500).json({ code: 500, success: false, message: "Something went wrong" });
  }
};


export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, dateOfBirth, address, phoneNumber, photo } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ code: 404, success: false, message: `No user with id: ${id}` });

  const updatedUser = { name: `${firstName} ${lastName}`, dateOfBirth, address, phoneNumber, photo, _id: id };

  try {
    await UserModel.findByIdAndUpdate(id, updatedUser, { new: true });
    res.json({ code: 200, success: true, message: "User updated successfully.", data: updatedUser });
  } catch (error) {
    res.status(500).json({ code: 500, success: false, message: "Something went wrong" });
  }
};


export const deleteUser = async (req, res) => {
  const { id } = req.params;
  console.log('ID:', id);

  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ code: 404, success: false, message: `No user with id: ${id}` });

  try {
    const user = await UserModel.findByIdAndDelete(id); // Store the result in a variable

    if (!user) {
      // If no user was deleted, send a 404 response
      return res.status(404).json({ code: 404, success: false, message: `user not found` });
    }

    res.json({ code: 200, success: true, message: "User deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, success: false, message: "Something went wrong" });
  }
};