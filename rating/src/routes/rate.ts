import express, {Request, Response, NextFunction}  from "express";
import { body } from "express-validator";
import { Quantity, UserRating } from "../models/ticket";
import { NotFoundError } from "@vaibhtickets/common";
import { ItemRatedPublisher } from "../events/publishers/item-rated-publisher";
import { natsWrapper } from "../../nats-wrapper";

const router = express.Router()
router.post('/api/rating', [
 body('ticketId')
    .isString().withMessage('ticketId must be a string')
    .notEmpty().withMessage('ticketId is required'),
  body('rating')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
    body('email')
    .not()
    .isEmpty()
    .withMessage('email must be provided')
], async (req: Request, res: Response, next: NextFunction) => {    
  const { ticketId, rating, email } = req.body
  console.log('I am inside service to rate ticket')


   let ticket = await Quantity.findOne({ ticketId });

   if(!ticket){
    console.log('ticket is not found2:-', ticket)
    throw new NotFoundError()
  }

    if (!ticket.rating) {
            ticket.rating = [];
        }


     const existingRatingIndex = ticket?.rating?.findIndex(
            (r: UserRating) => r.email === email
        );
  

   if (existingRatingIndex !== -1) {
            // Update the existing rating
            ticket.rating[existingRatingIndex].rating = rating;
        } else {
            // Add a new rating
            ticket?.rating?.push({ email, rating });
        }

    await ticket.save();

     
   
  console.log('item is saved with new status2:-', ticket)
   new ItemRatedPublisher(natsWrapper.client).publish({
     id: ticket.ticketId,
     rating: rating,
     email: email
   })
      
  res.status(201).send({
           message: "Item has been rated successfully3"
         })
  
    

}

)

export {router as rateTicketRouter}