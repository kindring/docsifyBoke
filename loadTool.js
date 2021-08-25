/*
 * @Author: your name
 * @Date: 2021-08-19 16:05:37
 * @LastEditTime: 2021-08-25 16:47:27
 * @LastEditors: Please set LastEditors
 * @Description: 工具类
 * @FilePath: \docsifyBoke\until\index.js
 */
const fs = require('fs')
const path = require('path')

const moduleExports = {
    base: {
        autoRequire
    },
    file: {
        loadFile,
        excludePath,
        isExclude,
        getExtName,
        excludeExtName,
    },
    promise: {
        handel
    }
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
        }
        _obj.path = filePath;
        dirsArray.push(_obj);
    })
    return dirsArray;
}

/**
 * 排除数组中被排除的项,如果是文件则只保留指定后缀的文件
 * @param {Array} arr 数组 通过loadFile获取
 * @param {*} docPath 基础路径,用于确定文件真实路径
 * @param {Array} excludePaths 排除的路径
 * @param {Array | String} passExt 通过的文件后缀
 * 
 */
 function excludePath(arr,docPath,excludePaths,passExts = 'md'){
    // 排除文件夹
    if(typeof passExts == 'string'){ passExts = [passExts] }
    let resultsArr = [];
    arr.forEach(item=>{
        if (excludePaths.some((val)=>{return isExclude(item.path,val)}) ) return;
        // 判断是否为文件夹,然后判断是否为md文件
        if(item.isDirectory){
            item.children = excludePath(item.children,docPath,excludePaths,passExts);
            resultsArr.push(item);
        }else{
            if( passExts.some(extName=> extName == getExtName(item.fileName)) )resultsArr.push(item);
        }
    })
    return resultsArr;
}

/**
 * 是否匹配路径
 * @param {*} filePath 
 * @param {*} item 
 * @returns 
 */
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
                if(filePath.includes(item.path)){return true; }
            }else {
                if(filePath == item.path){return true; }
            }
            break;
        default:
            break;
    }
    return false;
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

// 自动加载js
function autoLoad(targetPath,baseExportObj,maxlevel,excludePaths,passExts){
    let files = loadFile(targetPath,'',maxlevel)
    files = excludePath(files,targetPath,excludePaths,passExts)
    // console.log(files);
    let exportObj = autoRequire(files,baseExportObj,targetPath);
    // console.log(obj);
    return exportObj;
}
// 自动加载文件目录
function autoRequire(fileArr,resultObj,targetPath){
    resultObj = resultObj||{};
    for (const file of fileArr) {
        if(file.isDirectory)
        {
            autoRequire(file.children,resultObj,targetPath)
        }else{
            let requireObj = require(path.join(targetPath,file.path))
            if(requireObj){
                let key = excludeExtName(file.fileName);
                let tmpObj = {};
                // 如果返回的是函数的话则尝试自动执行,如果返回值还是没有的话则抛弃掉该插件
                if(typeof requireObj == 'function'){
                    try {
                        let fnResult = requireObj();
                        if(typeof fnResult == 'object'){ 
                            if(fnResult.key)key = fnResult.key;
                            tmpObj = fnResult;
                        }else{
                            console.error(`文件无法自动加载,文件路径: ${file.path}`);
                        }
                    } catch (error) {
                        throw error;
                    }
                }else if(typeof requireObj == 'object'){
                    if(requireObj[key])key = requireObj.key;
                    tmpObj = requireObj;
                }
                // 如果当前key对应的对象没有值则初始化值
                if(!resultObj[key]){resultObj[key] = {}}
                resultObj[key] = Object.assign(resultObj[key],tmpObj);
            }
            
        }
    }
    return resultObj;
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
// autoLoad(__dirname,moduleExports,4,['index.js'],'js');
// 自动加载模块导出
module.exports = {
    handel,
    autoLoad,
    autoRequire,
    loadFile,
    excludePath,
    isExclude,
    getExtName,
    excludeExtName,
    getConfig,
};
