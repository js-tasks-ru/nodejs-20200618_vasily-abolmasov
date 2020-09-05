const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  const token = uuid();
  const body = ctx.request.body;
  try {
    const user = await User.create(
        {
          email: body.email,
          displayName: body.displayName,
          verificationToken: token,
        }
    );
    await user.setPassword(body.password);
    await user.save();

    await sendMail({
      template: 'confirmation',
      locals: {token: token},
      to: body.email,
      subject: 'Подтвердите почту',
    });

    ctx.status = 200;
    ctx.body = {status: 'ok'};
  } catch (e) {
    ctx.status = 400;
    ctx.body = {errors: {email: e.errors.email.message}};
  }
};

module.exports.confirm = async (ctx, next) => {
  const verificationToken = ctx.request.body.verificationToken;
  const user = await User.findOne({verificationToken: verificationToken});
  if (!user) {
    ctx.status = 400;
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
  } else {
    user.verificationToken = undefined;
    user.save();

    const token = uuid();
    ctx.status = 200;
    ctx.body = {token: token};
  }
};
