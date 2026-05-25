import express from 'express';
import { createConsultation } from '../controllers/consultationController.js';

const router = express.Router();

// POST /api/consultation/create
router.post('/create', createConsultation);

export default router;
