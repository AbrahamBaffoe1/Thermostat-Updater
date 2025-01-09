// routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';
import { Op } from 'sequelize';

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
 try {
   const { username, email, password } = req.body;

   // Check if user exists by email or username
   const userExists = await User.findOne({
     where: {
       [Op.or]: [
         { email },
         { username } 
       ]
     }
   });

   if (userExists) {
     return res.status(400).json({
       message: userExists.email === email ? 'Email already exists' : 'Username already taken'
     });
   }

   // Create user
   const password_hash = await bcrypt.hash(password, 10);
   
   const user = await User.create({
     username,
     email,
     password_hash
   });

   // Generate token
   const token = jwt.sign(
     { userId: user.id },
     process.env.JWT_SECRET,
     { expiresIn: '24h' }
   );

   // Send response
   res.status(201).json({
     token,
     user: {
       id: user.id,
       username: user.username,
       email: user.email
     }
   });

 } catch (error) {
   console.error(error);
   res.status(500).json({ message: error.message || 'Server error' });
 }
});

// Login route
router.post('/login', async (req, res) => {
 try {
   const { email, password } = req.body;

   // Find user by email
   const user = await User.findOne({ where: { email } });
   if (!user) {
     return res.status(400).json({ message: 'Invalid credentials' });
   }

   // Verify password
   const isMatch = await bcrypt.compare(password, user.password_hash);
   if (!isMatch) {
     return res.status(400).json({ message: 'Invalid credentials' });
   }

   // Generate token
   const token = jwt.sign(
     { userId: user.id },
     process.env.JWT_SECRET,
     { expiresIn: '24h' }
   );

   // Send response
   res.json({
     token,
     user: {
       id: user.id,
       username: user.username,
       email: user.email
     }
   });

 } catch (error) {
   console.error(error);
   res.status(500).json({ message: 'Server error' });
 }
});

export default router;