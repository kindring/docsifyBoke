/*
 * @Author: kindring
 * @Date: 2021-08-25 14:18:54
 * @LastEditTime: 2021-11-11 18:18:22
 * @LastEditors: kindring
 * @Description: 博客处理
 * @FilePath: \docsifyBoke\controller\boke.js
 */
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path')

const loadTools = require('../../loadTool')

// 导入加载配置文件
const Config = require('./config')

const { error } = require('console');

const { handel, getConfig, loadFile, excludePath, excludeExtName, strRepeat } = loadTools;

const bokeConfigController = new Config();
let _bokeConfig = null;
let isLoaded = false;
let docsifyExec = null;
bokeConfigController.onloaded = function() {
    isLoaded = true;
    _bokeConfig = bokeConfigController.getConfig();
    startServer(bokeConfig);
}

// 封装任务
async function startServer(bokeConfig) {
    bokeConfig = bokeConfig || _bokeConfig
        // 克隆任务
    let [gitErr, gitCloneStd] = await loadTools.handel(gitClone(bokeConfig))
    let [gitPullErr, gitPullStr] = await loadTools.handel(gitPull(bokeConfig))
    if (gitErr) { throw gitErr; }
    console.log(gitPullErr);
    if (gitPullStr) { throw gitPullErr; }
    //  启动服务,非异步存储
    startDocsify(bokeConfig.rootPath, bokeConfig.port);
    updateSideBar(bokeConfig)
}

// 克隆仓库
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

// 拉取最新倉庫
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

// 启动服务
function startDocsify(rootPath, port) {
    return new Promise((resolve, reject) => {
        console.log(`启动boke -- port:${port}`);
        if (docsifyExec) {
            return resolve({ port: docsifyPort })
        }
        exec(`yarn docsify start ${rootPath} --port ${port}`, (err, stdout, stderr) => {
            if (err) {
                console.log(err)
                return reject(err)
            }
            console.log(stdout)
            console.log(`stdout`)
            console.log(`stderr`)
            console.log(stderr)
        });
        docsifyExec = exec;
        docsifyPort = port;
        resolve({
            port,
        })
    })
}


// 生成侧边栏
async function updateSideBar(bokeConfig) {

    // 获取目录下的所有文件
    let dirs = loadFile(bokeConfig.docPath, '', bokeConfig.maxChildLevel);

    // console.log(dirs);
    // 排除目标文件
    dirs = excludePath(dirs, bokeConfig.docPath, bokeConfig.excludeExtName);
    // console.log(dirs);

    // 过滤文件夹
    dirs = dirs.filter(val => val.isDirectory ? val.children.length > 0 : true);
    console.table(dirs);
    let siderbarString = await createSidebarString(dirs, bokeConfig.repositoryName, bokeConfig.docPath, bokeConfig.isCreateTmpReadme);
    let sidebarTarget = path.join(bokeConfig.rootPath, bokeConfig.sidebarTarget)
    let sideBar_md_exist = await fs.existsSync(sidebarTarget);
    console.log(sidebarTarget);
    let [writeError, isWriteOk] = await handel(writePromise(sidebarTarget, siderbarString))
    if (writeError) { return deadlyErrorHandel(writeError, '写入文件失败') }
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
async function createSidebarString(arrs, basePath, docPath, isCreateTmpReadme = false, level = 0) {
    // console.log('----------------')
    // console.log(arrs)
    // console.log('----------------')

    // 自动生成侧边栏结构
    let tmpLineStr = '';
    for (const item of arrs) {
        let line = ''
        if (item.isDirectory) {
            let childrenStr = await createSidebarString(item.children, basePath, docPath, isCreateTmpReadme, level + 1);
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
function writePromise(filePath, data, options) {
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
function deadlyErrorHandel(error, comment) {
    console.error(comment);
    console.error(error.message);
    //生成日志
}


module.exports = {
    startServer,
    config: bokeConfigController,
    gitConfig: bokeConfigController.getConfig
}