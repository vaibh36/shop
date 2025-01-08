import Queue from "bull";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

interface Payload {
    orderId: string,
    ticket: {
        id: string
    }
}

// @ts-ignore
const expirationQueue = new Queue<Payload>('order:expiration', {
    redis: {
        host: process.env.REDIS_HOST
    }
})

// have to send a publisher from here to change the status of order from booked to idle just for testing purpose.

expirationQueue.process(async (job) => {
    console.log('order id and ticket which are to be expired are:-', job.data.orderId, job.data.ticket.id)
    new OrderCancelledPublisher(natsWrapper.client).publish({
        orderId: job.data.orderId,
        ticket: {
            id: job.data.ticket.id
        }
    })

})

export {expirationQueue}