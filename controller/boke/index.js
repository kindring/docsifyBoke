/*
 * @Author: your name
 * @Date: 2021-08-25 17:41:05
 * @LastEditTime: 2021-09-08 18:03:10
 * @LastEditors: kindring
 * @Description: In User Settings Edit
 * @FilePath: \docsifyBoke\controller\boke\index.js
 */
const boke = require('./boke');
const

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

}


module.exports = {
    config
}