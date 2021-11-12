/*
 * @Author: kindring
 * @Date: 2021-08-25 14:18:54
 * @LastEditTime: 2021-11-12 18:14:36
 * @LastEditors: kindring
 * @Description: 博客处理
 * @FilePath: \docsifyBoke\controller\boke.js
 */
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path')

const loadTools = require('../../loadTool')
const Docsify = require('./bokeServer')
    // 导入加载配置文件
const Config = require('./config')
const tools = require('../../tools/index');

let info = tools.log('all', 'docsifyServer', 0);
let errLog = tools.log('all', 'docsifyServer', 1);

const { handel, getConfig, loadFile, excludePath, excludeExtName, strRepeat } = loadTools;

const bokeConfigController = new Config();
let _bokeConfig = null;
let isLoaded = false;
let docsifyServer = new Docsify(bokeConfig.rootPath, bokeConfig.port);
bokeConfigController.onloaded = function() {
    isLoaded = true;
    _bokeConfig = bokeConfigController.getConfig();
    _startServer(_bokeConfig);
}

// 加载文件后默认启动服务
async function _startServer(bokeConfig) {
    bokeConfig = bokeConfig || _bokeConfig
        // 克隆任务
    let [gitErr, gitCloneStd] = await loadTools.handel(gitClone(bokeConfig))
    let [gitPullErr, gitPullStr] = await loadTools.handel(gitPull(bokeConfig))
    if (gitErr) { throw gitErr; }
    console.log(gitPullErr);
    if (gitPullStr) { throw gitPullErr; }
    //  启动服务,非异步存储
    // 启动服务
    docsifyServer.run();
    // 更新侧边栏文件
    updateSideBar(bokeConfig)
}

/**
 * 克隆指定仓库
 * @param {*} bokeConfig 
 * @returns 
 */
function gitClone(bokeConfig) {
    bokeConfig = bokeConfig || _bokeConfig
    return new Promise((resolve, reject) => {
        console.log(bokeConfig)
        console.log('----')
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

/**
 * 更新仓库
 * @param {*} bokeConfig 配置数据
 * @returns 
 */
function gitPull(bokeConfig) {
    bokeConfig = bokeConfig || _bokeConfig
    return new Promise((resolve, reject) => {
        console.log(bokeConfig)
        console.log('--拉取仓库新内容--')
        let docPath = path.join(bokeConfig.rootPath, bokeConfig.repositoryName)
        console.log(docPath)
        console.log(fs.existsSync(docPath))
        let gp = exec(`git pull`, { cwd: path.join(docPath) }, (err, stdout, stderr) => {
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

/**
 * 启动docsify服务
 * @returns 
 */
function startDocsify() {
    return new Promise((resolve, reject) => {
        docsifyServer.run((err) => {
            if (err) {
                reject(err);
                return errLog(`启动失败${err.message}`);
            }
            resolve(true);
        });
    })
}

/**
 * 停止docsify服务
 * @returns 
 */
function stopDocsify() {
    return new Promise((resolve, reject) => {
        docsifyServer.stop();
        resolve();
    })
}

/**
 * 重启docsify服务
 * @returns 
 */
function restartDocsify() {
    return new Promise(resolve => {
        docsifyServer.restart();
        resolve();
    })
}


// 生成侧边栏
async function updateSideBar(bokeConfig) {
    bokeConfig = bokeConfig || _bokeConfig;
    // 获取目录下的所有文件
    let dirs = loadFile(bokeConfig.docPath, '', bokeConfig.maxChildLevel);
    // 排除目标文件
    dirs = excludePath(dirs, bokeConfig.docPath, bokeConfig.excludeExtName);
    // 过滤文件夹
    dirs = dirs.filter(val => val.isDirectory ? val.children.length > 0 : true);
    let siderbarString = await _createSidebarString(dirs, bokeConfig.repositoryName, bokeConfig.docPath, bokeConfig.isCreateTmpReadme);
    let sidebarTarget = path.join(bokeConfig.rootPath, bokeConfig.sidebarTarget)
    let sideBar_md_exist = await fs.existsSync(sidebarTarget);
    let [writeError, isWriteOk] = await handel(_writePromise(sidebarTarget, siderbarString))
    if (writeError) { return _deadlyErrorHandel(writeError, '写入文件失败') }
    console.log('侧边栏写入成功 1');
}


/** 创建侧边栏文本内容
 * @param {*} arrs 
 * @param {*} basePath 
 * @param {*} docPath 
 * @param {*} isCreateTmpReadme 
 * @param {*} level 
 * @returns 
 */
async function _createSidebarString(arrs, basePath, docPath, isCreateTmpReadme = false, level = 0) {
    // console.log('----------------')
    // console.log(arrs)
    // console.log('----------------')

    // 自动生成侧边栏结构
    let tmpLineStr = '';
    for (const item of arrs) {
        let line = ''
        if (item.isDirectory) {
            let childrenStr = await _createSidebarString(item.children, basePath, docPath, isCreateTmpReadme, level + 1);
            // 判断当前路径下是否有README文件存在
            let menuReadmePath = path.join(docPath, item.path, 'README.md');
            let menuReadme_md_exist = await fs.existsSync(menuReadmePath);
            if (menuReadme_md_exist) {
                line = `${strRepeat('  ',level)}* [**${item.fileName}**](${path.join(basePath,item.path,'README.md')})\r\n`
            } else {
                line = `${strRepeat('  ',level)}* **${item.fileName}**\r\n`
            }
            line += childrenStr
        } else {
            //不是文件夹的话直接生成数据
            line = `${strRepeat('   ',level)}* [${excludeExtName(item.fileName)}](${path.join(basePath,item.path)})\r\n`
        }
        tmpLineStr += line
    }
    return tmpLineStr;
}



/**
 * 写入文件
 * @param {String,Buffer,Url} dirPath 要写入的文件路径
 * @param {String,Buffer} data 要写入的文件路径
 * @returns Promise
 */
function _writePromise(filePath, data, options) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, options, function(err) {
            err ? reject([err]) : resolve([null, true])
        })
    })
}

/**
 * 致命错误处理函数
 * @param {*} error 出现的错误 
 * @param {*} comment 错误的描述
 */
function _deadlyErrorHandel(error, comment) {
    //生成日志
    errLog(`致命错误${error.message}${comment}`)
}


module.exports = {
    config: bokeConfigController,
    gitConfig: bokeConfigController.getConfig
}