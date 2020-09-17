'use strict'

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Product = use('App/Models/Product')

/**
 * Resourceful controller for interacting with products
 */
class ProductController {
  /**
   * Show a list of all products.
   * GET products
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ auth }) {
    const products = await Product.query().setHidden(['created_at', 'updated_at', 'user_id'])
      .where('user_id', auth.user.id)
      .with('user', (builder) =>
        builder.select(['id', 'username', 'email'])
      ).fetch()
      .then((users) => users.toJSON())

    return {
      products: products,
      users: `same user: ${!!delete products[0].user}`
    }
  }

  /**
   * Render a form to be used for creating a new product.
   * GET products/create
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async create({ request, auth }) {
    const data = request.only(['name', 'description', 'infos', 'code', 'price'])
    const product = await Product.create({ user_id: auth.user.id, ...data })
    return product
  }

  /**
   * Display a single product.
   * GET products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async findById({ params }) {
    const product = await Product.findOrFail(params.id)
    return product
  }

  /**
   * Delete a product with id.
   * DELETE products/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, auth, response }) {
    const product = await Product.findOrFail(params.id)
    if (product.user_id !== auth.user.id) {
      return response.status(401)
    }
    await product.delete()
  }
}

module.exports = ProductController
