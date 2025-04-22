import { auth } from "../../middleWare/auth.middleWare.js";
import { validation } from "../../middleWare/validation.middleWare.js";
import { asyncErrorHandler } from "../../utils/errorHandlers/asyncErrorHandler.js";
import { FileType } from "../../utils/globalEnums/enums.js";
import { uploadFile } from "../../utils/multer/uploadFile.js";
import * as companyServices from './company.controller.js'
import { companyIdValidationSchema, createCompanyValidationSchema, downloadExcelSheetValidationSchema, getCompanyAndRElatedJobsValidationSchema, getCompanyWithNameValidationSchema, updateCompanyValidationSchema } from "./company.validation.js";
import { Router } from "express";
const router = Router({mergeParams : true});

//create company    
router.post('/',
    auth(),
    validation(createCompanyValidationSchema),
    asyncErrorHandler(companyServices.addCompany)
)
//update company
router.patch('/:companyId' , 
    auth(),
    validation(updateCompanyValidationSchema),
    asyncErrorHandler(companyServices.updateCompany)
)
//get company with name
router.get('/:companyName' ,
    auth(),
    validation(getCompanyWithNameValidationSchema),
    asyncErrorHandler(companyServices.getCompanyWithName)
)

//upload logo
router.post('/upload-logo/:companyId' , 
    auth(),
    uploadFile(FileType.IMAGE).single('image'),
    validation(companyIdValidationSchema),
    asyncErrorHandler(companyServices.uploadLogo)
)
//upload cover pic
router.post('/upload-coverPic/:companyId' , 
    auth(),
    uploadFile(FileType.IMAGE).single('image'),
    validation(companyIdValidationSchema),
    asyncErrorHandler(companyServices.uploadCovePic)
)
//delete logo
router.delete('/delete-logo/:companyId',
    auth(),
    validation(companyIdValidationSchema),
    asyncErrorHandler(companyServices.deleteLogo)
)
//delete cover pic
router.delete('/delete-coverPic/:companyId',
    auth(),
    validation(companyIdValidationSchema),
    asyncErrorHandler(companyServices.deleteCoverPic)
)
//soft delete company
router.delete('/:companyId' , 
    auth(),
    validation(companyIdValidationSchema),
    asyncErrorHandler(companyServices.softDeleteCompany)
)
export default router;


