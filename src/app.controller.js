import 'dotenv/config';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { StatusCodes } from 'http-status-codes';

import { DBConnection } from './DB/connection.js';
import authRouter from './modules/authModule/auth.router.js';
import userRouter from './modules/userModule/user.router.js';
import companyRouter from './modules/companyModule/company.router.js';
import AppError from './utils/errorHandlers/appError.js';
import globalErrorHandler from './utils/errorHandlers/globalErrorHandler.js';
import { asyncErrorHandler } from './utils/errorHandlers/asyncErrorHandler.js';


export const bootstrap = asyncErrorHandler(async (app, express) => {
    app.use(express.json());

    await DBConnection();

    app.use(cors({
        origin:'*'
    }));

    app.use(rateLimit({
        limit : 3,
        message : 'to many requests , please try again later',
        skipSuccessfulRequests : true,
        handler:(req, res, next, options) => {
            return next(
                new AppError(options.message , { cause : StatusCodes.TOO_MANY_REQUESTS })
            );
         }

    }));

    app.use(helmet({
        xPoweredBy:false
    }));


    app.use('/auth' , authRouter);
    app.use('/user' , userRouter);
    app.use('/company' , companyRouter);

    app.all('*', (req, res, next) => 
        next( new AppError(`Can't found ${req.originalUrl} on this server`, StatusCodes.NOT_FOUND) )
    );
    
    app.use(globalErrorHandler);
});
