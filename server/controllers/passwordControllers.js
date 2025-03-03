import crypto from 'crypto';

import nodemailer from 'nodemailer';

import User from '../models/user.js'

import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS  // Your Gmail password or app-specific password
    }
  });

export const passwordController = {
    forgotPassword: async (req, res)=>{
        try{
            const { email } = req.body;
            if (!email)
              return res.status(400).json({ message: 'Email is required' });
          
            // Find the user in the database by email
            const user = await User.findOne({ email });
            if (!user)
              return res.status(404).json({ message: 'User not found' });

            // Generate a token and set an expiry time (1 hour from now)
            const token = crypto.randomBytes(20).toString('hex');
            const expiry = Date.now() + 3600000; // 1 hour expiry
          
            // Update the user's reset token fields
            user.resetToken = token;
            user.resetTokenExpiry = expiry;
            await user.save();
          
            // Construct the reset URL (update the domain to your actual front-end domain)
            const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
          
            const mailOptions = {
              to: user.email,
              from: process.env.EMAIL_USER,
              subject: 'Password Reset',
              text: `You are receiving this because a password reset was requested for your account.\n\n` +
                    `Click on the link, or paste it into your browser, to reset your password within one hour:\n\n` +
                    `${resetUrl}\n\n` +
                    `If you did not request this, please ignore this email.`
            };
          
            // Send the email
            transporter.sendMail(mailOptions, (err) => {
              if (err) {
                console.error('Error sending email: ', err);
                return res.status(500).json({ message: 'Error sending email' });
              }
              res.json({ message: 'Reset email sent' });
            });
        } catch(error){
            res.status(500).json({
                message: error
            })
        }
    },

    verifyToken: async (req, res)=>{
        try{
            const { token } = req.query;
            if (!token)
              return res.status(400).json({ message: 'Token is required' });
            
            // Find the user with the matching reset token
            const user = await User.findOne({ resetToken: token });
            if (!user)
              return res.status(400).json({ message: 'Invalid token' });
            
            // Check if the token has expired
            if (user.resetTokenExpiry < Date.now())
              return res.status(400).json({ message: 'Token has expired' });
            
            res.json({ message: 'Token is valid' });
        } catch(error){
            res.status(500).json({
                message: error
            })
        }
    },

    resetPassword: async (req, res)=>{
        try{
            const { token, newPassword } = req.body;
            if (!token || !newPassword)
              return res.status(400).json({ message: 'Token and new password are required' });
          
            // Find the user with the matching reset token
            const user = await User.findOne({ resetToken: token });
            if (!user)
              return res.status(400).json({ message: 'Invalid token' });
            
            // Check if the token is expired
            if (user.resetTokenExpiry < Date.now())
              return res.status(400).json({ message: 'Token has expired' });
          
            // Update the user's password. The pre-save hook in the model will hash the new password.
            user.password = newPassword;
            user.resetToken = null;
            user.resetTokenExpiry = null;
            await user.save();
          
            res.json({ message: 'Password has been reset successfully' });
        } catch(error){
            res.status(500).json({
                message: error
            })
        }
    }
}