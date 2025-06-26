import { model, Schema } from "mongoose";

export const placeSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    location: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        ref: 'PlaceCategory',
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    images:[{
        secure_url: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
    }]

})

export const placeModel = model('Places', placeSchema);

