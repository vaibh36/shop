import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import { QuantityApp } from '../index'

let mongo: MongoMemoryServer

beforeAll(async () => {
    // @ts-ignore
     mongo = await MongoMemoryServer.create()
    const mongoUri =  mongo.getUri()

    await mongoose.connect(mongoUri, {
        // @ts-ignore
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
})


beforeEach(async() => {
    const collections = await mongoose.connection.db?.collections() || []

    for (let collection of collections) {
        await collection.deleteMany({})
    }
})

afterAll(async() => {
    await mongo.stop()
    await mongoose.connection.close()
})