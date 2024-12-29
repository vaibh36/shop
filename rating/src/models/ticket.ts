import mongoose from "mongoose";



export interface UserRating {
    email: string,
    rating: number
}


interface QuantityAttrs {
    ticketId: string,
    rating?:UserRating
}

interface QuantityDoc extends mongoose.Document {
    ticketId: string,
    rating?: UserRating[]
}

interface OrderModel extends mongoose.Model<QuantityDoc> {
    build(attrs: QuantityAttrs): QuantityDoc
}

const quantitySchema = new mongoose.Schema({
   
     ticketId:{
        type: String,
        required: true
    },
    rating: [
    {
        email: { type: String, required: false },
            rating: { type: Number, min: 1, max: 5, required: false },
        
    },
],
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
        ticketId: attrs.ticketId,
        rating: attrs.rating
    })
}

const Quantity = mongoose.model<QuantityAttrs, OrderModel>('Quantity', quantitySchema)

export {Quantity}