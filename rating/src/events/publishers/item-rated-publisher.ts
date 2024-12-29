// @ts-nocheck
import { Publisher } from '@vaibhtickets/common'

export interface UserRating {
    email: string,
    rating: number
}


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
    OrderCancelled = 'order:cancelled',
    ItemRated = 'item:rated'
}

export interface ItemRatedEvent {
    subject: Subjects.ItemRated;
    data:{
        id: string;
        rating: UserRating;
        email: String
    }
}

export class ItemRatedPublisher extends Publisher<ItemRatedEvent> {
    subject: Subjects.ItemRated = Subjects.ItemRated

}