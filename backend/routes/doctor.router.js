import express from "express";
import { authorizeRoles, protect } from '../middlewares/auth.middleware.js';
import { createPrescription  } from "../controllers/doctor.controller.js";

const router = express.Router();

router.post(
    "/:patientId/:tokenId",
    protect,
    authorizeRoles("doctor"),
    createPrescription
)

export default router;