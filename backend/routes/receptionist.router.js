import express from 'express';
import { authorizeRoles, protect } from '../middlewares/auth.middleware.js';
import { addPatient, editPatient, removePatient, generateToken, updatePatientStatus, generateBill, markBillAsPaid } from '../controllers/receptionist.controller.js';

const router = express.Router();

router.post(
    "/add-patient",
    protect,
    authorizeRoles("receptionist"),
    addPatient
);

router.put(
    "/edit-patient/:id",
    protect,
    authorizeRoles("receptionist"),
    editPatient
);

router.delete(
    "/remove-patient/:id",
    protect,
    authorizeRoles("receptionist"),
    removePatient
);

router.post(
    "/assign-token/:patientId",
    protect,
    authorizeRoles("receptionist"),
    generateToken
);

router.put(
    "/update-status/:tokenId",
    protect,
    authorizeRoles("receptionist","doctor"),
    updatePatientStatus
);

router.post(
  "/generate-bill",
  protect,
  authorizeRoles("receptionist"),
  generateBill
);

router.put(
  "/bill/mark-paid/:billId",
  protect,
  authorizeRoles("receptionist"),
  markBillAsPaid
);

export default router;