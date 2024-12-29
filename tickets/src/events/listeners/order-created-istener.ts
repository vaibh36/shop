import { Listener, Subjects } from "./base-listener";
import { Message } from "node-nats-streaming";
import { Quantity } from "../../model/ticket";

export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated;
    data:{
        ticket: {
            id: string;
        },
        userId: string
    }
}

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {

    subject: Subjects.OrderCreated = Subjects.OrderCreated
    queueGroupName = 'tickets-service'

    async onMessage(data: OrderCreatedEvent['data'], msg: Message){

        const ticket = await Quantity.findById(data.ticket.id)
        if(!ticket){
            throw new Quantity('Item not found')
        }

        ticket.set({status: "booked", bookedBy: data.userId})
        await ticket.save()
        msg.ack()

    }

}