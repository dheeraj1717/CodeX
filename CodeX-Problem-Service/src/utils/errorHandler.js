const logger = require("../config/logger.config");
const BaseError = require("../errors/BaseError");

function errorHandler(error,req,res,next){
    if(error instanceof BaseError){
        return res.status(error.statusCode).json({
            success:false,
            message:error.message,
            error:error.name,
            details:error.details
        })
    }

    logger.error(`Internal Server Error: ${error.message}`);
    
    return res.status(500).json({
        success:false,
        message:"Something went wrong !!",
        error:"InternalServerError",
        details:{}
    })
}

module.exports = errorHandler