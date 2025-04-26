import { StatusCodes } from "http-status-codes";
import { userModel } from "../../DB/models/user.model.js";
import { companyModel } from "../../DB/models/company.model.js";
import AppError from "../../utils/errorHandlers/appError.js";

// ban or unban user        
export const banOrUnBanUser = async (req, res, next) => {
    // check if the target user is not found
    const targetUser = await userModel.findOne({
        _id: req.params.userId,
        isDeleted: false, 
        deletedAt : null, 
    });

    // check if the target user is not found
    if (!targetUser) return next(new AppError('user not found' , StatusCodes.NOT_FOUND));

    // check if the target user is banned
    if (!targetUser.bannedAt){
        // update target user
        targetUser.bannedBy = req.user._id;
        targetUser.bannedAt = Date.now();
    } else {
        targetUser.bannedBy = null;
        targetUser.bannedAt = null;
    }

    await targetUser.save();

    return res.status(StatusCodes.ACCEPTED).json({
        success: true,
        user: targetUser
    });
}

// ban or unban company
export const banOrUnBanCompany = async (req, res, next) => {
    // check if the target company is not found
    const targetCompany = await companyModel.findOne({
        _id: req.params.companyId, 
        deletedAt: null
    });
    
    if(!targetCompany) 
        return next( new AppError('company not found' , StatusCodes.NOT_FOUND) );

    // update target company bannedAt
    targetCompany.bannedAt = targetCompany.bannedAt ? null : Date.now();

    await targetCompany.save();

    return res.status(StatusCodes.ACCEPTED).json({
        success : true, 
        company : targetCompany
    });
}

export const approveCompany = async (req, res, next) => {
    // check if the target company is not found 
    const company = await companyModel.findOne({
        _id: req.params.companyId, 
        deletedAt: null, 
        bannedAt: null
    });

    // check if the target company is not found
    if(!company)
        return next( new AppError('company not found' , StatusCodes.NOT_FOUND) );

    // check if the target company is already approved
    if(company.approvedByAdmin) 
        return next( new AppError('company already approved' , StatusCodes.BAD_REQUEST) );

    // update target company approvedByAdmin to true
    company.approvedByAdmin = true;
    await company.save();

    return res.status(StatusCodes.ACCEPTED).json({
        success: true,
        company
    });
}