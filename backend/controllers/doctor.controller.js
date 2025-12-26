import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/User.model.js";

const register = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, password and phone are required"
      });
    }

    const existingDoctor = await User.findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: "Doctor already exists with this email"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await User.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      role: "doctor"
    });

    const token = jwt.sign(
      {
        userId: doctor._id,
        role: doctor.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(201).json({
      success: true,
      message: "Doctor registered successfully",
      token,
      data: {
        id: doctor._id,
        fullName: doctor.fullName,
        email: doctor.email,
        role: doctor.role
      }
    });

  } catch (error) {
    console.error("Error registering doctor:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

export { register };
