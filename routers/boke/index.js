/*
 * @Description: 博客相关路由
 * @Version: 
 * @Autor: kindring
 * @Date: 2021-08-31 17:48:11
 * @LastEditors: kindring
 * @LastEditTime: 2021-09-08 15:06:38
 */
const Router = require('koa-router')
const KoaBody = require('koa-body');
const boke = require('../../controller/boke/index')
    // const githooks = require('../../configs/githook');
const router = new Router({
    prefix: '/githooks'
})

router.post('/handel', KoaBody(), async(ctx) => {
    let request = ctx.request;
    console.log(request.body);
    console.log(typeof request.body);
})

module.exports = router