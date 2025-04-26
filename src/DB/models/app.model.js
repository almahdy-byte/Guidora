import { model, Schema, Types } from "mongoose";
import { AppStatus } from "../../utils/globalEnums/enums.js";

const appSchema = new Schema({
    userId :{
        type:Types.ObjectId,
        ref:'Users'
    },
    offerId:{
        type:Types.ObjectId,
        ref:"Offers"
    },
    companyId:{
        type:Types.ObjectId,
        ref : 'Company'
    },
    status:{
        type:String ,
        enum:Object.values(AppStatus),
        default:AppStatus.Pending
    },
    sendAt:{
        type:Date,
        default:Date.now()
    }
})

export const appModel = model('Apps' ,appSchema )