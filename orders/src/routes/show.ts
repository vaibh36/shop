import express, {Request, Response}  from "express";
import { Order } from "../models/orders";
import {  NotFoundError } from "@vaibhtickets/common";


const router = express.Router()
router.get('/api/orders/:orderId', async(req:Request, res: Response)=>{

   
   const orderId = req?.params?.orderId
    const order = await Order.findById(orderId).populate('ticket')

    if(!order){
        throw new NotFoundError()
    }

    res.send(order)

})

export {router as showOrderRouter}