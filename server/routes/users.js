const   debug       = require('debug')('api:groups'),
        express     = require('express'),
        numeral     = require('numeral');

const   config      = require('../../config'),
        knex        = require('../../db/knex'),
        middleware  = require('./middleware');

const router = express.Router();
router.use(middleware.isAuthenticated);