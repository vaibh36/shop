import { Publisher, Subjects } from "./base-publisher";

 interface OrderCancelledEvent {
    subject: Subjects.OrderCancelled;
    data:{
        orderId: string;
        ticket: {
            id: string
        }
    }
}

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled

}