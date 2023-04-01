const   request     = require('supertest'),
        {expect}    = require('expect');

const   app = require('../bin/api');

describe('Testing POST /admin/users & PATCH /admin/users/:userid', () => {
    it('respond with valid HTTP status code and description and message', async ()=> {
        // Login admin
        const reply = await request(app)
            .post('/login')
            .send({
                email: 'admin@gmail.com',
                password: 'pass123'
            });
        const commonHeaders = {
            Authorization: 'Bearer '+ reply.body.token,
            'Content-Type': 'application/json'
        }
        let randomString = (Math.random() + 1).toString(36).substring(7);

        // Create a normal user
        const response = await request(app)
            .post('/admin/users')
            .set(commonHeaders)
            .send({
                email: randomString + '@gmail.com',
                first_name: 'John',
                last_name: 'Smith'
            });

        expect(response.status).toBe(200);

        // Update this normal user
        const updateResponse = await request(app)
        .patch('/admin/users/'+ response.body.user.id)
        .set(commonHeaders)
        .send({
            first_name: 'Kenn',
            last_name: 'William'
        });

        expect(updateResponse.status).toBe(200);
    })
})