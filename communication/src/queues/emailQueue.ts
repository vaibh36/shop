import Queue from "bull";

interface Payload {
    email: string
}

// @ts-ignore
const emailQueue = new Queue<Payload>('email:sending', {
    redis: {
        host: process.env.REDIS_HOST
    }
})

emailQueue.process(async (job) => {
    console.log('want to send an order completion notification for email:-', job.data.email)
})

export {emailQueue}