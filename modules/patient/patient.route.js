const express = require('express');
const router = express.Router();
const patientController = require('./patient.controller');
const authMiddleware = require('../../middlewares/auth');

router.use(authMiddleware);

// Create patient
router.post('/', patientController.createPatient);

// Get all patients
router.get('/', patientController.getAllPatients);

// Get patient by ID
router.get('/:id', patientController.getPatientById);

router.get('/getPatientsByDoctor/:id', patientController.getPatientsByDoctor);

// Update patient
router.patch('/:id', patientController.updatePatient);
router.put('/:id', patientController.updatePatient);

// delete patient from doctor
router.delete('/deletePatientsFromDoctor/:id', patientController.deletePatientsFromDoctor);

// Delete patient
router.delete('/:id', patientController.deletePatient);

module.exports = router;