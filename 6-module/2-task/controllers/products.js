const Product = require('../models/Product');

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcategory = ctx.request.query.subcategory;
  if (!subcategory) {
    await next();
  } else {
    const products = await Product.find({subcategory: subcategory});
    ctx.body = {products: products};
  }

};

module.exports.productList = async function productList(ctx, next) {
  ctx.body = {
    products: await Product.find(),
  };
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;
  let product;

  try {
    product = await Product.findById(id);
  } catch (e) {
    ctx.throw(400);
    return;
  }

  if (!product) {
    ctx.throw(404);
    return;
  }

  if (product) {
    ctx.body = {
      product: product,
    };
  }
};

