import express, {NextFunction, Request, Response} from "express";
import { json } from "body-parser";
import { newTicketRouter } from "./new";
import mongoose from "mongoose";
import { natsWrapper } from "./nats-wrapper";
import { showAllItemRouter } from "./show";
import { errorHandler } from "./middleware/error-handler";
import { OrderCreatedListener } from "./events/listeners/order-created-istener";
import { ItemRatedListener } from "./events/listeners/item-rated-listener";
import { showItemDetailRouter } from "./ticket-detail";
import { OrderCancelledListener } from "./events/listeners/order-cancelled-listener";

const app = express()
app.use(json())
app.use(newTicketRouter)
app.use(showAllItemRouter)
app.use(showItemDetailRouter)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler(err, req, res, next);
});



const start = async () => {
    console.log('I am start function of quantity')
    try {
        
           await natsWrapper.connect('ticketing', 'last1', 'http://nats-srv:4222')

           natsWrapper.client.on('close', ()=>{
            process.exit()
        })


        process.on('SIGINT', ()=> natsWrapper.client.close())
        process.on('SIGTERM', () => natsWrapper.client.close())
        

        new OrderCreatedListener(natsWrapper.client).listen()
        new ItemRatedListener(natsWrapper.client).listen()
        new OrderCancelledListener(natsWrapper.client).listen()

        await mongoose.connect('mongodb://tickets-mongo-srv:27017/tickets', {
      serverSelectionTimeoutMS: 30000
})
        console.log('Connected to mongodb of quantity now1')
    }catch(err){
        console.log('Error here is:-', err)
    }

    app.listen(3000, ()=>{
    console.log('listening on 3000 new day3')
})
  
}

start()

export {app as QuantityApp}