import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";


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
        userId: string;
    };
}


export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = 'communication-service'

    async onMessage(data: OrderCreatedEvent['data'], msg: Message){

        const {userId} = data
        console.log('I am in listener of communication You have booked an order and your email is:-', userId)
        msg.ack()

    }

}