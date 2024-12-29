import express, {Request, Response, NextFunction}  from "express";
import { body } from "express-validator";
import { Quantity, Status } from "./model/ticket";
import { ItemCreatedPublisher } from "./events/publishers/item-created-publisher";
import { natsWrapper } from "./nats-wrapper";
import { validateRequest } from "./middleware/validate-request";

const router = express.Router()
router.post('/api/tickets', [
 body('title')
    .isString().withMessage('Title must be a string')
    .notEmpty().withMessage('Title is required')
    .isLength({ min: 3, max: 50 }).withMessage('Title must be between 3 and 50 characters long'),
],validateRequest, async (req: Request, res: Response, next: NextFunction) => {    
  const { title } = req.body
  console.log('I am inside service to create ticket2')
  
  
      const item = Quantity.build({
         title: title,
        status: Status.IDLE
        })
    await item.save()
  console.log('item is saved with new status')
  
         new ItemCreatedPublisher(natsWrapper.client).publish({
           id: item.id,
            title: item.title,
             status:Status.IDLE
        })

     res.status(201).send(item)
    

}

)

export {router as newTicketRouter}