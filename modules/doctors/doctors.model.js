const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  hospital: {
    type: String,
    required: true,
  },
  specialization: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  patients: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Patient',
    },
  ],
}, {
  timestamps: true,
});

const Doctors = mongoose.model('Doctor', doctorSchema);

module.exports = Doctors;
