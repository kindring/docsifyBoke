/*
 * @Description: 处理docsify进程
 * @Autor: kindring
 * @Date: 2021-11-12 14:44:22
 * @LastEditors: kindring
 * @LastEditTime: 2021-11-12 16:27:48
 * @LastDescript: 
 */
const { spawn, exec } = require('child_process');
const tools = require('../../tools/index');
let info = tools.log('all', 'docsifyServer', 0);
let errLog = tools.log('all', 'docsifyServer', 1);

class Docsify {
    // 指定端口
    // 指定路径
    constructor(port, rootPath) {
        this.port = port;
        this.rootPath = rootPath;
        this.exec;
        this.isRun;
        this.start
    }

    // 启动服务,如何告知软件已经退出
    async run(cb) {
        if (this.isRun) {
            return;
        }
        //  创建进程
        let swap = spawn(`yarn docsify start ${this.rootPath} --port ${this.port}`, {
            // stdio: 'inherit',
            // 仅在当前运行环境为 Windows 时，才使用 shell
            shell: process.platform === 'win32'
        });
        let _timer = null;
        let iscb = cb ? false : true;
        // 服务退出
        let processExit = (type, data) => {
            this.isRun = false;
            this.exec = null;
            if (!iscb) {
                cb({ message: '服务启动失败' });
                iscb = true;
            }
            // info(data);
            switch (type) {
                case 'error':
                    errLog('docsify程序错误');
                    break;
                case 'exit':
                    info('docsify主动退出');
                    break;
                case 'disconnect':
                    info('docsify断开连接');
                    break;
                default:
                    //位置的关闭方式
                    break;
            }
        }
        swap.addListener('error', (err) => {
            // console.log('进程错误');
            processExit('error', err);
            if (!iscb) {
                cb(err);
                iscb = true;
            }
        });
        swap.addListener('disconnect', (data) => {
            // console.log('进程断开连接');
            processExit('disconnect', data);
        });
        swap.addListener('exit', (data) => {
            // console.log('进程主动退出');
            processExit('exit', data);
        });
        swap.stdout.on('data', data => {
            // console.log('进程输出');
            let str = data.toString();
            console.log('stdout 输出:', str);
            let reg = /Listening at http\:\/\/localhost\:\d+/
                // 成功启动服务
            if (reg.test(str)) {
                info('服务启动成功');
                this.isRun = true;
                this.exec = swap;
                if (!iscb) {
                    cb();
                    iscb = true;
                }
            }
        });
        this.exec = swap;

    }

    // 关闭docsify
    async stop() {
        // 关闭
        if (this.exec) {
            // 等待
            this.exec.kill('SIGHUP');
        }
    }

    async restart() {
        this.stop();
        await tools.sleep(5 * 1000)
        this.start();
    }
    setConfig(port, rootPath) {
        this.port = port || this.port;
        this.rootPath = rootPath || this.rootPath;
    }
}

// let d = new Docsify(3001, 'E:/project/docsifyBoke/boke')

module.exports = Docsify;