const mongoose = require('mongoose');
const connection = require('../libs/connection');

const subCategorySchema = new mongoose.Schema({
  title: {type: String, required: true},
});
subCategorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'subcategory'
});

const categorySchema = new mongoose.Schema({
  title: {type: String, required: true},
  subcategories: [subCategorySchema]
});
categorySchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category'
});

module.exports = connection.model('Category', categorySchema);
