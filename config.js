/*
 * @Author: your name
 * @Date: 2021-08-17 09:35:08
 * @LastEditTime: 2021-08-18 17:15:27
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \docsify\config.js
 */
const path = require('path');
// 文档文件夹
let basePath = './md-';
// 文档文件夹下边排除的文件路径,以及文件夹路径
let excludePath = ['.git','README.md'];


// 子文件夹层级 从文档文件夹开始,文档文件夹为1
let maxChildLevel = 3;

// 文档首页目录 其中的内容自动加载至目录下的README中
let homeDoc = 'README.md';
// 自动遍历目录生成的首页文件
let tmpReadme = 'M__README_MD.md';
// 侧边栏
let sidebarTarget = "./_sidebar.md"
// http文件
let indexTarget = "./index.html"
// 首页
let homeTarget = "./HOME.md"


// 是否生成临时的首页文件
let isCreateTmpReadme = false;
// 是否自动加载
let autoLoadIndex = true;

excludePath.push({
    path:tmpReadme,
    include:true,//目录中包含此字符串即可
})
excludePath.push({
    path:homeDoc,
    include:true,//目录中包含此字符串即可
})
module.exports = {
    basePath,//目录前置文件夹
    autoLoadIndex, // 自动加载doc里首页的README文件,
    docPath : path.join(__dirname,basePath),//文档存储文件夹
    excludePath,
    maxChildLevel,
    homeDoc,
    tmpReadme,
    sidebarTarget,
    homeTarget,
    isCreateTmpReadme
}