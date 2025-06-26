import 'dotenv/config';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { StatusCodes } from 'http-status-codes';

import { DBConnection } from './DB/connection.js';
import authRouter from './modules/authModule/auth.router.js';
import userRouter from './modules/userModule/user.router.js';
import companyRouter from './modules/companyModule/company.router.js';
import appRouter from "./modules/appModule/app.router.js"
import offerRouter from './modules/offerModule/offer.router.js'
import { asyncErrorHandler } from './utils/errorHandlers/asyncErrorHandler.js';
import {globalErrorHandler} from './utils/errorHandlers/globalErrorHandler.js';
import { PlaceCategory } from './utils/globalEnums/enums.js';
import { placeCategoryModel } from './DB/models/place.category.model.js';
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
    app.use('/offer' , offerRouter)
    app.use('/app' , appRouter);
    app.use(globalErrorHandler)

    Object.values(PlaceCategory).forEach(async (category) => {
        category = category.toLowerCase();
        const existingCategory = await placeCategoryModel.findOne({ name: category });
        if (!existingCategory) {
            await placeCategoryModel.create({ name: category });
        }
    });
}
)