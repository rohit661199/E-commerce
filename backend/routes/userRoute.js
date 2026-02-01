import express from 'express';
import {  registerUser,loginUser,updateProfile, getCurrentUser} from '../controllers/userController.js';  
import authUser from '../middleware/auth.js';
import upload from '../middleware/multer.js';



const userRouter = express.Router();

userRouter.post('/register', registerUser); // Route for user registration
userRouter.post('/login', loginUser); // Route for user login 
userRouter.post(
  "/update-profile",
  authUser,                 // ✅ 1. verify token & set req.userId
  upload.single("image"),   // ✅ 2. parse image
  updateProfile             // ✅ 3. controller
);

userRouter.get("/current", authUser, getCurrentUser)
  

export default userRouter;