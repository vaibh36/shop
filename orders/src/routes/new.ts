import express, {Request, Response}  from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../models/ticket";
import { Order, OrderStatus } from "../models/orders";
import { BadRequestError, NotFoundError } from "@vaibhtickets/common";
import jwt from 'jsonwebtoken'
import {OrderCreatedPublisher} from '../events/publishers/order-created-publisher'
import { natsWrapper } from "../nats-wrapper";

const router = express.Router()

const EXPIRATION_WINDOW_SECONDS = 15*60

router.post('/api/orders',[

    body('ticketId')
    .not()
    .isEmpty()
        .withMessage('Ticket id must be provided'),
     body('email')
    .not()
    .isEmpty()
    .withMessage('email must be provided')



], async(req:Request, res: Response)=>{
    const {ticketId, email} = req.body
   
 console.log('I am here and the data is2:-', ticketId)
   const ticket = await Ticket.findById(ticketId)

   if(!ticket){
    console.log('ticket is not found2:-', ticket)
    throw new NotFoundError()
   }

   const isReserved = await ticket.isReserved()

   if(isReserved){
    throw new BadRequestError('Ticket is already reserved1')
   }

//    const expiration = new Date()
//    expiration.setSeconds(expiration.getSeconds() + 15*60 + EXPIRATION_WINDOW_SECONDS)

    const order = Order.build({
       userId:email,
    status: 'created',
    // expiresAt: expiration,
    ticket
   })

   await order.save()
   console.log('Seems order has been build')
   new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    status: order.status,
    userId: order.userId,
    ticket:{
        id: ticket.id,
    }
   })
    

    res.status(201).send(order)

})

export {router as newOrderRouter}