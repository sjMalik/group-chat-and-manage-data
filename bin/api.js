const   debug   = require("debug")("api:server"),
        http    = require("http");

const   config  = require("../config"),
        host    = config.get("host"),
        port    = config.get("port"),
        server  = require("../server");

const app = http.createServer(server);

app.listen(port, host, () => {
    debug("Server started on %s:%s", host, port);
})



