/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await Promise.all([
    knex.schema.createTable('users', (table)=> {
      table.increments('id').primary().unsigned(),
      table.string('email').notNullable().unique(),
      table.string('password').notNullable(),
      table.string('first_name').notNullable(),
      table.string('last_name').notNullable(),
      table.enu('role', ['MEMBER', 'ADMIN']),
      table.timestamp('created_at').defaultTo(knex.fn.now())
    }),

    knex.schema.createTable('chat_groups', (table)=> {
      table.increments('id').primary().unsigned(),
      table.string('name').notNullable(),
      table.timestamp('created_at').defaultTo(knex.fn.now())
    }),

    knex.schema.createTable('group_users', (table)=> {
      table.increments('id').primary().unsigned(),
      table.integer('group_id').references('id').inTable('chat_groups'),
      table.integer('user_id').references('id').inTable('users'),
      table.timestamp('created_at').defaultTo(knex.fn.now())
    }),

    knex.schema.createTable('chats', (table)=> {
      table.increments('id').primary().unsigned(),
      table.string('message').nullable(),
      table.json('message_props'),
      table.integer('group_id').references('id').inTable('chat_groups'),
      table.integer('user_id').references('id').inTable('users'),
      table.timestamp('created_at').defaultTo(knex.fn.now())
    })
  ])
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await Promise.all([
    knex.raw('drop table if exists "users" cascade')
  ])
};
