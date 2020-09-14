const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');
const Product = require('../models/Product');

module.exports.checkout = async function checkout(ctx, next) {
  const body = ctx.request.body;

  const order = await Order.create({
    user: ctx.user,
    product: body.product,
    phone: body.phone,
    address: body.address,
  });

  const product = await Product.findById(order.product);

  await sendMail({
    template: 'order-confirmation',
    locals: {
      id: order.id,
      product: {
        title: product.title,
      },
    },
    to: ctx.user.email,
    subject: 'Подтверждение создания заказа',
  });

  ctx.body = {order: order.id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  const orders = await Order.find({user: ctx.user});
  ctx.body = {orders: orders.map(mapOrder)};
};
