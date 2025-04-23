import { StatusCodes } from "http-status-codes";
import { userModel } from "../../DB/models/user.model.js";
import { verify } from "./verify.js";
import { Roles, tokenTypes } from "../globalEnums/enums.js";
import AppError from "../errorHandlers/appError.js";

export const decodeToken = async(authorization , tokenType =tokenTypes.ACCESS  ,next)=>{
        if(!authorization)
            return next(new AppError('please send authorization' ,StatusCodes.BAD_REQUEST));

        const parts = authorization.split(" ");
        if(parts.length !==2)
            return next(new AppError('in-valid authorization' ,StatusCodes.BAD_REQUEST));
        const [barer, token] = parts;
        if (!barer || !token) 
            return next(new AppError('please send token'));
        
        if(!Object.values(Roles).includes(barer))
            return next(new AppError('in-valid barer key' ,StatusCodes.BAD_REQUEST));

        let accessSignature
        let refreshSignature
        switch (barer) {
            case Roles.USER:
                accessSignature = process.env.USER_ACCESS_TOKEN;
                refreshSignature = process.env.USER_REFRESH_TOKEN
                break;
            case Roles.ADMIN:
                accessSignature = process.env.ADMIN_ACCESS_TOKEN;
                refreshSignature = process.env.ADMIN_REFRESH_TOKEN;
                break;
            default:
                break;
        }
        
        let signature = tokenType == tokenTypes.ACCESS ? accessSignature : refreshSignature;
        if (!signature) 
            return next(new AppError('Token signature is missing'));
        
        try {
            
            const decoded = await verify(token , signature)
            const user =await userModel.findOne({
                _id:decoded.id,
                isConfirmed:true,
                changeCredentialTime:decoded.changeCredentialTime,
                isDeleted:false,
                deletedAt:null
            });
            
            if (!user) 
                return next(new AppError('Invalid token'));
            return { user  , accessSignature};
        } catch (error) {
            return next(new AppError('Token verification failed'));
        }
    };

    export const decodeTokenGraphQl = async(authorization , tokenType =tokenTypes.ACCESS )=>{
        
        if(!authorization)
            throw new AppError('please send authorization' ,StatusCodes.BAD_REQUEST);
        
        const parts = authorization.split(" ");
        if(parts.length !==2)
            throw new AppError('in-valid authorization' ,StatusCodes.BAD_REQUEST);
        
        const [barer, token] = parts;
        if (!barer || !token) 
            throw new AppError('please send token');
        
        if(!Object.values(Roles).includes(barer))
            throw new AppError('in-valid barer key' ,StatusCodes.BAD_REQUEST);

        let accessSignature
        let refreshSignature
        switch (barer) {
            case Roles.USER:
                accessSignature = process.env.USER_ACCESS_TOKEN;
                refreshSignature = process.env.USER_REFRESH_TOKEN
                break;
            case Roles.ADMIN:
                accessSignature = process.env.ADMIN_ACCESS_TOKEN;
                refreshSignature = process.env.ADMIN_REFRESH_TOKEN;
                break;
            default:
                break;
        }

        let signature = tokenType == tokenTypes.ACCESS ? accessSignature : refreshSignature;
        if (!signature) 
            throw new AppError('Token signature is missing');
        
        try {
            const decoded = await verify(token , signature);            
            const user =await userModel.findOne({
                _id:decoded.id,
                isConfirmed:true,
                changeCredentialTime:decoded.changeCredentialTime,
                isDeleted:false,
                deletedAt:null
            });
            if (!user) 
                throw new AppError('Invalid token');

            return { user, accessSignature };
            
        } catch (error) {
            throw new AppError('Token verification failed');
        }
    };