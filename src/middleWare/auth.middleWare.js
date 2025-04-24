import { StatusCodes } from "http-status-codes";
import { asyncErrorHandler } from "../utils/errorHandlers/asyncErrorHandler.js"
import { decodeToken } from "../utils/token/decodeToken.js";
import { tokenTypes } from "../utils/globalEnums/enums.js";
import AppError from "../utils/errorHandlers/appError.js";

export const auth = () => {
    return asyncErrorHandler(async (req , res , next) => {
        const authorization = req.headers['authorization'];
        const decodedData = await decodeToken(authorization, tokenTypes.ACCESS, next);

        if (!decodedData || !decodedData.user)
            return next( new AppError("Invalid refresh token", StatusCodes.UNAUTHORIZED) );

        const { user } = decodedData;

        if (!user) return new AppError('user not found', StatusCodes.NOT_FOUND);
        
        req.user = user;
        
        next()
    });
}