import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import { Gender,  Roles,  } from "../utils/globalEnums/enums.js";
import { asyncErrorHandler } from "../utils/errorHandlers/asyncErrorHandler.js";
import { Types } from "mongoose";
import AppError from "../utils/errorHandlers/appError.js";

export const validation = schema => {
    return (req, res, next) => {
        const data = {
            ...req.body,
            ...req.query,    
            ...req.params
        }
        
        const result = schema.validate(data);
        const errors = [];

        if (result.error){
            errors.push(result.error.details[0].message);
            return next( new AppError(errors, StatusCodes.BAD_REQUEST) );
        }

        next();
    }
};






const idValidation = id => {
    return Types.ObjectId.isValid(id) ? true : helper.message = "Invalid ID";
}

export const generalValidation = {
    firstName : Joi.string(),
    lastName : Joi.string(),
    email:Joi.string().email(),
    password:Joi.string().min(6),
    phone:Joi.string(),
    role : Joi.string().valid(...Object.values(Roles)),
    DOB:Joi.date(),
    gender:Joi.string().valid(...Object.values(Gender)),
    code : Joi.string().length(6),
    id:Joi.custom(idValidation),
    companyName : Joi.string(),
    companyEmail:Joi.string().email(),
    description:Joi.string(),
    numberOfEmployees : Joi.number().min(11).max(20),
    address:Joi.string(),
    jobTitle:Joi.string(),
    jobDescription : Joi.string(),
    seniorityLevel:Joi.string(),
    technicalSkills : Joi.array(),
    softSkills : Joi.array(),
    HRs : Joi.array(),
    token : Joi.string(),
    page : Joi.number().min(1),
    size : Joi.number().min(1)
}