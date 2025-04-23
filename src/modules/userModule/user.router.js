import { Router } from "express";
import { auth } from "../../middleWare/auth.middleWare.js";
import { validation } from "../../middleWare/validation.middleWare.js";
import { getAndDeleteUserValidationSchema, updatePasswordValidationSchema, updateUserValidationSchema } from "./user.validation.js";
import { asyncErrorHandler } from "../../utils/errorHandlers/asyncErrorHandler.js";
import * as userServices from './user.controller.js';
import { uploadFile } from "../../utils/multer/uploadFile.js";
import { FileType } from "../../utils/globalEnums/enums.js";

const router = Router();

router.use( auth() );

router.route('/')
    .get(
        asyncErrorHandler(userServices.getProfile)
    )
    .patch(
        validation(updateUserValidationSchema) , 
        asyncErrorHandler(userServices.updateUser)
    )
    
router
    .patch('/update-password' ,
        validation(updatePasswordValidationSchema) , 
        asyncErrorHandler(userServices.upDatePassword)
    );

router.route('profilePic')
    .post(
        uploadFile(FileType.IMAGE).single("image"),
        asyncErrorHandler(userServices.uploadProfilePic)
    )
    .delete(
        asyncErrorHandler(userServices.deleteProfilePic)
    );

router.route('coverPic')
    .post(
        uploadFile(FileType.IMAGE).single("image"),
        asyncErrorHandler(userServices.uploadCovePic)
    )
    .delete(
        asyncErrorHandler(userServices.deleteCoverPic)
    );

router.route('/:userId')
    .get(
        validation(getAndDeleteUserValidationSchema),
        asyncErrorHandler(userServices.getUser)
    )
    .delete(
        validation(getAndDeleteUserValidationSchema),
        asyncErrorHandler(userServices.softDelete)
    );

export default router;
