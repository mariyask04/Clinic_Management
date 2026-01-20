import express from "express";
import {
    getTodayPatients,
    getWaitingPatients,
    getCompletedPatients,
    getPatientFullDetails,
    getPatientHistory,
    updateStatus
} from "../controllers/patient.controller.js";

const router = express.Router();

router.get("/today", getTodayPatients);
router.get("/waiting", getWaitingPatients);
router.get("/completed", getCompletedPatients);
router.get("/full-details/:id", getPatientFullDetails);
router.get("/history", getPatientHistory);
router.put("/status/:tokenId", updateStatus);

export default router;