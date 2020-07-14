const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();
let message = null;
const subscribers = {};

router.get('/subscribe', async (ctx, next) => {
  const id = Math.random();
  subscribers[id] = null;
  let interval;
  await new Promise((resolve, reject) => {
    interval = setInterval(() => {
      if (subscribers[id] !== null) {
        resolve(subscribers[id]);
      }
    }, 200);
  }).then(() => {
    clearInterval(interval);
  });
  ctx.status = 200;
  ctx.body = message;
});

router.post('/publish', async (ctx, next) => {
  message = ctx.request.body.message;
  ctx.status = 200;


  for(const id in subscribers) {
    subscribers[id] = message;
  }
});

app.use(router.routes());

module.exports = app;
