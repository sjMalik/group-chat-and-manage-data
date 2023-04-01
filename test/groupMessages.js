const   request     = require('supertest'),
        {expect}    = require('expect');

const   app = require('../bin/api');

describe('Testing POST /groups/:groupid/chats & POST /groups/:groupid/chats/:chatid/like & DELETE /groups/:groupid/chats/:chatid/dislike', () => {
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

        // Save chats
        const chat_response = await request(app)
            .post('/groups/'+response.body.group.id+'/chats')
            .set(commonHeaders)
            .send({
                text: "Hello World",
                message_props: "{}"
            });

        expect(chat_response.status).toBe(200);

        // Like the chat
        const chat_like_response = await request(app)
            .post('/groups/'+response.body.group.id+'/chats/'+chat_response.body.chat.id+'/like')
            .set(commonHeaders);

        expect(chat_like_response.status).toBe(200);

        const group_chats = await request(app)
            .get('/groups/'+response.body.group.id+'/chats')
            .set(commonHeaders);
        
        expect(group_chats.status).toBe(200);
        expect(group_chats.body.chats[0].chat_likes[0].id).toBe(chat_like_response.body.chat_like.id);

        // Unlike the chat
        const chat_unlike_response = await request(app)
            .post('/groups/'+response.body.group.id+'/chats/'+chat_response.body.chat.id+'/dislike')
            .set(commonHeaders);

        expect(chat_unlike_response.status).toBe(200);

        const group_chats_2 = await request(app)
            .get('/groups/'+response.body.group.id+'/chats')
            .set(commonHeaders);
        
        expect(group_chats_2.status).toBe(200);
    })
})