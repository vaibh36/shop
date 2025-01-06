import express, {NextFunction, Request, Response}  from "express";
import { Order } from "../models/orders";

import { NotFoundError } from "../errors/not-found-error";
import jwt from 'jsonwebtoken'
import { NotAuthorizedError } from "../errors/not-authorized-error";
import {OrderCancelledPublisher} from '../events/publishers/order-cancelled-publisher'
import { natsWrapper } from "../nats-wrapper";
import { OrderStatus } from "../models/orders";


const router = express.Router()
router.delete('/api/orders/:orderId', async(req:Request, res: Response, next: NextFunction)=>{

    const {orderId} = req.params
    const order = await Order.findById(orderId).populate('ticket')
    console.log('info in delete order is1:-', orderId, order)
    

    if(!order){
        throw new NotFoundError()
    }

   
   
    if(order?.userId !== req?.body?.email) {
        const err = new NotAuthorizedError()
        next(err)
        return
    }

    console.log('I have reached here now')

    order.status = "cancelled"
    await order.save()
     new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
     version: order.version,
    ticket:{
        id: order.ticket.id
    }
   })

   
    res.status(204).send(order)

})

export {router as deleteOrderRouter}