module.exports = function mustBeAuthenticated(ctx, next) {
  if (!ctx.user) {
    const msg = 'Пользователь не залогинен';
    ctx.status = 401;
    ctx.body = {error: msg};
    return;
  }
  return next();
};
