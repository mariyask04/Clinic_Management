import express from "express";
import { authorizeRoles, protect } from '../middlewares/auth.middleware.js';
import { writePrescription } from "../controllers/doctor.controller";

const router = express.Router();

router.post(
    "/write-prescription",
    protect,
    authorizeRoles("doctor"),
    writePrescription
)

export default router;