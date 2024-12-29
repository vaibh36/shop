import { Listener, Subjects } from "./base-listener";
import { Message } from "node-nats-streaming";
import { Quantity } from "../../model/ticket";


export interface UserRating {
    email: string,
    rating: number
}

export interface ItemRatedEvent {
    subject: Subjects.ItemRated;
    data:{
         id: string;
        rating: number
        email: string
    }
}

export class ItemRatedListener extends Listener<ItemRatedEvent> {

    subject: Subjects.ItemRated = Subjects.ItemRated
    queueGroupName = 'tickets-service'

    async onMessage(data: ItemRatedEvent['data'], msg: Message) {
        console.log('I am in the rating listener of the ticket service1:-', data)

        const ticket = await Quantity.findById(data.id)
        if(!ticket){
            console.log('item not found')
            return
        }

        ticket.rating?.push({email: data.email, rating: data.rating})
        await ticket.save()
        msg.ack()

    }

}