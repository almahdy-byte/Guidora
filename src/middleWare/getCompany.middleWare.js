import { StatusCodes } from "http-status-codes";
import { companyModel } from "../DB/models/company.model.js";
import { asyncErrorHandler } from "../utils/errorHandlers/asyncErrorHandler.js"
import AppError from "../utils/errorHandlers/appError.js";

export const getCompanyById = asyncErrorHandler(async (req , res , next) => {
    const company = await companyModel.findOne({
        _id: req.params.companyId, 
        deletedAt: null, 
        bannedAt: null
    });

    if(!company) return next( new AppError('company not found', StatusCodes.NOT_FOUND) );

    req.company = company;

    next()
});


