const Patient = require('./patient.model');
const Doctors = require('../doctors/doctors.model');
const errorHandler = require('../../middlewares/error');

// Create a new patient and link under doctor
const createPatient = async (req, res) => {
  const patientData = req.body;
  const doctorId =  patientData.doctorId;

  if (!doctorId) {
    errorHandler(new Error('Doctor ID is required to add a patient'), req, res)
    return;
  }

  // Verify doctor exists
  const doctor = await Doctors.findById(doctorId);
  if (!doctor) {
    errorHandler(new Error('Doctor not found with the provided ID'), req, res)
    return;
  }

  // Create patient with normalized doctorId
  const newPatient = await Patient.create({
    ...patientData,
    doctorId: doctorId,
  });

  // Update doctor: add patient ID to doctor's patients list
  await Doctors.findByIdAndUpdate(
    doctorId,
    { $addToSet: { patients: newPatient._id } },
    { new: true }
  );

  return newPatient;
};

// Get all patients with optional search & pagination
const getAllPatients = async (queryParams = {}) => {
  const params = queryParams?.query || queryParams || {};
  const {
    search,
    doctorId,
    gender,
    blood_group,
    skip = 0,
    limit = 10,
  } = params;

  const query = {};

  const targetDoctorId = doctorId || doctorId;
  if (targetDoctorId) {
    query.doctorId = targetDoctorId;
  }

  if (gender) {
    query.gender = gender;
  }

  if (blood_group) {
    query.blood_group = blood_group;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { city: { $regex: search, $options: 'i' } },
    ];
  }

  const patients = await Patient.find(query)
    .populate('doctorId', 'name email hospital specialization phone')
    .skip(Number(skip) || 0)
    .limit(Number(limit) || 10)
    .sort({ createdAt: -1 });

  const total = await Patient.countDocuments(query);

  return {
    patients,
    pagination: {
      total,
      skip: Number(skip) || 0,
      limit: Number(limit) || 10,
    },
  };
};

// Get patient by ID
const getPatientById = async (req,res) => {
  const patientId = req.params.id;
  if (!patientId) {
    errorHandler(new Error('Patient ID is required'), req, res)
    return;
  }

  const patient = await Patient.findById(patientId).populate(
    'doctorId',
    'name email hospital specialization phone'
  );

  if (!patient) {
    errorHandler(new Error('Patient not found'), req, res)
    return;
  }

  return patient;
};

// Get all patients under a specific doctor
const getPatientsByDoctor = async (req,res) => {
  const doctorId = req.params.id;
  if (!doctorId) {
    errorHandler(new Error('Doctor ID is required'), req, res)
    return;
  }

  const doctor = await Doctors.findById(doctorId);
  if (!doctor) {
    errorHandler(new Error('Doctor not found'), req, res)
    return;
  }

  const patients = await Patient.find({ doctorId: doctorId }).sort({
    createdAt: -1,
  });

  return {
    doctor: {
      _id: doctor._id,
      name: doctor.name,
      specialization: doctor.specialization,
      hospital: doctor.hospital,
    },
    total: patients.length,
    patients,
  };
};

// Update patient details
const updatePatient = async (req,res) => {
  const patientId = req.params.id;
  const updateData = req.body;
  if (!patientId) {
    errorHandler(new Error('Patient ID is required'), req, res)
    return;
  }

  const existingPatient = await Patient.findById(patientId);
  if (!existingPatient) {
    errorHandler(new Error('Patient not found'), req, res)
    return;
  }

  const newDoctorId = updateData.doctorId || updateData.doctorId;

  // If doctor is being changed, update patient arrays in both doctors
  if (
    newDoctorId &&
    existingPatient.doctorId &&
    existingPatient.doctorId.toString() !== newDoctorId.toString()
  ) {
    const newDoctor = await Doctors.findById(newDoctorId);
    if (!newDoctor) {
      errorHandler(new Error('New doctor not found with the provided ID'), req, res)
      return;
    }

    // Remove from old doctor's patients list
    await Doctors.findByIdAndUpdate(existingPatient.doctorId, {
      $pull: { patients: existingPatient._id },
    });

    // Add to new doctor's patients list
    await Doctors.findByIdAndUpdate(newDoctorId, {
      $addToSet: { patients: existingPatient._id },
    });

    updateData.doctorId = newDoctorId;
  }

  const updatedPatient = await Patient.findByIdAndUpdate(
    patientId,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  ).populate('doctorId', 'name email hospital specialization phone');

  return updatedPatient;
};

// Delete patient and remove reference from doctor
const deletePatient = async (req, res) => {
  const patientId = req.params.id;
  if (!patientId) {
    errorHandler(new Error('Patient ID is required'), req, res)
    return;
  }

  const patient = await Patient.findByIdAndDelete(patientId);
  if (!patient) {
    errorHandler(new Error('Patient not found'), req, res)
    return;
  }

  // Remove patient reference from doctor
  if (patient.doctorId) {
    await Doctors.findByIdAndUpdate(patient.doctorId, {
      $pull: { patients: patient._id },
    });
  }

  return patient;
};

const deletePatientsFromDoctor = async (req, res) => {
  const patientId = req.params.id;
  if (!patientId) {
    errorHandler(new Error('Patient ID is required'), req, res)
    return;
  }

  const patient = await Patient.findByIdAndDelete(patientId);
  if (!patient) {
    throw new Error('Patient not found');
  }

  // Remove patient reference from doctor
  if (patient.doctorId) {
    await Doctors.findByIdAndUpdate(patient.doctorId, {
      $pull: { patients: patient._id },
    });
  }

  return patient;
};

module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  getPatientsByDoctor,
  updatePatient,
  deletePatient,
    deletePatientsFromDoctor
};
