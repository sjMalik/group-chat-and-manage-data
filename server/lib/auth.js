const   debug   = require("debug")("api:auth"),
        bcrypt  = require("bcryptjs"),
        crypto  = require("crypto"),
        jwt     = require("jsonwebtoken");

const   config  = require("../../config"),
        knex    = require("../../db/knex");