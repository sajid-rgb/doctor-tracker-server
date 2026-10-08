const Doctors = require("../doctors/doctors.model");
const Patient = require("../patient/patient.model");


const getDashboardStats = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalDoctors,
    totalPatients,
    patientsPerDoctor,
    dateBasedStats,
    specializationDistribution,
  ] = await Promise.all([
    Doctors.countDocuments(),
    Patient.countDocuments(),
    Patient.aggregate([
      { $group: { _id: "$doctorId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 100 },
      { $lookup: { from: 'doctors', localField: '_id', foreignField: '_id', as: 'doctor' } },
      { $unwind: { path: '$doctor', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          doctorId: '$_id',
          doctorName: '$doctor.name',
          count: 1,
          _id: 0,
        },
      },
    ]),
    Patient.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo, $ne: null } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $project: { date: "$_id", count: 1, _id: 0 } },
    ]),
    Doctors.aggregate([
      { $group: { _id: "$specialization", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { specialization: "$_id", count: 1, _id: 0 } },
    ]),
  ]);

  const averagePatientPerDoctor = totalDoctors > 0
    ? Number((totalPatients / totalDoctors).toFixed(1))
    : 0;

  return {
    summary: { totalDoctors, totalPatients, averagePatientPerDoctor },
    patientsPerDoctor,
    dateBasedStats,
    specializationDistribution,
  };
};


module.exports = {
    getDashboardStats,
}