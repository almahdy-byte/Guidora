import { checkAccess } from "../companyModule/helper/checkAccess.js";
import { offerModel } from "../../DB/models/offers.model.js";
import { StatusCodes } from "http-status-codes";


//add offer
export const addOffer = async(req , res , next)=>{
    const company = req.company;
    const user = req.user;
    if(!checkAccess(user , company))
        return next(new Error('you are not authorized to add offer' , {cause : StatusCodes.FORBIDDEN}));
    const {description , price , duration} = req.body;
    const offer = await offerModel.create({companyId :company._id , description , price , duration : new Date(duration) , addedBy:user._id});
    return res.status(201).json({offer});
}

//get offers    
export const getOffers = async(req , res , next)=>{
    const company = req.company;
    const filter={
        companyId :company._id
    }
    const offers = await offerModel.find({companyId :company._id});
    if(!offers.length)
        return next(new Error('no offers found' , {cause : StatusCodes.NOT_FOUND}));
    return res.status(200).json({offers});

}

//get offer by id
export const getOfferById = async(req , res , next)=>{
    const {offerId} = req.params;
    const offer = await offerModel.findOne({_id : offerId , companyId : req.company._id});
    if(!offer)
        return next(new Error('offer not found' , {cause : StatusCodes.NOT_FOUND}));
    return res.status(200).json({offer});
}

//update offer
export const updateOffer = async(req , res , next)=>{
    const company = req.company;
    if(!checkAccess(req.user , company))
        return next(new Error('you are not authorized to update offer' , {cause : StatusCodes.FORBIDDEN}));
    const {offerId} = req.params;
    const offer = await offerModel.findOneAndUpdate({_id : offerId , companyId : company._id} , req.body , {new : true});
    if(!offer)
        return next(new Error('offer not found' , {cause : StatusCodes.NOT_FOUND}));
    return res.status(200).json({offer});   
}

//delete offer
export const deleteOffer = async(req , res , next)=>{
    const company = req.company;
    if(!checkAccess(req.user , company))
        return next(new Error('you are not authorized to delete offer' , {cause : StatusCodes.FORBIDDEN}));
    const {offerId} = req.params;
    const offer = await offerModel.findOneAndDelete({_id : offerId , companyId : company._id});
    if(!offer)
        return next(new Error('offer not found' , {cause : StatusCodes.NOT_FOUND}));

    return res.status(200).json({message : 'offer deleted successfully'});
}

//soft delete offer 
export const softDeleteOffer = async(req , res , next)=>{
    const company = req.company;
    if(!checkAccess(req.user , company))
        return next(new Error('you are not authorized to delete offer' , {cause : StatusCodes.FORBIDDEN}));
    const {offerId} = req.params;
    const offer = await offerModel.findOneAndUpdate({_id : offerId , companyId : company._id} , {isDeleted : true});
    if(!offer)
        return next(new Error('offer not found' , {cause : StatusCodes.NOT_FOUND}));
    return res.status(200).json({message : 'offer deleted successfully'});
}       
