import validator from 'validator';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import { v2 as cloudinary } from 'cloudinary'; // import cloudinary from '../config/cloudinary.js';


const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}


// Route for user registration
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user already exists or not

        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: 'User already exists' });
        }


        // validating email format and strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'please enter a valid email' });
        }

        if (password.length < 8) {
            return res.json({ success: false, message: 'please enter a strong password' });
        }

        // Hashing password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);


        // Creating new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        });

        const user = await newUser.save();

        const token = createToken(user._id);

        res.json({ success: true, token, user });



    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

// Route for user login
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        // Check if user exists or not
        if (!user) {
            return res.json({ success: false, message: 'User does not exist' });
        }

        const isMatch = await bcryptjs.compare(password, user.password);


        // if password is matched
        if (isMatch) {
            const token = createToken(user._id);
            res.json({ success: true, token, user });
        }

        // if password is not matched
        else {
            res.json({ success: false, message: 'Invalid credentials' });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}

const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ message: "userId not found" });
    }

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


// API to update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const {  name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    if (imageFile) {
      // upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    res.json({ success: true, message: "Profile Updated" , user: await userModel.findById(userId).select("-password") });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


 




export {  registerUser, loginUser , updateProfile, getCurrentUser}; 