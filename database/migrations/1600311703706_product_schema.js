'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ProductSchema extends Schema {
  up() {
    this.create('products', (table, longtext) => {
      table.string('name', 255).notNullable()
      table.text('description', [longtext]).notNullable()
      table.text('infos', [longtext]).notNullable()
      table.float('code', 8, 2).notNullable()
      table.float('price', 8, 2).notNullable()
      table
        .integer('user_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('users')
        .onUpdate('CASCADE')
        .onDelete('CASCADE')
      table.increments()
      table.timestamps()
    })
  }

  down() {
    this.drop('products')
  }
}

module.exports = ProductSchema
