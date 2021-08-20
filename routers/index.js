/*
 * @Author: kindring
 * @Date: 2021-08-19 15:02:03
 * @LastEditTime: 2021-08-20 10:29:03
 * @LastEditors: Please set LastEditors
 * @Description: 路由文件
 * @FilePath: \docsifyBoke\router\index.js
 */
const path = require('path');
const loadTool = require('../loadTool');

function loadRouter(targetPath,files,app){
    files.forEach(file=>{
        if(file.isDirectory){
            loadRouter(targetPath,file,app)
        }else{
            try {
                let router = require(path.join(targetPath,file.path))
                app.use(router.routes()).use(router.allowedMethods())
            } catch (error) {
                console.error(`导入路由文件错误${file.path}`)
                console.error(error.message)
            }
        }
    })
}

module.exports  = (app)=>{
    let routers = {};
    let files = loadTool.loadFile(__dirname,'',4)
    files = loadTool.excludePath(files,__dirname,['index.js'],'js')
    loadRouter(__dirname,files,app)
    // for (const router in object) {
    //     app.use(router.routes()).use(router.allowedMethods())
    // }
    // app.use()
}