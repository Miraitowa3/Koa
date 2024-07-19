/*
 * @Author: miraitowa 1835110799@qq.com
 * @Date: 2023-09-16 21:15:32
 * @LastEditors: lyq
 * @LastEditTime: 2023-10-08 16:10:23
 * @FilePath: \手写koa\app.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 *
 */
var koa = require('./Koa/application');
// var koa = require('koa');

var app = new koa();
function sleep(time) {
  return new Promise((r, j) => {
    setTimeout(() => {
      console.log('sleep');
      r();
    }, time);
  });
}
app.use(async function (ctx, next) {
  console.log(1111);
  ctx.body = '1111';
  // throw 'fn error';
   next();
  // await next();

  ctx.body = '2222';

  console.log(2222);
});
app.use(async function (ctx, next) {
  console.log(3333);
  ctx.body = '3333';
  await sleep(2000);
  next();
  ctx.body = '44444';
  console.log(44444);
});
app.use(async function (ctx, next) {
  console.log(5555);
  ctx.body = '55555';
  next();
  console.log(66666);
  ctx.body = '66666';
});
app.use(async function (ctx, next) {
  console.log(7777);
  ctx.body = '7777';
  next();
  ctx.body = '88888';
  console.log(88888);
});
app.on("error",function (err) {
  console.log(err,"error");
})
app.listen(3000, function (params) {});
