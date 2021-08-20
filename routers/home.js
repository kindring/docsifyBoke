/*
 * @Author: your name
 * @Date: 2021-08-19 15:09:30
 * @LastEditTime: 2021-08-20 11:19:00
 * @LastEditors: Please set LastEditors
 * @Description: 主页路由
 * @FilePath: \docsifyBoke\router\home.js
 */
const Router = require('koa-router');
const router = new Router();

router.get('/',async ctx=>{
    ctx.body = 'Hello World'
})
router.get('/test',async ctx=>{
    ctx.body = '测试'
})

module.exports = router;