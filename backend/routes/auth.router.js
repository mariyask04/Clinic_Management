import express from "express";
import { login, register, getProfile, updateProfile, sendOtp, resetPassword } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", protect, getProfile);
router.put("/profile/update", protect, updateProfile);
router.post("/send-otp", sendOtp);
router.post("/reset-password", resetPassword)

export default router;