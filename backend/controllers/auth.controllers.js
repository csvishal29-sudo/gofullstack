import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import genToken from '../utils/token.js';
import { sendOtpMail } from '../utils/mail.js';

export const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400)
                .json({ message: 'User is already exist'});
        }
        if (password.length < 6) {
            return res.status(400)
                .json({ message: 'Password must be at least 6 characters long' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        const token= await genToken(user._id);
        res.cookie("token", token, {
            secure:false,
            sameSite:"strict",
            maxAge:7*24*60*60*1000,
            httpOnly:true
        });

        return res.status(201).json(user);
        
    } catch (error) {
        return res.status(500).json(`sign up error ${error}`);
       
            
    }
}



export const signIn = async (req, res) => {
    try {
        const {  email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400)
                .json({ message: 'User not found'});
        }
       
       const isMatch= await bcrypt.compare(password,user.password);
       if(!isMatch){
        return res.status(400)
        .json({ message: 'Invalid password'});
       }

        const token= await genToken(user._id);
        res.cookie("token", token, {
            secure:false,
            sameSite:"strict",
            maxAge:7*24*60*60*1000,
            httpOnly:true
        });

        return res.status(200).json(user);
        
    } catch (error) {
        return res.status(500).json(`sign In error ${error}`);
       
            
    }
}




export const signOut = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({message:"Signout successful"});
    } catch (error) {
        return res.status(500).json(`sign Out error ${error}`);

    }
}

export const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        
        try {
            await sendOtpMail(email, otp);
            
            user.resetOtp = otp;
            user.otpExpires = Date.now() + 5 * 60 * 1000; // 5 minutes from now
            user.isOtpVerified = false;
            await user.save();
            
            return res.status(200).json({ message: 'OTP sent to your email' });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            return res.status(500).json({ 
                message: 'Failed to send OTP email', 
                error: emailError.message 
            });
        }
    } catch (error) {
        console.error('Send OTP error:', error);
        return res.status(500).json({ 
            message: 'Internal server error', 
            error: error.message 
        });
    }
}

export const verifyOtp= async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });
        if (!user || user.resetOtp !== otp  || user.otpExpires < Date.now()) {
            return res.status(400)
                .json({ message: 'Invalid or expired OTP'});

            }
        user.isOtpVerified = true;
        user.resetOtp = undefined;
        user.otpExpires = undefined;
        await user.save();
        return res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        return res.status(500).json(`verify otp error ${error}`);
    }   
}

export const resetPassword= async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        const user = await User.findOne({ email });
        if (!user || !user.isOtpVerified) {
            return res.status(400)
                .json({ message: 'OTP not verified'});
        } 
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.isOtpVerified = false;
        await user.save();
        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        return res.status(500).json(`reset password error ${error}`);
    }   
}