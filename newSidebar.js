/*
 * @Author: kindring
 * @Date: 2021-08-17 09:36:03
 * @LastEditTime: 2021-08-19 16:09:34
 * @LastEditors: Please set LastEditors
 * @Description: 自动加载侧边栏
 * @FilePath: \docsify\newSidebar.js
 */

const fs = require('fs');
const path = require('path');

// 配置文件
const config = require('./config');


// 1.遍历指定目录下的所有文件
// 2.判断是否为markdown文件
// 3.判断是否为文件夹,判断是否被忽略

/**
 * 根据文档加载侧边栏
 * @returns 
 */
async function getTargetDocs(){
    let [configErr,config] = await handel(getConfig('./config'));
    if(configErr){return deadlyErrorHandel(configErr,'配置文件加载')}
    // 获取目录下的所有文件
    let dirs = loadFile(config.docPath,'',config.maxChildLevel);
    // console.log(dirs);
    // 排除目标文件
    dirs = excludePath(dirs,config.docPath,config.excludePath);
    // 过滤一级文件夹中没有子项的部分
    dirs = dirs.filter(val=>val.isDirectory?val.children.length>0:true);
    console.table(dirs);
    let siderbarString = await createSidebarString(dirs,config.basePath,config.docPath,config.isCreateTmpReadme);
    let sidebarTarget = path.join(config.sidebarTarget)
    let sideBar_md_exist =  await fs.existsSync(sidebarTarget);
    let [writeError,isWriteOk] = await handel(writePromise(sidebarTarget,siderbarString))
    if(writeError){ return deadlyErrorHandel(writeError,'写入文件失败') }
    console.log('侧边栏写入成功');
    if(config.isLoadReadme){
        let ReadmeFileExist = await fs.existsSync(config.docPath,'README.md');
        if(ReadmeFileExist){
            let ReadmeFileData = fs.readFileSync(path.join(config.docPath,'README.md'))
            let [writeReadmeError] = await handel(writePromise(config.homeTarget,ReadmeFileData))
            if(writeReadmeError){ return deadlyErrorHandel(writeError,'替换README文件失败') }
             console.log('首页替换成功');
        }
    }
}
getTargetDocs();


async function createSidebarString(arrs,basePath,docPath,isCreateTmpReadme = false,level = 0){
    console.log('----------------')
    console.log(arrs)
    console.log('----------------')

    // 自动生成侧边栏结构
    let tmpLineStr = '';
    for (const item of arrs) {
        let line = ''
        if(item.isDirectory){
            let childrenStr = await createSidebarString(item.children,basePath,docPath,isCreateTmpReadme,level+1);
            // 判断当前路径下是否有README文件存在
            let menuReadmePath = path.join(docPath,item.path,'README.md');
            let menuReadme_md_exist =  await fs.existsSync(menuReadmePath);
            if(menuReadme_md_exist){
                line =  `${strRepeat('  ',level)}* [**${item.fileName}**](${path.join(basePath,item.path,'README.md')})\r\n`
            }else{
                line =  `${strRepeat('  ',level)}* **${item.fileName}**\r\n`
            }
            line += childrenStr
        }else{
            //不是文件夹的话直接生成数据
            line = `${strRepeat('   ',level)}* [${excludeExtName(item.fileName)}](${path.join(basePath,item.path)})\r\n`
        }
        tmpLineStr += line
    }
    return tmpLineStr;
}

/**
 * 排除数组中被排除的项,如果是文件则只保留md文件
 * @param {*} arr 数组
 * @param {*} docPath 基础路径
 * @param {*} excludePaths 排除的路径
 * @param {*} passExt 通过的文件后缀
 * 
 */
function excludePath(arr,docPath,excludePaths,passExt = 'md'){
    let resultsArr = [];
    for(let i=0;i<arr.length;i++)
    {
        if(excludePaths.some((val)=>{return isExclude(arr[i].path,val)})){
            continue;
        }
        let tmpObj = arr[i]
        // 判断是否为文件夹,然后判断是否为md文件
        let tmpPath = path.join(docPath,arr[i].path);
        if(arr[i].isDirectory){
            tmpObj.children = excludePath(arr[i].children,docPath,excludePaths,passExt);
            resultsArr.push(tmpObj);
        }else{
            if(getExtName(arr[i].fileName) == passExt ){
                resultsArr.push(tmpObj);
            }
        }
        // if(getExtName())
    }
    return resultsArr;
}

