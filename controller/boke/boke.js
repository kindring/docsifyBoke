/*
 * @Author: kindring
 * @Date: 2021-08-25 14:18:54
 * @LastEditTime: 2021-08-25 17:55:54
 * @LastEditors: Please set LastEditors
 * @Description: 博客处理
 * @FilePath: \docsifyBoke\controller\boke.js
 */
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path')

const loadTools = require('../../loadTool')
const bokeConfig = require('../../configs/boekServer');

const { error } = require('console');

const {handel,getConfig} = loadTools;

// 封装任务
async function startServer() {
    let [gitErr,gitCloneStd] = await loadTools.handel(gitClone())
    if(gitErr){ throw gitErr; }
    //  启动服务,非异步存储
    startDocsify(bokeConfig.rootPath,bokeConfig.port);
    

}

// 克隆仓库
function gitClone() {
    return new Promise((resolve,reject)=>{
        let docPath = path.join(bokeConfig.rootPath, bokeConfig.repositoryName)
        console.log(docPath)
        console.log(fs.existsSync(docPath))
        if (fs.existsSync(docPath)) { return resolve(); } 
        let cd = exec(`git clone ${bokeConfig.cloneUrl}`, { cwd: bokeConfig.rootPath }, (err, stdout, stderr) => {
            if (err) {
                console.log(err)
                return reject(err);
            }
            console.log(stdout)
            console.log(`stdout`)
            console.log(`stderr`)
            console.log(stderr) 
            resolve(stderr);
        })
    })
}
// 启动服务
function startDocsify(rootPath,port){
    return new Promise((resolve,reject)=>{
        exec(`yarn docsify start ${rootPath} --port ${port}`, (err, stdout, stderr) => {
            if (err) {
                console.log(err)
                return reject(err)
            }
            console.log(stdout)
            console.log(`stdout`)
            console.log(`stderr`)
            console.log(stderr) 
            resolve(stderr)
        });
    })
}

// 生成侧边栏
async function updateSideBar(){
    let [configErr,config] = await handel(getConfig('./config'));
    if(configErr){return deadlyErrorHandel(configErr,'配置文件加载')}
    // 获取目录下的所有文件
    let dirs = loadFile(config.docPath,'',config.maxChildLevel);
    // console.log(dirs);
    // 排除目标文件
    dirs = excludePath(dirs,config.docPath,config.excludePath);
    // 过滤一级文件夹中没有子项的部分
    dirs = dirs.filter(val=>val.isDirectory?val.children.length>0:true);
    console.table(dirs);
    let siderbarString = await createSidebarString(dirs,config.basePath,config.docPath,config.isCreateTmpReadme);
    let sidebarTarget = path.join(config.sidebarTarget)
    let sideBar_md_exist =  await fs.existsSync(sidebarTarget);
    let [writeError,isWriteOk] = await handel(writePromise(sidebarTarget,siderbarString))
    if(writeError){ return deadlyErrorHandel(writeError,'写入文件失败') }
    console.log('侧边栏写入成功 1');
}


// 获取博客的配置
function bokeConfig(){

}

startServer();

module.exports = {
    startServer,
}