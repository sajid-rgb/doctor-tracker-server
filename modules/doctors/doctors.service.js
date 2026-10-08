const errorHandler = require('../../middlewares/error');
const Doctors = require('./doctors.model');


// Create doctor
const createDoctor = async (req, res) => {
  const { email } = req.body;

  const existingDoctor = await Doctors.findOne({ email });

  if (existingDoctor) {
    throw errorHandler(new Error('Doctor with this email already exists'),req,res);
  }

  const doctor = await Doctors.create(req?.body);

  return {
    success: true,
    message: 'Doctor created successfully',
    data: doctor,
  };
};

// Get all doctors
const getDoctors = async (queryParams) => {
  const params = queryParams?.query || queryParams || {};
  const {
    specialization,
    hospital,
    search,
    skip = 0,
    limit = 10,
    toDate,
    fromDate,
  } = params;

  const query = {};

  // Filter by specialization
  if (specialization) {
    query.specialization = specialization;
  }

  // Filter by hospital
  if (hospital) {
    query.hospital = hospital;
  }

  // Search
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { hospital: { $regex: search, $options: 'i' } },
      { specialization: { $regex: search, $options: 'i' } },
    ];
  }

  // Filter by createdAt
  if (fromDate || toDate) {
    const createdAtFilter = {};

    if (fromDate) {
      const startDate = new Date(fromDate.includes('T') ? fromDate : `${fromDate}T00:00:00.000Z`);
      if (!isNaN(startDate.getTime())) {
        createdAtFilter.$gte = startDate;
      }
    }

    if (toDate) {
      const endDate = new Date(toDate.includes('T') ? toDate : `${toDate}T00:00:00.000Z`);
      if (!isNaN(endDate.getTime())) {
        // Include the entire toDate day
        endDate.setUTCDate(endDate.getUTCDate() + 1);
        createdAtFilter.$lt = endDate;
      }
    }

    if (Object.keys(createdAtFilter).length > 0) {
      query.createdAt = createdAtFilter;
    }
  }

  const doctors = await Doctors.find(query).populate('patients','name phone address')
    .skip(Number(skip) || 0)
    .limit(Number(limit) || 10)
    .sort({ createdAt: -1 });

  const total = await Doctors.countDocuments(query);

  return {
    success: true,
    data: doctors,
    pagination: {
      total,
      skip: Number(skip) || 0,
      limit: Number(limit) || 10,
    },
  };
};

// Get doctor by ID
const getDoctorById = async (req, res) => {
  const doctorId = req.params.id;
  
  if (!doctorId) {
    errorHandler(new Error('Doctor ID is required'),req,res)  
  }

  const doctor = await Doctors.findById(doctorId).populate('patients','name phone address');

  if (!doctor) {
    errorHandler(new Error('Doctor not found'),req,res)  
  }

  return {
    success: true,
    data: doctor,
  };
};

// Update doctor
const updateDoctor = async (req, res) => {
  const doctorId = req.params.doctorId || req.params.id;
  const {updateData} = req.body;
  
  if (!doctorId) {
    errorHandler(new Error('Doctor ID is required'),req,res)  
  }

  if (updateData.email) {
    const existingDoctor = await Doctors.findOne({
      email: updateData.email,
      _id: { $ne: doctorId },
    });

    if (existingDoctor) {
     errorHandler(new Error('Doctor with this email already exists'),req,res)  
    }
  }

  const doctor = await Doctors.findByIdAndUpdate(doctorId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!doctor) {
    errorHandler(new Error('Doctor not found'),req,res)  
  }

  return {
    success: true,
    message: 'Doctor updated successfully',
    data: doctor,
  };
};

// Delete doctor
const deleteDoctor = async (req, res) => {
  const doctorId = req.params.doctorId || req.params.id;
  if (!doctorId) {
    errorHandler(new Error('Doctor ID is required'),req,res)  
  }

  const doctor = await Doctors.findByIdAndDelete(doctorId);

  if (!doctor) {
    errorHandler(new Error('Doctor not found'),req,res)  
  }

  return {
    success: true,
    message: 'Doctor deleted successfully',
    data: doctor,
  };
};

const getAllSpecializations = async (req, res) => {
  const specializations = await Doctors.distinct('specialization')
  return {
    success: true,
    data: specializations,
  };
};

const getAllHospitals = async (req, res) => {  
  const hospitals = await Doctors.distinct('hospital')
  return {
    success: true,
    data: hospitals,
  };
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
