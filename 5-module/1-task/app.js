const Koa = require('koa');
const app = new Koa();
const subscribes = require('./subscribes');

app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

router.get('/subscribe', async (ctx, next) => {
  await subscribes.subscribe(ctx);
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;
  if (!message){
    ctx.throw(400, 'message required')
  } else {
    subscribes.publish(ctx, message);
  }
});

app.use(router.routes());

module.exports = app;
