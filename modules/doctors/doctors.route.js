const express = require('express');
const router = express.Router();
const doctorsController = require('./doctors.controller');
const authMiddleware = require('../../middlewares/auth');

router.use(authMiddleware);

// Create doctor
router.post('/', doctorsController.createDoctor);

// Get all doctors
router.get('/', doctorsController.getDoctors);

// Get specializations & hospitals (must be before /:id)
router.get('/specializations', doctorsController.getAllSpecializations);
router.get('/hospitals', doctorsController.getAllHospitals);

// Get doctor by ID
router.get('/:id', doctorsController.getDoctorById);

// Update doctor
router.put('/:id', doctorsController.updateDoctor);

// Delete doctor
router.delete('/:id', doctorsController.deleteDoctor);

module.exports = router;

