/*
 * @Author: miraitowa 1835110799@qq.com
 * @Date: 2023-09-27 22:29:54
 * @LastEditors: lyq
 * @LastEditTime: 2023-10-08 16:11:56
 * @FilePath: \手写koa\Koa\application.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const http = require('http');
const context = require('./context');
const request = require('./request');
const response = require('./response');
const EventEmitter = require('events'); //nodejs 中发布订阅模块
class Koa extends EventEmitter {
  constructor() {
    super();
    this.middleWares = [];
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
  }
  createContext(req, res) {
    let ctx = Object.create(this.context);
    let request = Object.create(this.request);
    let response = Object.create(this.response);
    ctx.req = req;
    ctx.request = request;
    ctx.request.req = req;
    return ctx;
  }
  componse(middleWares) {
    if (!Array.isArray(middleWares)) throw new TypeError('Middlewares stack must be an array!');
    for (const fn of middleWares) {
      if (typeof fn !== 'function') throw new TypeError('Middlewares must be composed of functions!');
    }
    return function (ctx) {
      let index = -1;
      function dispath(i) {
        if (i <= index) {
          return Promise.reject('next() call multiples times');
        }
        index = i;
        if (i === middleWares.length) {
          return Promise.resolve();
        }
        try {
          let fn = middleWares[i];
          return Promise.resolve(fn(ctx, dispath.bind(null, i + 1)));
        } catch (error) {
          console.log('eeefasdf ', error);
          return Promise.reject(error);
        }
      }
      return dispath(0);
    };
  }
  use(middleWare) {
    this.middleWares.push(middleWare);
  }
  handleRequest(req, res) {
    let ctx = this.createContext(req, res);
    res.statusCode = 404;
    let onerror = error => {
      this.onerror(error);
    };
    this.componse(this.middleWares)(ctx).then(this.respond.bind(this, ctx, req, res)).catch(onerror);
  }
  listen(...agrs) {
    let serve = http.createServer(this.handleRequest.bind(this));
    serve.listen(...agrs);
  }
  respond(ctx, req, res) {
    console.log(ctx.body, '响应结果');
    if (ctx.body) {
      //返回最终的结果给用户
      res.end(ctx.body);
    } else {
      res.end('Not Found');
    }
  }
  onerror(err) {
    this.emit('error', err);
  }
}
module.exports = Koa;
