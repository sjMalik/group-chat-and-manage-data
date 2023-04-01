# group-chat-and-manage-data

## Prequisite
1. NodeJS v18.13.0
2. PostgresSQL 10.23

## Install knex globbaly
`npm install knex -g`

## Create Database
Database Name: `group_chat`

## Migrate the Database and insert seed data
`knex migrate:latest; knex seed:run;`

## Install all dependencies
`npm install`

## Run the server
`npm start`

## Testing application by running test script
`npm test`


## List of APIs
1. Login : POST - `{server}/auth/login`
    ```
    {
        "email": "",
        "password": ""
    }
    ```
2. Create Normal User by Admin  : POST - `{server}/admin/users`
    ```
    {
        "email": "",
        "first_name": "",
        "last_name": ""
    }
    ```
3. Update Normal User by Admin : PATCH - `{server}/admin/users/:userid`
    ```
    {
        "first_name": "",
        "last_name": ""
    }
    ```
4. Get list of chat groups : GET - `{server}/groups`
5. Create a new chat group : POST - `{server}/groups`
    ```
    {
        "name": ""
    }
    ```
6. Get a particular group : GET - `{server}/groups/:groupid`
7. Update a group : PATCH - `{server}/groups/:groupid`
    ```
    {
        "name": ""
    }
    ```
8. Delete a group : DELETE - `{server}/groups/:groupid`
9. Search by group name : GET - `{server}/groups?search={{search-text}}`
10. Add member to a group : POST - `{server}/groups/:groupid/add_member`
    ```
    {
        "user_id": ""
    }
    ```
11. Get all members in a group : GET - `{server}/groups/:groupid/users`
12. Save message in a group : POST - `{server}/groups/:groupid/chats`
    ```
    {
        "message": "",
        "message_props": "",
        "created_by": "",
        "group_id": ""
    }
    ```
13. Get Group chats and likes : GET - `{server}/groups/:groupid/chats`
14. Like message : POST - `{server}/groups/:groupid/chats/:chatid/like`
15. Dislike message : POST - `{server}/groups/:groupid/chats/:chatid/dislike`

## Socket Events for Realtime Communincations
1. `joined-user` - Storing users connected in a group in memory and Emitting New Username to Clients
    ```
    {
        "userid": "",
        "username": "",
        "groupid": ""
    }
    ```
2. `online-users` - Send online users array
3. `chat` - Emitting messages to Clients
    ```
    {
        "userid": "",
        "username": "",
        "message": "",
        "chatid": ""
    }
    ```
4. `like-message` - Emitting message likes to Clients
    ```
    {
        "userid": "",
        "chatid": ""
    }
    ```
5. `typing` - Broadcasting the user who is typing
    ```
    {
        "groupid": "",
        "userid": "",
        "username": ""
    }
    ```

