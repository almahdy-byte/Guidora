import { Router } from "express";
import * as adminServices from './admin.controller.js';
import { Roles } from "../../utils/globalEnums/enums.js";
import { auth } from "../../middleWare/auth.middleWare.js";
import { allowTo } from "../../middleWare/allowTo.middleWare.js";
import { validation } from "../../middleWare/validation.middleWare.js";
import { asyncErrorHandler } from "../../utils/errorHandlers/asyncErrorHandler.js";
import { approveCompanyValidation, banOrUnBanCompanyValidation, banOrUnBanUserValidation } from "./admin.validation.js";

const router = Router();

router.use( auth() );
router.use( allowTo(Roles.ADMIN) );

router
    .post('/ban-unban-user/:userId',
        validation(banOrUnBanUserValidation),
        asyncErrorHandler(adminServices.banOrUnBanUser)
    );

router
    .post('/ban-unban-company/:companyId',
        validation(banOrUnBanCompanyValidation),
        asyncErrorHandler(adminServices.banOrUnBanCompany)
    );

router
    .patch('/approve-company/:companyId', 
        validation(approveCompanyValidation),
        asyncErrorHandler(adminServices.approveCompany)
    );

export default router;