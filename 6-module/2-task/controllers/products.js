const Product = require('../models/Product');
const mongoose = require('mongoose');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const querystring = ctx.query.subcategory;

  if(!mongoose.Types.ObjectId.isValid(querystring)){
    return ctx.body = { products:  []};
  }

  let products = await Product.find({subcategory: querystring}).exec();
  ctx.body = { products:  products.map(product => product.toObject())};
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find({}).exec();
  ctx.body = { products: products.map(product => product.toObject()) };
};

module.exports.productById = async function productById(ctx, next) {
  if(!mongoose.Types.ObjectId.isValid(ctx.params.id)){
    ctx.throw(400);
  }

  let product = await Product.findById(ctx.params.id).exec();
  if (!product){
    ctx.throw(404);
  }
  ctx.body = { product: product.toObject() };
};

