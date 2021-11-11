/*
 * @Author: kindring
 * @Date: 2021-08-19 15:02:03
 * @LastEditTime: 2021-11-11 16:58:38
 * @LastEditors: kindring
 * @Description: 路由入口,统一导入路由
 * @FilePath: \docsifyBoke\router\index.js
 */
const path = require('path');
const loadTool = require('../loadTool');
const tools = require('../tools/index');
let infoLog = tools.log('all', 'routerIndex', 0);
let errLog = tools.log('all', 'routerIndex', 1);


function loadRouter(targetPath, files, app) {
    // console.log(files)
    // console.log(typeof files)
    files.forEach(file => {
        if (file.isDirectory) {
            loadRouter(targetPath, file.children, app)
        } else {
            try {
                let router = require(path.join(targetPath, file.path))
                app.use(router.routes()).use(router.allowedMethods())
            } catch (error) {
                errLog(`导入路由文件错误${file.path},errMsg:${error.message}`)
            }
        }
    })
}

module.exports = (app) => {
    let routers = {};
    let files = loadTool.loadFile(__dirname, '', 4)
        // console.log(files)
    files = loadTool.excludePath(files, __dirname, ['index.js'], 'js')
    loadRouter(__dirname, files, app)
}