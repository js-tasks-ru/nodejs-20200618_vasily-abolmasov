module.exports = function mapOrder(order) {
  return {
    id: order.id,
    product: {
      title: order.product.title,
      images: order.product.images,
      category: order.product.category,
      subcategory: order.product.subcategory,
      price: order.product.price,
      description: order.product.description
    },
    phone: order.phone,
    address: order.address,
  };
};
