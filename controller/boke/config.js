/*
 * @Description: 操作博客配置文件
 * @Version: 1.0
 * @Autor: kindring
 * @Date: 2021-08-31 17:52:23
 * @LastEditors: kindring
 * @LastEditTime: 2021-09-08 14:33:12
 */

const fs = require('fs')
const { resolve } = require('path')
const path = require('path')
const loadTools = require('../../loadTool')
const { handel, getConfig } = loadTools

// 配置文件路径,使用基础配置文件


class Config {
    constructor() {
        this.config = this.baseConfig
        this.configsUrl = '../../configs/boke.json'
        this.loadConfig()
    }
    baseConfig = {
        port: 8988,

        docsifyPath: '/boke', //博客文件的目录
        repositoryName: 'doc', // github仓库目录
        cloneUrl: 'url', // git 仓库地址
        header: 'master',
        excludeExtName: ['.git', 'README.md'],
        homeTarget: 'README.md', //首页文件位置,只基于doc目录下的文件来进行处理
        sidebarTarget: './_sidebar.md',
        isCreateTmpReadme: false,
        tmpReadmeName: 'M__README_MD.md',
        maxChildLevel: 4,
        plugin: [], //使用的插件
    }


    positionMap = {
            /** body后面 */
            bodyEnd: 'body后面',
            /** body前面 */
            bodyStart: 'body前面',
            /** docsify前面 */
            docsifyStart: 'docsify前面',
            /** docsify后面 */
            docsifyEnd: 'docsify后面'
        }
        // 插件表.
    plugin = {
        'gittalk': {
            name: '评论插件',
            descript: '采用github账号实现评论功能',
            lean: '', //url地址
            script: [{　
                position: this.positionMap.docsifyStart,
                url: '//unpkg.com/docsify/lib/plugins/gitalk.min.js'
            }, {　
                position: this.positionMap.docsifyStart,
                url: '//unpkg.com/gitalk/dist/gitalk.min.js'
            }],
            styles: [],
            config: {
                clientID: 'a75cc685e76dcef94f3b',
                clientSecret: '5abfe9c8072fef73b0b1a3e63e0fddda45fab237',
                repo: 'https://github.com/kindring/md-',
                owner: 'kindring',
                // admin: ['Github repo collaborators, only these guys can initialize github issues'],
                // facebook-like distraction free mode
                distractionFreeMode: false
            },
            // 代处理函数
            handel: {

            }
        }
    }



    // 加载配置文件
    loadConfig() {
        return new Promise(async resolve => {
            let [configErr, config] = await handel(getConfig(require.resolve(this.configsUrl)))
            if (configErr) {
                // 配置文件加载错误,直接生成一个新的配置文件
                this.saveConfig()
                config = {}
                console.log(configErr);
            }
            // 填充配置文件
            config = {...this.baseConfig, ...config }
                // config.excludeExtName
            config.excludeExtName.push({
                path: config.tmpReadmeName,
                include: true, //目录中包含此字符串即可
            })

            config.excludeExtName.push({
                path: config.tmpReadmeName,
                include: true, //目录中包含此字符串即可
            })

            // 扩展一些常用的配置文件
            config.rootPath = path.join(__dirname, '../../' + config.docsifyPath)
            config.docPath = path.join(config.rootPath, config.repositoryName)
            this.config = config
            this.onloaded()
            resolve();
        })
    }

    getConfig() {
        return this.config;
    }

    saveConfig() {
        return new Promise((resolve, reject) => {
            // 保存当前的配置,持久化
            let jsonConfig = JSON.stringify(this.config)
                // let isExits = fs.existsSync(this.configsUrl)
            fs.writeFile(path.join(__dirname, this.configsUrl), jsonConfig, (err) => {
                if (err) { return reject(err) }
                resolve()
            })
        })
    }

    // 设置配置
    setConfig(item, val) {
        this.config[item] = val;

    }


    onloaded() {}

}


module.exports = Config;