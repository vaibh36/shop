import Queue from "bull";

interface Payload {
    email: string,
    orderId: string
}

// @ts-ignore
const emailQueue = new Queue<Payload>('email:sending', {
    redis: {
        host: process.env.REDIS_HOST
    }
})

// have to send a publisher from here to change the status of order from booked to idle just for testing purpose.

emailQueue.process(async (job) => {
    console.log('want to send an order completion notification for email:-', job.data.email)

})

export {emailQueue}