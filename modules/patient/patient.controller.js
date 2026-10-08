const errorHandler = require('../../middlewares/error');
const patientService = require('./patient.service');

const createPatient = async (req,res) => {
  try {
    const result = await patientService.createPatient(req,res);
    res.status(201).json({
      success: true,
      message: 'Patient created successfully',
      data: result,
    });
  } catch (error) {
    errorHandler(error,req,res)
  }
}

const getAllPatients = async (req,res) => {
    try {
        const result = await patientService.getAllPatients(req,res);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        errorHandler(error,req,res)
    }
}

const getPatientCondition = async(req,res)=>{
    try {
        const result = await patientService.getPatientCondition(req,res);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        errorHandler(error,req,res)
    }
}

const getPatientById = async (req,res) => {
    try {
        const result = await patientService.getPatientById(req,res);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        errorHandler(error,req,res)
    }
}

const getPatientsByDoctor = async (req,res) => {
    try {
        const result = await patientService.getPatientsByDoctor(req,res);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        errorHandler(error,req,res)
    }
}   

const updatePatient = async (req,res) => {
    try {
        const result = await patientService.updatePatient(req,res);
        res.status(200).json({
            success: true,
            message: 'Patient updated successfully',
            data: result,
        });
    } catch (error) {
        errorHandler(error,req,res)
    }
}

const deletePatient = async (req,res) => {
    try {
        const result = await patientService.deletePatient(req,res);
        res.status(200).json({
            success: true,
            message: 'Patient deleted successfully',
            data: result,
        });
    } catch (error) {
        errorHandler(error,req,res)
    }
}

const deletePatientsFromDoctor = async (req,res) => {
    try {
        const result = await patientService.deletePatientsFromDoctor(req, res);
        res.status(200).json({
            success: true,
            message: 'Patient deleted successfully',
            data: result,
        });
    } catch (error) {
        errorHandler(error,req,res)
    }
}

module.exports = {
    createPatient,
    getAllPatients,
    getPatientCondition,
    getPatientById,
    getPatientsByDoctor,
    updatePatient,
    deletePatient,
    deletePatientsFromDoctor
}