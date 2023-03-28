let nconf       = require("nconf"),
    defaults    = require("./defaults.json");

nconf.env().argv();
nconf.defaults(defaults);

module.exports = nconf;