const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
    
    age: {
            type: Number,
            required: true,
        },
        gender: {
            type: String,
            required: true,
           enum: ['Male', 'Female', 'Other'],
        },
        blood_group: {
            type: String,
            required: true,
        },
        doctorId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Doctor',
            required: true,
        }      
    },
    {
        timestamps: true,
    }
);

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient


