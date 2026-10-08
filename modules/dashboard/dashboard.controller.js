const errorHandler = require('../../middlewares/error');
const dashboardService = require('./dashboard.service');

const getDashboardStats =async ( req,res ) =>{
        try {
                const result = await dashboardService.getDashboardStats(req,res);
                res.status(200).json({
                    success: true,
                    data: result,
                });
        } catch (error) {
                errorHandler(error,req,res)
        }   
}

module.exports = {
    getDashboardStats
}