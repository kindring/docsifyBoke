/*
 * @Author: kindring
 * @Date: 2021-08-19 14:19:09
 * @LastEditTime: 2021-11-11 16:55:48
 * @LastEditors: kindring
 * @Description: 入口
 * @FilePath: \docsifyBoke\index.js
 */
const Koa = require('koa');
const path = require('path');

const config = require('./configs/hookServer')
const routing = require('./routers/index.js')
const log = require('./tools/log')
log.init('all', path.join(__dirname, './logs'))
let infoLog = log('all', 'app', 0);
infoLog('服务已经启动....');

const app = new Koa();
// 使用路由
routing(app)

app.listen(config.port)

console.log(`server is running to ${config.port}`)