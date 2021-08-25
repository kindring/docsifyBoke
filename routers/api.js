/*
 * @Author: your name
 * @Date: 2021-08-20 10:37:45
 * @LastEditTime: 2021-08-25 11:36:04
 * @LastEditors: Please set LastEditors
 * @Description: 路由接口模块
 * @FilePath: \docsifyBoke\routers\api.js
 */
const Router = require('koa-router')
const KoaBody = require('koa-body');
const router = new Router({
    prefix: '/api'
})

router.get('/boke',async (ctx)=>{
    ctx.body = '你好'
})




module.exports = router
