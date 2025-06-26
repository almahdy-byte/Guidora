import { StatusCodes } from "http-status-codes";
import { userModel } from "../../DB/models/user.model.js";
import { compare } from "../../utils/hash/compare.js";
import { hash } from "../../utils/hash/hash.js";
import cloudinary from "../../utils/multer/cloudinary.js";
import { Roles } from "../../utils/globalEnums/enums.js";
import AppError from "../../utils/errorHandlers/appError.js";

// update user
export const updateUser = async (req, res, next) => {
    const user = req.user;
    const allowedFields = ['firstName', 'lastName', 'phone', 'DOB', 'gender'];

    // Check if at least one allowed field is present in req.body
    const hasValidField = allowedFields.some(field => req.body[field] !== undefined);
    if (!hasValidField) {
        return next(new AppError('No data to update', StatusCodes.BAD_REQUEST));
    }

    // Update only the fields that are present in req.body
    allowedFields.forEach(field => {
        if (req.body[field] !== undefined)
            user[field] = req.body[field];
    });

    // Update the 'updatedBy' field
    user.updatedBy = user._id;

    // Save the updated user
    await user.save();

    return res.status(StatusCodes.ACCEPTED).json({ success: true, user });
};
  

// get profile
export const getProfile = async(req , res , next)=>{
    const user = req.user;
    return res.status(StatusCodes.OK).json({success:true , user});
}

// get user
export const getUser = async(req , res ,next)=>{
    const { userId } = req.params;

    // check if the userId is not found
    if(!userId)
        return next(new AppError('userId not found' , StatusCodes.NOT_FOUND));

    let user;

    // check if the user is the same user
    if(userId.toString() === req.user._id.toString()){
        user = req.user;
    }else {
        user = await userModel.findOne({
            _id : userId , isConfirmed:true , deletedAt:null , isDeleted : false
        });
    }

    // check if the user is not found
    if(!user) return next(new AppError('user not found' , StatusCodes.NOT_FOUND));

    // get user data
    const {userName , profilePic , coverPic , phone} = user;

    // get user

    return res.status(StatusCodes.OK).json({
        success: true,
        user: {
            userName , profilePic , coverPic , phone
        }
    });
}

// update password
export const upDatePassword = async(req , res ,next)=>{
    const user = req.user;

    const { oldPassword , newPassword } = req.body;

    // check if the old password is incorrect
    if(!compare(oldPassword , user.password)) return next(new AppError('in-correct old password' , StatusCodes.BAD_REQUEST));

    // update user password
    user.password = hash(newPassword);

    // update user changeCredentialTime
    user.changeCredentialTime = Date.now();
    await user.save();

    return res.status(StatusCodes.ACCEPTED).json({success : true , user});
}

// upload profile picture
export const uploadProfilePic = async(req , res ,next) => {
    const user = req.user;
    const file = req.file;

    // check if the file is not found
    if (!file) {
        return next(new AppError('image is required', StatusCodes.BAD_REQUEST));
    }

    // upload profile picture to cloudinary
    const { secure_url , public_id } = await cloudinary.uploader.upload(file.path , {
        folder : `users/user/${user._id}/profilePic`
    });

    // update user profile picture
    user.profilePic = { secure_url , public_id };
    await user.save();

    return res.status(StatusCodes.ACCEPTED).json({success:true , user})
}

// upload cover picture
export const uploadCovePic = async(req , res ,next)=>{
    const user = req.user;
    const file = req.file;

    // check if the file is not found
    if (!file) {
        return next(new AppError('image is required', StatusCodes.BAD_REQUEST));
    }

    // upload cover picture to cloudinary   
    const { secure_url , public_id } = await cloudinary.uploader.upload(file.path , {
        folder : `users/user/${user._id}/coverPic`
    });

    // update user cover picture
    user.coverPic = { secure_url , public_id };
    await user.save();

    return res.status(StatusCodes.ACCEPTED).json({success:true , user})
}

// delete profile picture
export const deleteProfilePic = async(req , res ,next)=>{
    const user = req.user;

    // check if the profile picture is not found
    if(!Object.values(user.profilePic).length)
         return next(new AppError('profile picture not found' ,StatusCodes.NOT_FOUND));
    
    // delete profile picture from cloudinary
    await cloudinary.uploader.destroy(user.profilePic.public_id);

    // update user profile picture
    user.profilePic = {
            secure_url : undefined ,
            public_id : undefined
    };
    await user.save();

    return res.status(StatusCodes.ACCEPTED).json({success:true , user})
}

// delete cover picture
export const deleteCoverPic = async(req , res ,next)=>{
    const user = req.user;

    // check if the cover picture is not found
    if(!Object.values(user.coverPic).length) 
        return next(new AppError('profile picture not found' ,StatusCodes.NOT_FOUND));

    // delete cover picture from cloudinary
    await cloudinary.uploader.destroy(user.coverPic.public_id);

    // update user cover picture
    user.coverPic = {
            secure_url : undefined ,
            public_id : undefined
    };
    await user.save();

    return res.status(StatusCodes.ACCEPTED).json({success:true , user})
}

// soft delete user
export const softDelete = async(req , res , next)=>{
    const user = req.user;
    const { userId } = req.params;

    // check if the user is not allowed to delete the target user
    if(userId.toString() !== user._id.toString() && user.role !== Roles.ADMIN)
        return next(new AppError('you are not allowed to delete this user'));

    const targetUser = await userModel.findOne({
        _id : userId,
        isDeleted : false,
        deletedAt : null ,
    });

    // check if the target user is not found
    if(!targetUser) 
        return next(new AppError('user not found' , StatusCodes.NOT_FOUND));

    // update target user Info
    targetUser.isDeleted = true;
    targetUser.deletedBy = user._id;
    targetUser.deletedAt = Date.now();
    
    await targetUser.save();

    return res.status(StatusCodes.ACCEPTED).json({ 
        success: true, 
        user: targetUser 
    });
}