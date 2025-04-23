import { auth } from "../../middleWare/auth.middleWare.js";
import { validation } from "../../middleWare/validation.middleWare.js";
import { asyncErrorHandler } from "../../utils/errorHandlers/asyncErrorHandler.js";
import { FileType } from "../../utils/globalEnums/enums.js";
import { uploadFile } from "../../utils/multer/uploadFile.js";
import * as companyServices from './company.controller.js'
import { companyIdValidationSchema, createCompanyValidationSchema, downloadExcelSheetValidationSchema, getCompanyAndRElatedJobsValidationSchema, getCompanyWithNameValidationSchema, updateCompanyValidationSchema } from "./company.validation.js";
import { Router } from "express";
import offerRouter from "../offerModule/offer.router.js"
const router = Router({mergeParams : true});

router.use(auth());
//create company    
router.post('/',
    validation(createCompanyValidationSchema),
    asyncErrorHandler(companyServices.addCompany)
)
//update company
router.patch('/:companyId' , 
    validation(updateCompanyValidationSchema),
    asyncErrorHandler(companyServices.updateCompany)
)
//get company with name
router.get('/:companyName' ,

    validation(getCompanyWithNameValidationSchema),
    asyncErrorHandler(companyServices.getCompanyWithName)
)

//upload logo
router.post('/upload-logo/:companyId' , 
    uploadFile(FileType.IMAGE).single('image'),
    validation(companyIdValidationSchema),
    asyncErrorHandler(companyServices.uploadLogo)
)
//upload cover pic
router.post('/upload-coverPic/:companyId' , 

    uploadFile(FileType.IMAGE).single('image'),
    validation(companyIdValidationSchema),
    asyncErrorHandler(companyServices.uploadCovePic)
)
//delete logo
router.delete('/delete-logo/:companyId',

    validation(companyIdValidationSchema),
    asyncErrorHandler(companyServices.deleteLogo)
)
//delete cover pic
router.delete('/delete-coverPic/:companyId',

    validation(companyIdValidationSchema),
    asyncErrorHandler(companyServices.deleteCoverPic)
)
//soft delete company
router.delete('/:companyId' , 

    validation(companyIdValidationSchema),
    asyncErrorHandler(companyServices.softDeleteCompany)
)


router.use('/:companyId/company-offers' , offerRouter);
export default router;


