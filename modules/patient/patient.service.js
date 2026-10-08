const Patient = require('./patient.model');
const Doctors = require('../doctors/doctors.model');
const errorHandler = require('../../middlewares/error');

// Create a new patient and link under doctor
const createPatient = async (req, res) => {
  const patientData = req.body;
  const doctorId = patientData.doctorId;

  if (!doctorId) {
    errorHandler(new Error('Doctor ID is required to add a patient'), req, res);
    return;
  }

  // Verify doctor exists using .select('_id').lean()
  const doctor = await Doctors.findById(doctorId).select('_id').lean();
  if (!doctor) {
    errorHandler(new Error('Doctor not found with the provided ID'), req, res);
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
    patientCondition,
    skip = 0,
    limit = 10,
  } = params;

  const query = {};

  if (doctorId && doctorId !== 'all') {
    query.doctorId = doctorId;
  }

  if (gender && gender !== 'all') {
    query.gender = gender;
  }

  if (blood_group && blood_group !== 'all') {
    query.blood_group = blood_group;
  }

  if (patientCondition && patientCondition !== 'all') {
    query.patientCondition = patientCondition;
  } 

  if (search && search.trim()) {
    const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    query.$or = [
      { name: { $regex: escaped, $options: 'i' } },
      { email: { $regex: escaped, $options: 'i' } },
      { phone: { $regex: escaped, $options: 'i' } },
      { city: { $regex: escaped, $options: 'i' } },
    ];
  }


  const [patients, total] = await Promise.all([
    Patient.find(query)
      .populate('doctorId', 'name email hospital specialization phone')
      .skip(Number(skip) || 0)
      .limit(Number(limit) || 10)
      .sort({ createdAt: -1 })
      .lean(),
    Patient.countDocuments(query),
  ]);

  return {
    patients,
    pagination: {
      total,
      skip: Number(skip) || 0,
      limit: Number(limit) || 10,
    },
  };
};

const getPatientCondition = async (req,res) => {
  const result = await Patient.distinct('patientCondition');
  return (result || []).filter(Boolean);
} 

// Get patient by ID
const getPatientById = async (req, res) => {
  const patientId = req.params.id;
  if (!patientId) {
    errorHandler(new Error('Patient ID is required'), req, res);
    return;
  }

  const patient = await Patient.findById(patientId)
    .populate('doctorId', 'name email hospital specialization phone')
    .lean();

  if (!patient) {
    errorHandler(new Error('Patient not found'), req, res);
    return;
  }

  return patient;
};

// Get all patients under a specific doctor
const getPatientsByDoctor = async (req, res) => {
  const doctorId = req.params.id;
  if (!doctorId) {
    errorHandler(new Error('Doctor ID is required'), req, res);
    return;
  }


  const [doctor, patients] = await Promise.all([
    Doctors.findById(doctorId).select('name specialization hospital').lean(),
    Patient.find({ doctorId: doctorId }).sort({ createdAt: -1 }).lean(),
  ]);

  if (!doctor) {
    errorHandler(new Error('Doctor not found'), req, res);
    return;
  }

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
const updatePatient = async (req, res) => {
  const patientId = req.params.id;
  const updateData = req.body;
  if (!patientId) {
    errorHandler(new Error('Patient ID is required'), req, res);
    return;
  }

  const existingPatient = await Patient.findById(patientId).select('doctorId');
  if (!existingPatient) {
    errorHandler(new Error('Patient not found'), req, res);
    return;
  }

  const newDoctorId = updateData.doctorId;


  if (
    newDoctorId &&
    existingPatient.doctorId &&
    existingPatient.doctorId.toString() !== newDoctorId.toString()
  ) {
    const newDoctor = await Doctors.findById(newDoctorId).select('_id').lean();
    if (!newDoctor) {
      errorHandler(new Error('New doctor not found with the provided ID'), req, res);
      return;
    }

  
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
  ).populate('doctorId', 'name email hospital specialization phone').lean();

  return updatedPatient;
};

// Delete patient and remove reference from doctor
const deletePatient = async (req, res) => {
  const patientId = req.params.id;
  if (!patientId) {
    errorHandler(new Error('Patient ID is required'), req, res);
    return;
  }

  const patient = await Patient.findByIdAndDelete(patientId);
  if (!patient) {
    errorHandler(new Error('Patient not found'), req, res);
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

const deletePatientsFromDoctor = deletePatient;

module.exports = {
  createPatient,
  getAllPatients,
  getPatientById,
  getPatientsByDoctor,
  updatePatient,
  deletePatient,
  deletePatientsFromDoctor,
  getPatientCondition
};
