/*
 * @Author: kindring
 * @Date: 2021-08-25 14:34:12
 * @LastEditTime: 2021-08-25 17:46:01
 * @LastEditors: Please set LastEditors
 * @Description: 博客的配置文件
 * @FilePath: \docsifyBoke\configs\boekServer.js
 */
const path = require('path');
const plugins = require('./plugins');
// docsify根目录
const docsifyPath = '../boke'
// 文档仓库名字
const repositoryName = 'md-'
// 文档文件夹下边排除的文件路径,以及文件夹路径
let excludeExtName = ['.git','README.md'];
// 子文件夹层级 从文档文件夹开始,文档文件夹为1
let maxChildLevel = 3;

// 是否生成临时的首页文件,默认不生成
let isCreateTmpReadme = false;
// 自动遍历目录生成的首页文件,没什么效果
let tmpReadme = 'M__README_MD.md';

// 侧边栏的文件名
let sidebarTarget = "./_sidebar.md"

// 首页html的路径
let indexTarget = "./index.html"
// 首页内容路径
let homeTarget = "./README.md"

excludePath.push({
    path:tmpReadme,
    include:true,//目录中包含此字符串即可
})
// 从文档中排除README.md文件
excludePath.push({path:'README.md',include:true})
module.exports = {
    port: 8988,// docsify启动的服务端口
    cloneUrl:'git@github.com:kindring/md-.git',// git 仓库地址
    header:'master',// 需要加载的分支
    rootPath:path.join(__dirname,docsifyPath),//docsify运行的根目录
    repositoryName,// 仓库名,也是文档目录的文字
    homeTarget,//首页路径,后续替换配置也是这个目录
    sidebarTarget,//侧边栏路径
    isCreateTmpReadme,//是否创建临时侧边栏
    tmpReadmeName,//创建的临时readme文件名称
    maxChildLevel,//自动加载的文件夹目录深度
    plugins:[],//使用的插件列表
}