/*
 * @Description: 精准定时js
 * @Autor: kindring
 * @Date: 2021-09-18 17:15:29
 * @LastEditors: kindring
 * @LastEditTime: 2021-12-23 15:07:06
 * @LastDescript: 
 */

/** 繁杂的闹钟逻辑 (可以被用作于控制逻辑)
 * 1. 能够在指定时间执行指定任务 (案例:设定一个闹钟将在 2022年1月31日24时0分 执行开灯任务
 * 2. 也能够设定在满足一定规则下一直重复的任务.
 * 3. 允许设定任务重复次数 (指一个任务可以被重复执行多少次,比如提醒车票出发的闹钟,一般只需要指定时间即可),允许设定每次执行任务的重复次数(指手机起床闹钟会间隔一段时间再次进行闹铃)
 * 4. 能够延长闹钟的执行时间 (指能够将指定的闹钟延后一定时间,只对下一次执行有效,即当天的某个闹钟有效) 
 * 5. 能够重新设置某个闹钟的 开始时间 与 要执行的任务
 * 6. 允许设定闹钟执行规则,比如获取天气,以及是否为工作日来选择是否执行闹钟,以及每周的第几天执行闹钟
 * 7. 允许暂时关闭闹钟,比如你觉得一个 每天早上执行开灯任务的闹钟 很烦,但是后面又需要这个闹钟,就可以选择暂时的关闭该闹钟,关闭指定天数,或者指定次数.
 * 8. 能够彻底关闭某个指定任务
 * 9. 能够在软件重启后继续开始计时,到达指定目标
 */


/**
 * 场景伪逻辑
 * 1. 设定一个闹钟在多少天后的几点几分几秒执行任务
 * 2. 设定一个闹钟在
 */


// 指定时间执行任务的定时器
// 1. 
// 闹钟开始时间年月日时分秒
// 闹钟的重复规则

// 节假日执行.(此类型只能精确到分钟,不允许精确到秒)
// 法定节假日 周末节假日(自动检测当前日期是否为节假日,是则执行,不是则不执行)
// 工作日 节假日
// 法定工作日(包括调休) 节假日 周末 法定节日
// 每周的星期一二三四执行等

// 定时重复(不分天)
// 每隔多少秒重复一次
// 最长重复间隔为 10天 即864000秒 最短重复间隔 1 秒,精度
// 重复次数 闹钟运行多少天后就会自己关闭 int 默认0 不自动关闭

// 日重复型闹钟 选择时分秒即可
// 定时重复型闹钟 输入重复间隔,以秒为单位

// 时钟数据
let timeInteface = {
    repeatRule: {
        type: 'week', // week每周星期几 worker节假日 timeRepeat定时重复
        weekRepeat: [1, 2, 3, 4, 7], //每周的周几重复,多选
    },
    startTime: '', // 每日重复的闹钟的启动时间 
    intervalTime: '', // 定时重复闹钟间隔时间 50h15m30s重复一次
    repeatNum: 0, //闹钟已经执行次数  程序计数 *
    repeatMaxNum: 0, //闹钟的重复次数 默认0 无限循环执行 

    // 闹钟每次执行的任务
    task: {
        echo: false, //闹钟是否会自动重复执行任务,在一个比较短的时间内
        echoInterval: '5m', //闹钟回响时间间隔 最大值 2h 最小值 1m
        echoNum: 0, //闹钟单次已经重复次数 程序生成 *
        echoMaxNum: 5, //闹钟单次重响次数 响5次就自行关闭闹钟
        fn() {}, // 要执行的任务
    }
}


let testFn = function(params) {
    console.log('闹钟响了');
};


// 定时类型 重复执行类型

// 2d3h45m1s


// 每次校准时间,将计时器校准到相对标准的时间
class Time {
    constructor() {
        this.timeTask = {}
        this.timeId = 0
        this.Interval = 1000; // 间隔时间100毫秒
        this.nextInterval = 100; //下一次闹钟执行的时间
        this.checkTime = '1h'; //间隔1小时内的闹钟每次都检查
        this.tick();
        this.clocks = []; //闹钟列表
        this.comingClocks = []; //马上将会执行的任务id

    }

    // 每一tick执行的操作
    tick() {
        setTimeout(() => {
            let nowDate = Date.now()
            nowDate = this.Interval - (nowDate % this.Interval)
            this.nextInterval = nowDate
                // 查看是否需要执行任务
            this._checkClock()
            this.tick();
        }, this.nextInterval);
    }

    // 新增闹钟
    addClock(item) {
        this.timeId++;
        item.type = item.type || 'repeat'
        switch (item.type) {
            // 时间重复类型
            case 'repeat':
                this.clocks.push(
                    _createTimeRepeatClock({
                        ...item,
                        id: this.timeId
                    })
                );
                break;
            default:
                break;
        }
        return this.timeId
    }
    _createTimeRepeatClock(item) {
        item.repeatTime = item.repeatTime || item.time || ''
        let obj = {
            type: 'timeRepeat',
            repeatDate: this._parseTime(item.repeatTime),
            nextRunDate: null, //下次执行时间
            isRun: false, //是否已经执行
            enable: true, //闹钟启用状态
        }
        return obj
    }

    // 检查将近的闹钟是否到达指定时间,到达指定时间进行
    _checkClock() {
        this.comingClocks.forEach((clock) => {
            clock
        })
    }

