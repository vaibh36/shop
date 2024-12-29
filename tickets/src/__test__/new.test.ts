import request from 'supertest'
import { QuantityApp } from '..'


it('successful response for item creation', () => {
    return request(QuantityApp)
        .post('/api/quantity')
        .send({
            quantity: 8
        })
        .expect(201)
})  


it('successful response for getting item', () => {
    return request(QuantityApp)
        .get('/api/quantity')
        .expect(200)
})  