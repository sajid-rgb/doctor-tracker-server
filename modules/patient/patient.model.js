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
            required: false,
        },
        patientCondition:{
            type: String,
            required: false,
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


patientSchema.index({ doctorId: 1, createdAt: -1 });
patientSchema.index({ createdAt: -1 });
patientSchema.index({ gender: 1 });
patientSchema.index({ blood_group: 1 });

const Patient = mongoose.model('Patient', patientSchema);

module.exports = Patient


