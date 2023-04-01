//Store connected Users
let users = {}, likes = {};

//Funtion to get users online in a room
function getUsers(arr){
    onlineUsers = []
    arr.forEach((onlineUser) => {
        onlineUsers.push(Object.values(onlineUser)[0])
    })
    return onlineUsers
}

function getLikes(arr){
    likeMessages = [];
    arr.forEach((like)=> {
        likeMessages.push(Object.values(like)[0])
    })
    return likeMessages;
}

module.exports = {getUsers, users, getLikes, likes};