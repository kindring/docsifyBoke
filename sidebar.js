/*
 * @Author: your name
 * @Date: 2021-08-17 09:35:08
 * @LastEditTime: 2021-08-17 11:40:04
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \docsify\sidebar.js
 */

const fs = require('fs');
const path = require('path');
const { maxChildLevel } = require('./config');
let config = require('./config')

let vmPath = [
]

// 获取目录结构,生成
async function loadSidebarItem(){
    let dirs = fs.readdirSync(config.docPath)
    loadDoc();
}

// 加载doc文件夹结构
async function loadDoc(){
    let dirs = fs.readdirSync(config.docPath)
    let level = 0;
    let max_level = config.maxChildLevel;
    for(let i in dirs){
        let isDirectory = fs.lstatSync(path.join(config.docPath,dirs[i])).isDirectory();
        if(config.excludePath.find((val)=>dirs[i] == val) || !isDirectory ){
            continue;
        }else{
            let doc = {
                path: '',
                fileName: dirs[i],
                name: dirs[i],
                isDirectory,
                children: getChildren('',dirs[i],0)
            }
            vmPath.push(doc);
        }
    }
    //console.info(vmPath);
    //renderSideBar();

    vmPath.forEach(async val=>{
        //console.log(val);
        
        //console.log(_str);
        val.children.forEach(item =>{
      //      console.log(item)
        })
    })
    let sidebarStr = ''
    for(let i = 0; i<vmPath.length ;i++){
        let _str = await audoLoad(vmPath[i],0);
        sidebarStr+=_str;
    }
//    console.log(sidebarStr);
    sideBar_md_exist =  await fs.existsSync('./_sidebar.md' );
    if(sideBar_md_exist){
        fs.unlink('./_sidebar.md',(err)=>{
            if(err){
                console.error(err)
                console.log('删除文件夹失败')
                return;
            }  
            fs.writeFile('./_sidebar.md',sidebarStr,(err)=>{if(err){console.log(err)}})
        });
    }else{
        fs.writeFile('./_sidebar.md',sidebarStr,(err)=>{if(err){console.log(err)}})
    }

}

// 生成sidebar
async function renderSideBar(){
    let str = "";
    let t = `\t`
    //console.log(vmPath);
    vmPath.forEach(val=>{
        if(val.isDirectory){
            str += `* ${val.name}\n`
            val.children.forEach(_val=>{
                if(_val.isDirectory){
                    _val.children.forEach(__val=>{
                        if(__val.isDirectory){
                            str += ``
                        }else{
                            str += `        * [${__val.name}](${path.join(config.basePath,__val.path,__val.fileName)})\n`
                        }
                    })
                }else{
                    str += `    * [${_val.name}](${path.join(config.basePath,_val.path,_val.fileName)})\n`
                }
            })
        }else{

        }
    })
  //  console.log(str);
}


async function audoLoad(_obj,_level){
    let sideBarStr = "";
    let forEachArr = "";
    let menu = "";
    let _str_line = "";
    //console.log(_obj)
//    console.log(_level)

    // 判断README.md是否存在
    // 存在
    //  使用README.md
    // 不存在
    //  重新生成 __README_MD 并使用
    // 获取当前路径的名称
    let _path = _obj.isDirectory?path.join(config.basePath,_obj.path,_obj.fileName) :path.join(config.basePath,_obj.path);
    if(_obj.isDirectory){
        let README_Exist = await fs.existsSync(path.join(_path,'README.md') );
    if(_obj.children.length<=1){
        if(_obj.children.find(val=>{return val.name == 'M__README_MD'}) ){
  //          console.log('123')
            return '';
        }
    }
    if(README_Exist){
        menu += `${strRepeat('  ',_level)}* [${_obj.name}](${path.join(_path,'/README.md')})\n`
    }else{
        //let [delErr,delR] = await handel(fs.rmSync(path.join(config.docPath,_obj.path,'__README_MD.md')));
        menu += `${strRepeat('  ',_level)}* [${_obj.name}](${path.join(_path,'/M__README_MD.md')})\n`
        let _README_MD_Exist = await fs.existsSync(path.join(_path,'/M__README_MD.md') );
        // 自动化创建文件夹
        if(_README_MD_Exist){
            fs.unlink(path.join(_path,'/M__README_MD.md'),(err)=>{
                if(err){
                    console.error(err)
                    console.log('创建文件夹')
                }   
            });
        }
        let readme_str = `# ${_obj.name}\n`;
        _obj.children.forEach(async val=>{
            if(_obj.children.find(val=>{return val.name == 'M__README_MD'})  || _obj.children.find(val=>{return val.name == 'README'}) ){
            }else{
                readme_str +=  `## [${val.name}](${path.join(config.basePath,val.path,val.fileName)})\n`
            }
        })
        fs.writeFile(path.join(_path,'/M__README_MD.md'),readme_str,(err)=>{if(err){console.log(err)}})
    }
    }
    
    

    if(_level>config.maxChildLevel){
        return sideBarStr;
    }
    if(_level>=1){
        console.log('子文件夹获取中')
    //    console.log(_obj)
    }
    sideBarStr+=menu;
//    console.log(`当前文件夹${_obj.path}${_obj.fileName}    ${_obj.isDirectory}`)
    for(let x = 0;x<_obj.children.length;x++){
        val = _obj.children[x];
        if(val.isDirectory){
            if(val.children.length > 0){
                // 查看子文件夹是否有
                _str_line = '';
                //_str_line = `${strRepeat('  ',_level+1)}* [${val.name}](${path.join(config.basePath,val.path,val.fileName)})\n`
                _str_line += await audoLoad(val,_level+1) 
                _str_line += '\n';
            }
        }else{
            //单个文件渲染,确保不是首个文件
            if(val.name != 'README' && val.name != 'M__README_MD'){
                _str_line = `${strRepeat('  ',_level+1)}* [${val.name}](${path.join(config.basePath,val.path,val.fileName)})\n`
            }
        }
        sideBarStr += _str_line;
    }
    return sideBarStr;
}


// 获取子路径
function getChildren(_basePath,_path,_level){
    let dirs = fs.readdirSync(path.join(config.docPath,_basePath,_path))
    _level++;
    let docArr = [];
    for(let i in dirs){
        let isDirectory = fs.lstatSync(path.join(config.docPath,_basePath,_path,dirs[i])).isDirectory();
        
        if(!isDirectory){
            let ext = getExtName(dirs[i])
            if(ext == 'md'){
                docArr.push({
                    path: path.join(_basePath,_path),
                    fileName: dirs[i],
                    name: dirs[i].replace('.md',''),
                    isDirectory,
                    children: []
                });
            }
            
            continue;
        }

        if( config.excludePath.find((val)=>{ return (dirs[i] == path.join(_basePath,_path,dirs[i]))}) ){
            continue;
        }else{
            let doc = {
                path: path.join(_basePath,_path),
                fileName: dirs[i],
                name: dirs[i],
                isDirectory,
                children: getChildren(path.join(_basePath,_path),dirs[i],_level)
            }
            docArr.push(doc);
        }
    }
    return docArr;
}


/** 获取路径的后缀 */
function getExtName(str){
    var index= str.lastIndexOf(".");
    //获取后缀
    var ext = str.substr(index+1);
    return ext;
}

/** 重复字符串s n次 */
function strRepeat(s,n){
    let _reS = ''
    for(var i = 0;i<n;i++){_reS+=s}
    return _reS;
}
loadSidebarItem();


function handel(promise){
    return new Promise((resolve)=>{
        promise.then(val=>{resolve([null,val])}).catch(err=>{resolve([err,null])})
    })
}