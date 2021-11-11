/*
 * @Author: your name
 * @Date: 2021-08-25 17:41:05
 * @LastEditTime: 2021-11-11 17:04:01
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

// 重启服务
function restartDocsify() {
    // 使用
}

// 启动docsify服务器
function startDocsify() {

}


module.exports = {
    config
}