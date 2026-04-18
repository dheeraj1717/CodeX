const BaseError = require("./BaseError");
const { StatusCodes } = require("http-status-codes");

class NotFoundError extends BaseError {
    constructor(resourceName, resourceValue){
        super("Not found",StatusCodes.NOT_FOUND,`${resourceName} with value ${resourceValue} not found`,{
            resourceName,
            resourceValue
        })
    }
}

module.exports = NotFoundError;

    