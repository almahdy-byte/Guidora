import multer from "multer";
import { StatusCodes } from "http-status-codes";
import AppError from "../errorHandlers/appError.js";


export const uploadFile = (type ) => {    
    const storage = multer.diskStorage({});

    const fileFilter = (req , file , cb) => {
        if(type.includes(file.mimetype)) return cb(null , true)
            
        return cb(new AppError('invalid type' ,StatusCodes.BAD_REQUEST) , false);
    }

    const upload = multer({ storage , fileFilter });    

    return upload;
};
