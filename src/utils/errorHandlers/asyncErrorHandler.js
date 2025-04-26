import { StatusCodes } from "http-status-codes"
import AppError from "./appError.js"

export const asyncErrorHandler = (fn)=>{
    return((req , res , next)=>{
        try {
            fn(req , res ,next)
        } catch (error) {
            return next(new AppError (error + " " || "something went wrong" , {cause:StatusCodes.INTERNAL_SERVER_ERROR}))
        }
    })}


