import mongoose from "mongoose";

export const Status = {
    BOOKED: "booked",
    IDLE: "idle",
};

type StatusValues = typeof Status[keyof typeof Status];

export interface UserRating {
    email: string,
    rating: number
}


interface QuantityAttrs {
    title: string
    status?: StatusValues
    bookedBy?: string,
    rating?: UserRating
}

interface QuantityDoc extends mongoose.Document {
    title: string,
    status?: StatusValues
    bookedBy?: string
    rating?: UserRating[]
}

interface OrderModel extends mongoose.Model<QuantityDoc> {
    build(attrs: QuantityAttrs): QuantityDoc
}

const quantitySchema = new mongoose.Schema({
   
     title:{
        type: String,
        required: true
    },
    status:{
       type: String, 
        enum: Object.values(Status), 
        required: false,
    },
     bookedBy:{
       type: String, 
        required: false,
    },
        rating: [
    {
        email: { type: String, required: false },
            rating: { type: Number, min: 1, max: 5, required: false },
        
    }],
}, {
    toJSON:{
        transform(doc, ret){
            ret.id = ret._id
            delete ret._id

        }
    }
})


quantitySchema.statics.build = (attrs: QuantityAttrs)=>{
    return new Quantity({
        title: attrs.title,
        status: Status.IDLE,
        bookedBy: attrs?.bookedBy,
        rating: attrs?.rating
    })
}

const Quantity = mongoose.model<QuantityAttrs, OrderModel>('Quantity', quantitySchema)

export {Quantity}