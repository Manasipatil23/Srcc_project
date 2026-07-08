import express from 'express';
import { getDefaultPatient, getPatientById } from '../controllers/patientController.js';

const router = express.Router();

router.get('/default', getDefaultPatient);
router.get('/:id', getPatientById);

export default router;
