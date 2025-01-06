import { Listener, Subjects } from "./base-listener";
import { Message } from "node-nats-streaming";
import { Quantity } from "../../model/ticket";

export interface OrderCancelledEvent {
    subject: Subjects.OrderCancelled;
    data:{
        ticket: {
            id: string;
        },
        userId: string
    }
}

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {

    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
    queueGroupName = 'tickets-service'

    async onMessage(data: OrderCancelledEvent['data'], msg: Message){

        const ticket = await Quantity.findById(data.ticket.id)
        if(!ticket){
            throw new Quantity('Item not found')
        }

        ticket.set({status: "idle", bookedBy: ""})
        await ticket.save()
        msg.ack()

    }

}