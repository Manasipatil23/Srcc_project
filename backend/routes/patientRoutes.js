import express from 'express';
import { getDefaultPatient, getPatientById, updatePatient, addDocument, getAllPatients } from '../controllers/patientController.js';

const router = express.Router();

router.get('/', getAllPatients);
router.get('/default', getDefaultPatient);
router.get('/:id', getPatientById);
router.put('/:id', updatePatient);
router.post('/:id/documents', addDocument);

export default router;
