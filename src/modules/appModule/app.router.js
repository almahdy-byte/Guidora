import { Router } from "express";
import { asyncErrorHandler } from "../../utils/errorHandlers/asyncErrorHandler.js";
import * as appServices from './app.controller.js'
import { auth } from "../../middleWare/auth.middleWare.js";
import { getCompanyById } from "../../middleWare/getCompany.middleWare.js";
const router = Router({mergeParams : true});


router.use(auth())


//user end points
//  send or cancel app
//get app
router.post('/:offerId' ,asyncErrorHandler(appServices.sendApp))
router.patch('/:appId',asyncErrorHandler(appServices.cancelApp))
router.get('/user-apps',
    asyncErrorHandler(appServices.getAppByUser)
)
router.get('/user-app/:appId' ,
    asyncErrorHandler(appServices.getApp)
)

//company endpoints
//accept or reject app and getApps
router.patch('/accept-app/:appId' , 
    getCompanyById,
    asyncErrorHandler(appServices.acceptApp)
)
router.patch('/reject-app/:appId' , 
    getCompanyById,
    asyncErrorHandler(appServices.rejectApp)
)
router.get('/all-apps',
    getCompanyById,
    asyncErrorHandler(appServices.getAppByCompany)
)
router.get('/:appId' ,
    getCompanyById,
    asyncErrorHandler(appServices.getApp)
)

export default router
