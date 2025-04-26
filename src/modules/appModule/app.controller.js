import { StatusCodes } from "http-status-codes";
import { offerModel } from "../../DB/models/offers.model.js"
import AppError from "../../utils/errorHandlers/appError.js";
import { companyModel } from "../../DB/models/company.model.js";
import { emailEvent } from "../../utils/sendEmail/sendEmail.js";
import { appTemplate, template } from "../../utils/sendEmail/html.js";
import { appModel } from "../../DB/models/app.model.js";
import { subjects , AppStatus } from "../../utils/globalEnums/enums.js";
import { checkAccess } from "../companyModule/helper/checkAccess.js";


export const sendApp = async(req , res , next)=>{
    const user = req.user
    //find offer
    const offer = await offerModel.findOne({
        _id : req.params.offerId
    });
    //check is exist
    if(!offer)
        return next(new AppError('offer not found' , StatusCodes.NOT_FOUND))
    //check availabilty
    else if(!offer.isAvailable)
        return next(new AppError('offer not available' , StatusCodes.NOT_FOUND))
    //find company
    const company = await companyModel.findOne({
        _id : offer.companyId ,
    })
    //check company is exist
    if(!company)
        return next(new AppError('company not found' , StatusCodes.NOT_FOUND));
    //check is banned
     if(company.bannedAt)
        return next(new AppError('company is banned ' , StatusCodes.NOT_FOUND));

     const app = await appModel.create({
        userId : user._id,
        companyId : company._id,
        offerId:offer._id
     })
     const html=appTemplate(
        `${user.firstName} ${user.lastName}` ,
         user.email ,
          company.companyName ,
          subjects.SEND_APP ,
          offer.description)
     emailEvent.emit('sendApp' ,({to : company.companyEmail , html}))
    
     return res.status(StatusCodes.ACCEPTED).json({app
     })
        

}
export const cancelApp = async(req , res , next)=>{
    const user = req.user;
    const {appId} = req.params
    const app = await appModel.findOne({
        _id : appId
        }).populate([
            {
                path : 'companyId',
                select:'companyEmail companyName bannedAt'

            },
            {
                path : 'offerId',
                select:'description'
            },
            {
                path : 'userId',
                select:'id email firstName'
            }
        ]);
    if(!app)
        return next(new Error('application not found' , {cause : StatusCodes.NOT_FOUND}));
    if(app.status === AppStatus.CANCELED)
        return next(new Error('application is canceled already' , {cause: StatusCodes.BAD_REQUEST}))
    //distract objects
    const [company , targetUser , offer] = [app.companyId , app.userId , app.offerId]


    if(targetUser.id !== user._id.toString())
        return next(new Error('you are not allowed to canceled this app' , {cause : StatusCodes.UNAUTHORIZED}));
    
    //check company is exist
    if(!company)
        return next(new AppError('company not found' , StatusCodes.NOT_FOUND));
    //check is banned
     if(company.bannedAt)
        return next(new AppError('company is banned ' , StatusCodes.NOT_FOUND));
     if(!offer)
        return next(new AppError('offer not found' , StatusCodes.NOT_FOUND));
    const html=appTemplate(
        `${user.firstName} ${user.lastName}` ,
         user.email ,
         company.companyName,
         subjects.CANCEL_APP,
         offer.description )
    emailEvent.emit('cancelApp' ,({to : company.companyEmail , html}))
    app.status = AppStatus.CANCELED;
    await app.save()
     return res.status(StatusCodes.ACCEPTED).json({app})

}

export const acceptApp = async(req , res , next)=>{
    const user = req.user;
    const company = req.company;
    const app = await appModel.findOne({
        _id : req.params.appId
        }).populate([
            {
                path : 'companyId',
                select:'companyEmail companyName bannedAt id'

            },
            {
                path : 'offerId',
                select:'description'
            },
            {
                path : 'userId',
                select:'id email '
            }
        ]);
        if(!app)
            return next(new Error('application not found' , {cause : StatusCodes.NOT_FOUND}));
        if(app.status === AppStatus.CANCELED)
            return next(new Error('application is canceled' , {cause : StatusCodes.NOT_FOUND}));
        if(app.status !== AppStatus.Pending)
            return next(new Error('you send already your acceptance or rejection' , {cause : StatusCodes.NOT_FOUND}));
        if(!checkAccess(user , company) || app.companyId.id !== company._id.toString())
            return next(new Error('you are not allowed to access this app'));
        app.status = AppStatus.ACCEPTED;
        await app.save()

        const offer = await offerModel.findById(offerId._id);
        offer.bookedBy.push(userId._id)
        await offer.save();
        const html = template(subjects.ACCEPT_APP , app.userId.firstName , subjects.ACCEPT_APP)
        emailEvent.emit('acceptApp' ,({to : app.userId.email ,html}))
        return res.status(StatusCodes.ACCEPTED).json({app})
}


export const rejectApp = async(req , res , next)=>{
    const user = req.user;
    const company = req.company;
    const app = await appModel.findOne({
        _id : req.params.appId,
        companyId : company._id
        }).populate([
            {
                path : 'companyId',
                select:'companyEmail companyName bannedAt id'

            },
            {
                path : 'offerId',
                select:'description'
            },
            {
                path : 'userId',
                select:'id email '
            }
        ]);
        if(!app)
            return next(new Error('application not found' , {cause : StatusCodes.NOT_FOUND}));
        if(app.status === AppStatus.CANCELED)
            return next(new Error('application is canceled' , {cause : StatusCodes.NOT_FOUND}));
        if(app.status !== AppStatus.Pending)
            return next(new Error('you send already your acceptance or rejection' , {cause : StatusCodes.NOT_FOUND}));
        if(!checkAccess(user , company))
            return next(new Error('you are not allowed to access this app'));
        app.status = AppStatus.REJECTED;
        
        await app.save()
        const html = template(subjects.REJECT_APP , app.userId.firstName , subjects.REJECT_APP)
        emailEvent.emit('acceptApp' ,({to : app.userId.email ,html}))
        return res.status(StatusCodes.ACCEPTED).json({app})
}


export const getAppByCompany = async(req , res ,next)=>{
    const user = req.user;
    const company = req.company;
    const apps = await appModel.find({
        companyId : company._id
        })
        if(!apps.length)
            return next(new Error('there is no applications' , {cause : StatusCodes.NOT_FOUND}));
        if(!checkAccess(user , company))
            return next(new Error('you are not allowed to access this app'));
        return res.status(StatusCodes.ACCEPTED).json({apps})
}

export const getAppByUser = async(req , res ,next)=>{
    const user = req.user;
    const apps = await appModel.find({
        userId : user._id
        })
        if(!apps.length)
            return next(new Error('there is no applications' , {cause : StatusCodes.NOT_FOUND}));
        return res.status(StatusCodes.ACCEPTED).json({apps})
}


export const getApp = async(req , res , next)=>{
    const user = req.user
    const app = await appModel.findById(req.params.appId)
    if(!app)
        return next(new Error('application not found' , {cause : StatusCodes.NOT_FOUND}));
    if(!req.params.companyId){
        if(app.userId.toString() !== user._id.toString())
            return next(new Error('you are not allowed to access this app'));

        return res.status(StatusCodes.ACCEPTED).json({app})

    }
    const company = req.company;
    if(!checkAccess(user , company) || app.companyId.toString() !== company._id.toString())
        return next(new Error('you are not allowed to access this app'));
    return res.status(StatusCodes.ACCEPTED).json({app})
    
}


