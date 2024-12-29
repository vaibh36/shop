import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { Ticket } from "../../models/ticket";

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
    queueGroupName = 'orders-service'

    async onMessage(data: TicketCreatedEvent['data'], msg: Message){

        const {title, id} = data
        const ticket = Ticket.build({
            title, id
        })

        await ticket.save()
        msg.ack()

    }

}