    /**
     * 从文本中获取解析字符串
     * @param {*} str 
     * @returns 
     */
    _parseTime(str) {
        let obj = {}
        let regNum = /\d|[零一二两三四五六七八九]/,
            regDay = /d|dd|天/,
            regHour = /h|hh|时|小时/,
            regMinute = /m|mm|分|分钟/,
            regSecond = /s|ss|秒/,
            regMillisecond = /ms|毫秒/,
            regColon = /\:/

        let tmpNum = ''
        let tmpStr = ''
        let ColonStr = ''
        for (var s of str) {
            // console.log(s);
            if (regNum.test(s)) {
                // 只能匹配前面结束的,无法把字符全部处理
                if (tmpStr) {
                    // console.log('数字:' + tmpNum);
                    if (regMillisecond.test(tmpStr)) {
                        obj['ms'] = tmpNum
                    } else if (regDay.test(tmpStr)) {
                        obj['day'] = tmpNum
                    } else if (regHour.test(tmpStr)) {
                        obj['hour'] = tmpNum
                    } else if (regMinute.test(tmpStr)) {
                        obj['minute'] = tmpNum
                    } else if (regSecond.test(tmpStr)) {
                        obj['second'] = tmpNum
                    } else if (regColon.test(tmpStr)) {
                        ColonStr += ColonStr ? `:${tmpNum}` : tmpNum
                    }
                    tmpNum = s
                    tmpStr = ''
                } else {
                    tmpNum += `${s}`
                }
            } else {
                tmpStr += s
            }
        }
        if (tmpNum && !tmpStr) {
            ColonStr += ColonStr ? `:${tmpNum}` : tmpNum
        }
        // 处理最后的连续字符
        if (regMillisecond.test(tmpStr)) {
            obj['ms'] = tmpNum
        } else if (regDay.test(tmpStr)) {
            obj['day'] = tmpNum
        } else if (regHour.test(tmpStr)) {
            obj['hour'] = tmpNum
        } else if (regMinute.test(tmpStr)) {
            obj['minute'] = tmpNum
        } else if (regSecond.test(tmpStr)) {
            obj['second'] = tmpNum
        } else if (regHour.test(tmpStr)) {
            obj['hour'] = tmpNum
        } else if (regColon.test(tmpStr)) {
            ColonStr += ColonStr ? `:${tmpNum}` : tmpNum
        }

        if (ColonStr) {
            obj['ColonStr'] = ColonStr
        }
        // 数据合法化
        return this.dateToNorm(obj)
    }
    _dateToNorm(obj) {
        let keys = ['ms', 'second', 'minute', 'hour', 'day']
        let carry = 0;
        //从毫秒开始计算
        if (obj['ms']) {
            carry = Math.floor(obj['ms'] / 1000)
            obj['ms'] = obj['ms'] % 1000
        } else {
            obj['ms'] = 0
        }

        // 计算秒
        if (obj['second']) {
            obj['second'] = (obj['second'] - 0) + carry
            carry = Math.floor(obj['second'] / 60)
            obj['second'] = (obj['second'] % 60)
        } else {
            obj['second'] = 0 + carry
            carry = 0
        }

        // 计算分
        if (obj['minute']) {
            obj['minute'] = (obj['minute'] - 0) + carry
            carry = Math.floor(obj['minute'] / 60)
            obj['minute'] = (obj['minute'] % 60)
        } else {
            obj['minute'] = 0 + carry
            carry = 0
        }

        // 计算小时
        if (obj['hour']) {
            obj['hour'] = (obj['hour'] - 0) + carry
            carry = Math.floor(obj['hour'] / 24)
            obj['hour'] = (obj['hour'] % 24)
        } else {
            obj['hour'] = 0 + carry
            carry = 0
        }
        // 计算天
        if (obj['day']) {
            obj['day'] = obj['day'] - 0 + carry
        } else {
            obj['day'] = 0 + carry
            carry = 0
        }
        return obj
    }
}

let t = new Time();

// t.addClock({
//     type: 'repeat', //重复类型 天重复 
//     repeatTime: '1分钟', //重复时间
//     fn: testFn
// })

// t.addClock({
//     repeatTime: '10秒', //重复时间
//     fn: () => {
//         console.log('10秒自动执行任务')
//     }
// })



// console.log(_parseTime('2天3h45分25秒'));
// console.log(_parseTime('2d3小时45m'));
// console.log(_parseTime('02天03小时45分15秒300毫秒'));
// console.log(_parseTime('02天03小时45分15'));
// console.log(_parseTime('5天79小时'));
// console.log(_parseTime('79小时65分'));
// console.log(_parseTime('130分钟2000毫秒'));
// console.log(_parseTime('1130毫秒'));
// console.log(_parseTime('130ms'));










//`2天3h45分15秒`

`   
    3.20 500
    3.21 1830
    3.22 50
    4.15 1158
    5.15 1470
    6.15 1486
    7.15 1470
    8.15 1523
    9.15 1598

daily: 30
    5 morning
    15 noon
    15 night
    10 snack
month: 1 month
    400 rent
    200 water and electricty
    130 china telecom
    40 china unicom
    50 network
    100 public transport
    500 week pay
    1000 jingdong repayment
    1450 huabei repayment

oneMonth: 5220

huabei: 2000 + 3150
675+740 1415
baitiao: 1150
`