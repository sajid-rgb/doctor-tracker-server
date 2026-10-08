const express = require('express');
const router = express.Router();
const authRoutes = require('../modules/auth/auth.route');
const userRoutes = require('../modules/users/users.route');
const doctorsRoutes = require('../modules/doctors/doctors.route');
const patientRoutes = require('../modules/patient/patient.route');      
const dashboardRoutes = require('../modules/dashboard/dashboard.route');

// Mount the auth routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/doctors',doctorsRoutes);
router.use('/patients',patientRoutes)
router.use('/dashboard',dashboardRoutes)

module.exports = router;
