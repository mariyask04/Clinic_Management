import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';
import { sendEmail } from '../utils/sendEmail.js';

const register = async (req, res) => {
    try {
        const { fullName, email, phone, password, role } = req.body;
        if (!fullName || !email || !phone || !password || !role) {
            return res.status(400).json({ success: false, message: "For registration full name, email, password and role are required." })
        }
        const existingUser = await User.findOne({ email, role });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "User with this email already exsists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            fullName,
            email,
            phone,
            password: hashedPassword,
            role
        });
        await newUser.save();
        res.status(201).json({ success: true, message: "User registered successfully" });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password || !role) {
            return res.status(400).json({ success: false, message: "Email, password and role is required for login." })
        }
        const user = await User.findOne({ email, role });
        if (!user) {
            return res.status(400).json({ success: false, message: `${role} with this email does not exist` });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }
        const token = jwt.sign({
            userId: user._id,
            role: user.role
        }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.status(200).json({ success: true, token, message: "Login successful" });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password -otp -otpExpiry");
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({ message: "Profile fetched successfully", user });
    } catch (error) {
        console.error("Get Profile Error:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}

const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // Added by verifyToken middleware
        const { fullName, email, phone } = req.body;

        // Check if email already exists for another user
        const emailExists = await User.findOne({ email, _id: { $ne: userId } });
        if (emailExists) {
            return res.status(400).json({ message: "Email is already in use by another user." });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { fullName, email, phone },
            { new: true, runValidators: true, select: "-password -__v" }
        );

        return res.status(200).json({
            message: "Profile updated successfully",
            user: updatedUser,
        });
    } catch (error) {
        console.error("Update Profile Error:", error);
        return res.status(500).json({
            message: "Server error while updating profile",
            error: error.message,
        });
    }
};

const sendOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "User with this email does not exists" });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpiry = Date.now() + 10 * 60 * 1000;
        await user.save();
        await sendEmail(
            user.email,
            "Password reset OTP.",
            `Your OTP to reset your Password is : ${otp}. It is valid for 10 minutes.`
        );
        res.status(200).json({
            success: true,
            message: "OTP sent to registered email"
        });
    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const user = await User.findOne({ email, otp, otpExpiry: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired OTP"
            });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetOtp = undefined;
        user.resetOtpExpiry = undefined;
        await user.save();
        res.status(200).json({
            success: true,
            message: "Password reset successful"
        });
    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}

export {
    register,
    login,
    getProfile,
    updateProfile,
    sendOtp,
    resetPassword
}