import mongoose from "mongoose";

export const Status = {
    BOOKED: "booked",
    IDLE: "idle",
};

type StatusValues = typeof Status[keyof typeof Status];

interface QuantityAttrs {
    title: string
    status?: StatusValues
    bookedBy?:string
}

interface QuantityDoc extends mongoose.Document {
    title: string,
    status?: StatusValues
     bookedBy?:string
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
    }
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
        bookedBy: attrs?.bookedBy
    })
}

const Quantity = mongoose.model<QuantityAttrs, OrderModel>('Quantity', quantitySchema)

export {Quantity}