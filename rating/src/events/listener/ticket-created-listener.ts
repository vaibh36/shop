import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { Quantity } from "../../models/ticket";

export enum Subjects {
    TicketCreated = 'ticket:created',
    OrderCreated = 'order:updated',
    TicketUpdated = 'ticket:updated',
    OrderCancelled = 'order:cancelled',
    ExpirationComplete = 'expiration:complete'
}


export interface TicketCreatedEvent {
    subject: Subjects.TicketCreated;
    data: {
        id: string;
        title: string;
    };
}


export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated
    queueGroupName = 'rating-service'

    async onMessage(data: TicketCreatedEvent['data'], msg: Message){

        const {id} = data
        const ticket = Quantity.build({
             ticketId:id
        })
        console.log('ticket has been created in the rating service which is:-', ticket)
        await ticket.save()
        msg.ack()

    }

}