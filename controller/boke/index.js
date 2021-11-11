/*
 * @Author: your name
 * @Date: 2021-08-25 17:41:05
 * @LastEditTime: 2021-11-11 18:10:03
 * @LastEditors: kindring
 * @Description: 博客控制温度
 * @FilePath: \docsifyBoke\controller\boke\index.js
 */
const boke = require('./boke');

/**
 * 获取配置
 */
function config() {
    return new Promise((resolve) => {
        let config = boke.config.getConfig()
        resolve(config);
    })
}

/** 设置配置
 * 
 * @param {*} key 
 * @param {*} val 值
 * @returns 
 */
function setConfig(key, val) {
    return new Promise((resolve, reject) => {
        boke.config.setConfig(key, val)
        boke.config.saveConfig()
    })
}


// 启动docsify服务器
function startDocsify() {
    return new Promise(async(resolve, reject) => {
        let config = boke.config.getConfig()
        let res = await boke.startServer(config.docsifyPath, config.port);
        resolve(res);
    })
}


module.exports = {
    config,
    setConfig,
    startDocsify
}