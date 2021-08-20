/*
 * @Author: kindring
 * @Date: 2021-08-19 14:19:09
 * @LastEditTime: 2021-08-20 10:00:38
 * @LastEditors: Please set LastEditors
 * @Description: 入口
 * @FilePath: \docsifyBoke\index.js
 */
const Koa = require('koa');

const config = require('./configs/hookServer')
const routing = require('./routers/index.js')


const app = new Koa();
// 使用
routing(app)

app.listen(config.port)

console.log(`server is running to ${config.port}`)

