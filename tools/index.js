/*
 * @Description: 统一导出配置文件
 * @Autor: kindring
 * @Date: 2021-11-11 15:11:57
 * @LastEditors: kindring
 * @LastEditTime: 2021-11-12 16:20:25
 * @LastDescript: 
 */


let moduleExport = {
    date: require('./date'),
    log: require('./log'),
    sleep: require('./sleep')
}
module.exports = moduleExport;