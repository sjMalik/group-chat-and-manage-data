const debug = require('debug')('api:base');
const express = require('express');
const router = express.Router();

const   auth    = require('../lib/auth'),
        pkg     = require('../../package.json');

router.get('/', (req, res)=> {
    return res.status(200).send({
        version: pkg.version
    }).end();
})

router.post('/login', (req, res)=> {
    debug(`POST /login ${JSON.stringify(req.body)}`);
    auth.login(req, res);
});

module.exports = router;