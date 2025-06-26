import { model, Schema } from "mongoose";
import { PlaceCategory } from "../../utils/globalEnums/enums.js";


export const placeCategorySchema = new Schema({
    name: {
        type: String,
        enum : Object.values(PlaceCategory),
        required: true,
        unique: true,
    },
    
},{timestamps:true});


export const placeCategoryModel = model("PlaceCategory", placeCategorySchema);

