// controllers/authController.js
import User from '../models/user.js';

export const authController = {
    register : async (req, res) => {
        try{
            const { email, password } = req.body;
            if (!email || !password)
            return res.status(400).json({ message: 'Email and password are required' });
            
            // Check if a user with this email already exists
            const existingUser = await User.findOne({ email });
            if (existingUser)
            return res.status(400).json({ message: 'User already exists' });
            
            // Create a new user (the pre-save hook in the model will hash the password)
            const newUser = new User({ email, password });
            await newUser.save();
            
            res.status(201).json({ message: 'User registered successfully' });
        } catch(error){
            res.status(500).json({
                message:error
            })
        }
    },

    login: async (req, res)=>{
        try{
            const { email, password } = req.body;
        
            if (!email || !password)
                return res.status(400).json({ message: 'Email and password are required' });
            
            // Find the user in the database
            const user = await User.findOne({ email });
            if (!user)
                return res.status(404).json({ message: 'User not found' });
            
            // Compare the provided password with the stored hashed password
            const isMatch = await user.comparePassword(password);
            if (!isMatch)
                return res.status(400).json({ message: 'Invalid credentials' });
            
            // On successful login, you might generate a token or session
            res.json({ message: 'Login successful. You can reset your password from your dashboard if needed.' });
        } catch(error){
            res.status(500).json({
                message: error
            })
        }
    }
      
} 


