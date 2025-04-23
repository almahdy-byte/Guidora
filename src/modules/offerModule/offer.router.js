import { Router } from "express";
import { auth } from "../../../middleWare/auth.middleWare.js";
import { getCompanyById } from "../../../middleWare/getCompany.middleWare.js";
import { asyncErrorHandler } from "../../../utils/errorHandlers/asyncErrorHandler.js";
import * as offerServices from '../company.offer.controller.js';

const router = Router({mergeParams : true});

router.use(auth());

router.route('/')
    .get(
        asyncErrorHandler(offerServices.getOffers)
    )
    .post(
        getCompanyById,
        asyncErrorHandler(offerServices.addOffer)
)


router.route('/:offerId')
    .get(
        asyncErrorHandler(offerServices.getOfferById)
    )
    .put(
        asyncErrorHandler(offerServices.updateOffer)
    )
    .delete(
        asyncErrorHandler(offerServices.deleteOffer)
    )
    .patch(
        asyncErrorHandler(offerServices.softDeleteOffer)
    )   

export default router;
