import 'dotenv/config';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { StatusCodes } from 'http-status-codes';

import { DBConnection } from './DB/connection.js';
import authRouter from './modules/authModule/auth.router.js';
import userRouter from './modules/userModule/user.router.js';
import companyRouter from './modules/companyModule/company.router.js';


export const bootstrap = async (app ,express) => {
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
                new Error(options.message , { cause : StatusCodes.TOO_MANY_REQUESTS })
            );
        }

    }));

    app.use(helmet({
        xPoweredBy:false
    }));


    app.use('/auth' , authRouter);
    app.use('/user' , userRouter);
    app.use('/company' , companyRouter);
}
