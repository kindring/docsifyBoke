/*
 * @Author: your name
 * @Date: 2021-08-20 17:09:34
 * @LastEditTime: 2021-08-25 17:35:11
 * @LastEditors: Please set LastEditors
 * @Description: 路由
 * @FilePath: \docsifyBoke\routers\githook\githook.js
 */
const Router = require('koa-router')
const KoaBody = require('koa-body');
const githooks = require('../../configs/githook');
const router = new Router({
    prefix: '/githooks'
})

router.post('/handel',KoaBody(),async (ctx)=>{
    let request = ctx.request;
    console.log(request.body);
    console.log(typeof request.body);    
})

module.exports = router
