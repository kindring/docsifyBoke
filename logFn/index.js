/*
 * @Author: your name
 * @Date: 2021-08-19 16:56:49
 * @LastEditTime: 2021-11-11 16:17:49
 * @LastEditors: kindring
 * @Description: 统一处理log
 * @FilePath: \docsifyBoke\logs\index.js
 */

const fs = require('fs');
const path = require('path');
const tools = require('../tools/index');

let dateTool = tools.date;
let logs = {}; // 日志操作中心
// 前缀 类型 信息 时间
class Log {
    constructor(preName, dirPath) {
        this.dirPath = dirPath;
        this.preName = preName;
        // 
    };

    // 
    appendLogLine(str, date) {
        let logPath = path.join(this.dirPath, this.preName, dateTool.dateFormat(date, ` yyyy-MM-DD.log`));
        let isExit = fs.existsSync(logPath);
        if (isExit) {
            fs.appendFile(logPath, str, (err) => {
                if (err) {
                    console.error('日志文件追加失败');
                    return
                }
            })
        } else {
            fs.writeFile(logPath, str, (err) => {
                if (err) {
                    console.error('日志文件创建失败');
                    return
                }
            })
        }
    };

    // 根据类型构建
    saveLog(type, msg, mode) {
        pre = pre || this.preName;
        let strTemplate = '-MODEL- -TYPE- -MSG- -DATE- ;';
        let date = new Date();
        let logStr = strTemplate
            .replace('-MODEL-', mode)
            .replace('-TYPE-', type)
            .replace('-MSG-', msg)
            .replace('-DATE-', dateTool.dateFormat(date, `yyyy-MM-DD`));
        this.appendLogLine(logStr, date);
    }

}

/**
 * 初始化并且创建一个日志对象
 * @param {string} pre 文件前缀,
 * @param {string} type 日志类型
 * @param {string} mode 模块名
 */
function log(pre, mode, type) {
    return function(msg) {
        logs[pre].saveLog(type, msg, mode);
    }
}

// 创建日志处理函数,指定路径和前缀
log.init = function(pre, dirPath) {
    if (!logs[pre]) {
        // 不存在该日志对象
        logs[pre] = new Log(pre, dirPath);
    }
    return logs[pre];
}



module.exports = log;