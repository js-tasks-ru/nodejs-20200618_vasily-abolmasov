const Message = require('../models/Message');
const mapMessage = message => ({
  date: message.date,
  id: message._id,
  text: message.text,
  user: message.user,
});

module.exports.messageList = async function messages(ctx, next) {
  const messages = await Message.find({chat: ctx.user.id});
  ctx.body = {messages: messages.slice(-20).map(mapMessage)};
};