function isExclude(filePath,item){
    filePath = path.join(filePath)
    switch(typeof item){
        case 'string':
            if(filePath == item){
                return true;
            }
            break;
        case 'object':
            if(item.include){
                // console.log('排除路径')
                // console.info(item)
                // console.log(filePath)
                if(filePath.includes(item.path)){
                    return true;
                }
            }else {
                if(filePath == item.path){
                    return true;
                }
            }
            break;
        default:
            break;
    }
    return false;
}



/**
 * 通过递归读取文件夹结构
 * @param {String} dirPath 文档路径
 * @param {*} nowPath 根路径,基本不用管
 * @param {number} max_level 最大目录层级限制
 * @param {number} nowLevel 当前目录层级
 * @return {Array}
 */
function loadFile(dirPath,nowPath = '',max_level =2,nowLevel = 0){
    let dirsArray = [];
    if(nowLevel >= max_level){
        return dirsArray
    }
    // 当前的路径
    let nowDirPath = path.join(dirPath,nowPath);
    let dirs = fs.readdirSync(nowDirPath).forEach((file,i)=>{
        let _obj = {
            path: '',// 文件相对于文档路径下的
            fileName: file,// 文件名
            isDirectory: false,// 是否为文件夹
            children: [],//子文件夹
        }
        let filePath = path.join(nowPath,file);
        let absoluteFilePath = path.join(dirPath,filePath);
        if(fs.lstatSync(absoluteFilePath).isDirectory()){
            //是文件夹
            _obj.isDirectory = true;
            // 递归查找子文件夹
            _obj.children = loadFile(dirPath,filePath,max_level,nowLevel+1)
        }else{

        }
        _obj.path = filePath;
        dirsArray.push(_obj);
    })
    return dirsArray;
}

/**
 * 致命错误处理函数
 * @param {*} error 出现的错误 
 * @param {*} comment 错误的描述
 */
function deadlyErrorHandel(error,comment){
    console.error(comment);
    console.error(error.message);
    //生成日志
}

/**
 * 获取配置文件
 * @param {String,Url} configPath 配置文件路径
 * @param {Number} time 延迟的毫秒数
 * @returns Promise
 */
function getConfig(configPath,time = 5){
    return new Promise((resolve,reject)=>{
        try {
            //获取目录
            let config = require(configPath);
            setTimeout(()=>{
                delete require.cache[require.resolve(configPath)]
                resolve(config);
            },time);
        } catch (error) {
            reject(error)
        }
        
    })
}

/**
 * 重复指定字符串一定次数
 * @param {*} s 要重复的字符串
 * @param {*} n 重复的次数
 * @returns 重复了n次的字符串
 */
function strRepeat(s,n){
    let _reS = ''
    for(var i = 0;i<n;i++){_reS+=s}
    return _reS;
}

/**
 * 删除文件
 * @param {String,Buffer,Url} filePath 要删除的文件路径
 * @returns Promise
 */
function unlinkPromise (filePath){
    return new Promise((resolve,reject)=>{
        fs.unlink(filePath,function(err){
            if(err){
                reject(err)
            }else{
                resolve(true)
            }
        })
    })
}

/**
 * 删除文件夹
 * @param {String,Buffer,Url} dirPath 要删除的文件夹路径
 * @returns Promise
 */
function rmdirPromise (dirPath){
    return new Promise((resolve,reject)=>{
        fs.rmdir(dirPath,(err)=>{
            if(err){
                reject(err);
            }else{
                resolve(true);
            }
        })
    })
}

/**
 * 写入文件
 * @param {String,Buffer,Url} dirPath 要写入的文件路径
 * @param {String,Buffer} data 要写入的文件路径
 * @returns Promise
 */
function writePromise (filePath,data,options){
    return new Promise((resolve,reject)=>{
        fs.writeFile(filePath,data,options,function(err){
            err?reject([err]):resolve([null,true])
        })
    })
}
/**
 * 协助处理promise
 * @param {*} promise 
 * @returns Promise resolve[err,val]
 */
function handel(promise){
    return new Promise((resolve,reject)=>{
        promise.then((val)=>{
            resolve([null,val])
        }).catch((err)=>{
            resolve([err,null])
        })
    })
}


/**
 * 获取文件后缀名
 * @param {String} fileName 文件名
 */
function getExtName(fileName){
    return fileName.substr(fileName.lastIndexOf('.')+1);
}

/**
 * 排除文件后缀名
 * @param {*} fileName 文件名
 * @returns 
 */
function excludeExtName(fileName){
    return fileName.substr(0,fileName.lastIndexOf('.'));
}