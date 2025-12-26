import express from "express";
import {register} from "../controllers/doctor.controller.js";

const router = express.Router();

router.post("/register", register);

export default router;