const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use('/', require('./routes'));
app.use('/groups', require('./routes/groups'));
app.use('/admin', require('./routes/admin'));


module.exports = app;