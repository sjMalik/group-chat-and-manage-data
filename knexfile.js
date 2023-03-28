module.exports = {
    development: {
        client: "pg",
        connection: "postgres://postgres:mysecretpassword@localhost/group_chat",
        migrations: {
            directory: __dirname + "/db/migrations"
        },
        seeds: {
            directory: __dirname + "/db/seeds/development"
        }
    }
}