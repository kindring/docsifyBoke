/*
 * @Author: kindring
 * @Date: 2021-08-19 14:19:09
 * @LastEditTime: 2021-08-19 15:07:42
 * @LastEditors: Please set LastEditors
 * @Description: 入口
 * @FilePath: \docsifyBoke\index.js
 */
const Koa = require('koa');

const router = require('./router/index')
const config = require('./configs/hookServer')


const app = new Koa();


app.use(router.routes()).use(router.allowedMethods())

app.listen(config.port)

console.log(`server is running to ${config.port}`)

