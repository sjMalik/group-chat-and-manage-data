const   debug = require('debug')('api:users'),
        express = require('express');

const   knex        = require('../../db/knex'),
        config      = require('../../config'),
        middleware  = require('./middleware'),
        auth        = require('../lib/auth'),
        email       = require('../lib/email');

const router = express.Router();
router.use(middleware.isAuthenticated);

/**
 * Create a new user by Admin
 */
router.post('/users', async (req, res)=> {
    if(req.user.role !== 'ADMIN'){
        return res.status(403).json({
            message: 'You are not authorized'
        })
    }

    let user = req.body;
    try{
        let randomPassword = Math.random().toString(36).slice(-8);
        debug(randomPassword);
        let user_id = await knex('users')
            .insert({
                email: user.email,
                password: auth.encode(user.email, randomPassword),
                first_name: user.first_name,
                last_name: user.last_name,
                role: 'MEMBER'
            });
        email.sendAccountCreationMail(user.email, user.first_name, user.last_name, randomPassword);
        
        return res.status(200).json({
            message: 'User created'
        }).end();
    }catch(e){
        debug(e);
        return res.status(500).json(e);
    }
});

/**
 * Update user by Admin
 */
router.patch('/users/:userid', async (req, res)=> {
    if(req.user.role !== 'ADMIN'){
        return res.status(403).json({
            message: 'You are not authorized'
        })
    }

    let user = req.body;
    try{
        await knex.table('users')
            .update({
                first_name: user.first_name,
                last_name: user.last_name,
            }).where('id', req.params.userid);

            return res.status(200).end();
    }catch(e){
        debug(e);
        return res.status(500).json(e).end()
    }
})

module.exports = router;