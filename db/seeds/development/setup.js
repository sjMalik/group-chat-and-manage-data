const users = require("./data/users.json");

exports.seed = async (knex, Promise)=> {
    await knex('users').insert(users);
}