import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/orders";
import { NotFoundError } from "../../errors/not-found-error";

export enum Subjects {
    TicketCreated = 'ticket:created',
    OrderCreated = 'order:updated',
    TicketUpdated = 'ticket:updated',
    OrderCancelled = 'order:cancelled',
    ExpirationComplete = 'expiration:complete',
}


export interface OrderCancelledEvent {
    subject: Subjects.OrderCancelled;
    data: {
        orderId: string;
    };
}


export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled
    queueGroupName = 'orders-service'

    async onMessage(data: OrderCancelledEvent['data'], msg: Message){

        const { orderId } = data
        const order = await Order.findById(orderId).populate('ticket')
        console.log('this is for the cancelled via queue:-', order)

          if(!order){
                throw new NotFoundError()
            }

         order.status = "cancelled"
            await order.save()
           msg.ack()

    }

}