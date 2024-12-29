import { Publisher, Subjects } from './base-publisher'

export interface ItemCreatedEvent {
    subject: Subjects.TicketCreated;
    data:{
        id: string;
        title: string;
        status: string
    }
}

export class ItemCreatedPublisher extends Publisher<ItemCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated

}