const   request     = require('supertest'),
        {expect}    = require('expect');

const   app = require('../bin/api');

describe('Testing POST /groups & GET /groups/:groupid POST /groups/:groupid/add_member', () => {
    it('respond with valid HTTP status code and description and message', async ()=> {
        // Login a Memeber
        const reply = await request(app)
            .post('/login')
            .send({
                email: 'harry@gmail.com',
                password: 'pass123'
            });
        const commonHeaders = {
            Authorization: 'Bearer '+ reply.body.token,
            'Content-Type': 'application/json'
        };

        // Create a new chat group
        let randomString = (Math.random() + 1).toString(36).substring(7);
        const response = await request(app)
            .post('/groups')
            .set(commonHeaders)
            .send({
                name: randomString
            });

        expect(response.status).toBe(200);

        // Get the newly created group
        const group = await request(app)
            .get('/groups/'+response.body.group.id)
            .set(commonHeaders);
        
        expect(group.status).toBe(200);
        expect(group.body.name).toBe(randomString);

        // Add member to this group
        const response_2 = await request(app)
            .post('/groups/'+response.body.group.id+'/add_member')
            .set(commonHeaders)
            .send({
                user_id: 2
            });
        
        expect(response_2.status).toBe(200);
    })
});