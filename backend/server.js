import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.config.js";

import authRouter from "./routes/auth.router.js";
import receptionistRouter from "./routes/receptionist.router.js";
import patientRouter from "./routes/patient.router.js";
import doctorRouter from "./routes/doctor.router.js";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/auth", authRouter);
app.use("/api/receptionist", receptionistRouter);
app.use("/api/patient", patientRouter);
app.use("/api/doctor", doctorRouter)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})