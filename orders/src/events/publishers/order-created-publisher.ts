// @ts-nocheck
import {Publisher} from '@vaibhtickets/common'

export enum OrderStatus {
    Created= 'created',
    Cancelled = 'cancelled',
    AwaitingPayment = 'awaiting:payment',
    Complete = 'complete'
}


export enum Subjects {
    TicketCreated = 'ticket:created',
    OrderCreated = 'order:updated',
    TicketUpdated = 'ticket:updated',
    OrderCancelled = 'order:cancelled'
}

export interface OrderCreatedEvent {
    subject: Subjects.OrderCreated;
    data:{
        id: string;
        status?: string
        userId: string
        expiresAt?: string;
        ticket: {
            id: string;
        }
    }
}

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated

}