/*
 * @Description: 休眠
 * @Autor: kindring
 * @Date: 2021-11-12 16:18:45
 * @LastEditors: kindring
 * @LastEditTime: 2021-11-12 16:19:53
 * @LastDescript: 
 */

function sleep(t) {
    t = t || 1
    return new Promise(resolve => {
        setTimeout(resolve, t)
    })
}


module.exports = sleep;