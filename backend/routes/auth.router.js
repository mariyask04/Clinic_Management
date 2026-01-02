import express from "express";
import { login, register, sendOtp, resetPassword } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/send-otp", sendOtp);
router.post("/reset-password", resetPassword)

export default router;