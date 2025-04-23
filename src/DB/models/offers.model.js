
import { Schema , model , Types } from "mongoose";

const offerSchema = new Schema({
    companyId:{
        type:Types.ObjectId,
        ref:'Company'
    } ,
    description:{
        type:String,
        required:[true , 'offer description is required']
    },
    addedAt:{
        type:Date,
        default:Date.now
    }, 
    price:{
        type:String,
        required:[true , 'offer price is required']
    },
    duration:{
        type:Date,
        required:[true , 'offer duration is required'],
    },
    addedBy:{
        type:Types.ObjectId,
        ref:'User'
    },
    isAvailable:{
        type:Boolean,
        default:true
    },
    bookedBy:[{
        type:Types.ObjectId,
        ref:'User'
    }] , 
    isDeleted:{
        type:Boolean,
        default:false
    }
} , {timestamps:true})

export const offerModel = model('Offers' , offerSchema);
