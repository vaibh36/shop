import express from 'express'
import {json} from 'body-parser'
import { natsWrapper } from './nats-wrapper';
import {OrderCreatedListener  } from './events/listeners/order-created-listener';


console.log('I am in expiration as of now')
const app = express()
app.set('trust proxy', true)
app.use(json())

const start = async ()=>{
    try{
        await natsWrapper.connect('ticketing', 'last5', 'http://nats-srv:4222')

           natsWrapper.client.on('close', ()=>{
            process.exit()
        })


        process.on('SIGINT', ()=> natsWrapper.client.close())
        process.on('SIGTERM', ()=> natsWrapper.client.close())

        new OrderCreatedListener(natsWrapper.client).listen()
      
    }catch(err){
        console.log('Error here is:-', err)
    }

    app.listen(3000, ()=>{
    console.log('listening on 3000 new day3')
})
  
}

start()


