import { Stan } from "node-nats-streaming";


export enum Subjects {
    TicketCreated = 'ticket:created',
    OrderCreated = 'order:updated',
    TicketUpdated = 'ticket:updated',
    OrderCancelled = 'order:cancelled',
    ExpirationComplete = 'expiration:complete'
}

interface Event {
    subject: Subjects;
    data: any
}

export abstract class Publisher<T extends Event> {

   abstract subject: T['subject']
    protected client: Stan

     constructor(client: Stan){
        this.client = client
    }

    publish(data: T['data']): Promise<void>{

        return new Promise((resolve, reject)=>{

              this.client.publish(this.subject, JSON.stringify(data), (err: any)=>{

                if(err){
                    reject(err)
                }
            console.log('event published to subject:-', this.subject)
            resolve()
        })

        })

      
    }

}