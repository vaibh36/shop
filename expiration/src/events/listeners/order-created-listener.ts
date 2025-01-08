import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
 import { expirationQueue } from "../../queues/expiration-queue";


export enum Subjects {
    TicketCreated = 'ticket:created',
    OrderCreated = 'order:updated',
    TicketUpdated = 'ticket:updated',
    OrderCancelled = 'order:cancelled',
    ExpirationComplete = 'expiration:complete'
}


export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated;
    data: {
        id: string,
        ticket: {
            id: string
        }
    };
}


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = 'expiration-service'

    async onMessage(data: OrderCreatedEvent['data'], msg: Message){

        const {id, ticket} = data
        console.log('will be sending this for expiration of order if not paid', id, ticket.id)
         // @ts-ignore
        await expirationQueue.add({
            // @ts-ignore
            orderId: id,
            ticket: {
                id: ticket.id
            }
        }, {
            delay: 3000
        })
        msg.ack()

    }

}