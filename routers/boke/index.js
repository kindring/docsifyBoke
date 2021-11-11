/*
 * @Description: 博客相关路由
 * @Version: 
 * @Autor: kindring
 * @Date: 2021-08-31 17:48:11
 * @LastEditors: kindring
 * @LastEditTime: 2021-11-11 18:11:03
 */
const Router = require('koa-router')
const KoaBody = require('koa-body');
const boke = require('../../controller/boke/index')
const tools = require('../../tools/index');
let infoLog = tools.log('all', 'routerBoke', 0);
const router = new Router({
    prefix: '/boke'
})

router.post('/handel', KoaBody(), async(ctx) => {
    let request = ctx.request;
    infoLog('/handel')
})

router.get('/start', KoaBody(), async(ctx) => {
    let request = ctx.request;
    infoLog('启动服务');
    let res = await boke.startDocsify();
    ctx.body = {
        code: 200,
        msg: 'ok',
        port: res.port
    }
})


module.exports = router