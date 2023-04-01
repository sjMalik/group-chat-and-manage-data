const   debug   = require("debug")("api:server"),
        http    = require("http"),
        sockio  = require("socket.io");

const   config              = require("../config"),
        host                = config.get("host"),
        port                = config.get("port"),
        server              = require("../server"),
        {getUsers, users, getLikes, likes}   = require('../server/lib/sockEventUsers');

const app = http.createServer(server);
global.io = sockio(app, {log: false});
debug('Socket started');


// It contains all realtime communication functions
io.on('connection', async (socket) =>  {

    socket.on('joined-user', (data) =>{
        //Storing users connected in a group in memory
        let user = {};
        user[socket.id] = data.userid;
        user['name'] = data.username;
        if(users[data.groupid]){
            users[data.groupid].push(user);
        }
        else{
            users[data.groupid] = [user];
        }
        
        //Joining the Socket group
        socket.join(data.groupid);

        //Emitting New Username to Clients
        io.to(data.groupid).emit('joined-user', {
            userid: data.userid,
            username: data.username
        });

        //Send online users array
        io.to(data.groupid).emit('online-users', getUsers(users[data.groupid]))
    })

    //Emitting messages to Clients
    socket.on('chat', (data) =>{
        io.to(data.groupid).emit('chat', {
            userid: data.userid,
            username: data.username, 
            message: data.message,
            chatid: data.chatid
        });
    })

    // Emitting message likes to Clients
    socket.on('like-message', (data)=> {
        let like = {};
        like['userid'] = data.userid;
        like['chatid'] = data.chatid;
        if(likes[data.groupid]){
            likes[data.groupid].push(like);
        }
        else{
            likes[data.groupid] = [like];
        }
        //Send message likes
        io.to(data.groupid).emit('likes', getLikes(likes[data.groupid]))
    })

    //Broadcasting the user who is typing
    socket.on('typing', (data) => {
        socket.broadcast.to(data.groupid).emit('typing', {
            userid: data.userid,
            username: data.username
        })
    })

    //Remove user from memory when they disconnect
    socket.on('disconnecting', ()=>{
        let groups = Object.keys(socket.groups);
        let socketId = groups[0];
        let groupid = groups[1];
        users[groupid].forEach((user, index) => {
            if(user[socketId]){
                users[groupid].splice(index, 1)
            }
        });

        //Send online users array
        io.to(groupid).emit('online-users', getUsers(users[groupid]))
    })

})

app.listen(port, host, () => {
    debug("Server started on %s:%s", host, port);
});

// For Testing
module.exports = app;



