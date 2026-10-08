const errorHandler = require('../../middlewares/error');
const doctorsService = require('./doctors.service');


const createDoctor = async (req, res) => {
    try {
        const result = await doctorsService.createDoctor(req, res);
        res.status(201).json({
            success: true,
            message: 'Doctor created successfully',
            data: result,
        });
    } catch (error) {
        errorHandler(error,req,res)
    }
};

const getDoctors = async (req, res) => {
    try {
        const result = await doctorsService.getDoctors(req, res);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        errorHandler(error,req,res)
    }
};

const getDoctorById = async (req, res) => {
    try {
        const result = await doctorsService.getDoctorById(req, res);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        errorHandler(error,req,res)
    }
};

const updateDoctor = async (req, res) => {
    try {
        const result = await doctorsService.updateDoctor(req, res);
        res.status(200).json({
            success: true,
            message: 'Doctor updated successfully',
            data: result,
        });
    } catch (error) {
        errorHandler(error,req,res)
    }
};

const deleteDoctor = async (req, res) => {
    try {
        const result = await doctorsService.deleteDoctor(req, res);
        res.status(200).json({
            success: true,
            message: 'Doctor deleted successfully',
            data: result,
        });
    } catch (error) {
        errorHandler(error,req,res)
    }
};

const getAllSpecializations = async (req, res) => {
    try {
        const result = await doctorsService.getAllSpecializations(req, res);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        errorHandler(error, req, res);
    }
};

const getAllHospitals = async (req, res) => {
    try {
        const result = await doctorsService.getAllHospitals(req, res);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        errorHandler(error, req, res);
    }
};

module.exports = {
    createDoctor,
    getDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
    getAllSpecializations,
    getAllHospitals,
};

