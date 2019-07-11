const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
  const categories = await Category.find({}).exec();
  const categoriesToResponse = categories.map(category=>{
    const normCategory = category.toObject();
    normCategory.subcategories = category.subcategories.map(sub=>sub.toObject())
    return normCategory;
  });

  ctx.body = { categories: categoriesToResponse };
};
