import express from 'express'
import {json} from 'body-parser'


import mongoose from 'mongoose'
import cookieSession from 'cookie-session'
import { natsWrapper } from '../nats-wrapper';
import { rateTicketRouter } from './routes/rate';
import { NotFoundError } from '@vaibhtickets/common';
import { TicketCreatedListener } from './events/listener/ticket-created-listener';
import { showAllRatingRouter } from './routes/show';


console.log('I am in rating as of now1')
const app = express()
app.set('trust proxy', true)
app.use(json())



app.use(rateTicketRouter)
app.use(showAllRatingRouter)

app.all('*', ()=>{
    console.log('route not found2')
    throw new NotFoundError()
})




const start = async ()=>{

  

    try{
        await natsWrapper.connect('ticketing', 'last4', 'http://nats-srv:4222')

           natsWrapper.client.on('close', ()=>{
            process.exit()
        })


        process.on('SIGINT', ()=> natsWrapper.client.close())
        process.on('SIGTERM', ()=> natsWrapper.client.close())

        new TicketCreatedListener(natsWrapper.client).listen()
       

        await mongoose.connect('mongodb://rating-mongo-srv:27017/rating', {
            // @ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000
})
        console.log('Connected to mongodb of orders now')
    }catch(err){
        console.log('Error here is:-', err)
    }

    app.listen(3000, ()=>{
    console.log('listening on 3000 new day3')
})
  
}

start()


