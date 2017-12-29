/**
 * Created by 王冬 on 2017/12/19.
 * QQ: 20004604
 * weChat: qq20004604
 */
var appVersion = window.navigator.appVersion
var appName = window.navigator.appName
var userAgent = window.navigator.userAgent

// 系统/机型
var system
// 浏览器
var browser
// 具体机型，不一定有
var telphone
// 错误信息
var err

// IE 11比较特殊，userAgent和appVersion都不一样
if (/rv:11/.test(appVersion)) {
    browser = 'IE 11'
    system = appVersion.match(/\([^;]+/)[0].replace('(', '')
} else if (/Microsoft Internet Explorer/.test(appName)) {
    // 如果是IE系列
    browser = 'IE '
    try {
        browser += appVersion.match(/MSIE[^;]+/)[0].replace(/MSIE /, '')
        system = appVersion.match(/Windows[^;]+/)[0]
    } catch (e) {
        console.log(e)
    }
}

// 最后最后没有匹配到系统，那么单独匹配
if (!system) {
    if (/Windows/.test(userAgent)) {
        system = userAgent.match(/Windows[^;]+/)[0]
    } else if (/iPhone OS/.test(userAgent)) {
        system = userAgent.match(/iPhone OS[^)]+/)[0]
    } else if (/Macintosh/.test(userAgent)) {
        system = 'Macintosh （可能是mac mini）'
    } else if (/Android/.test(userAgent)) {
        system = userAgent.match(/Android [^;]+/)[0]
    }
}

try {
    if (!browser) {
        // 优先级很重要
        if (/MicroMessenger/.test(userAgent)) {
            browser = userAgent.match(/MicroMessenger[^ ]+/)[0]
            browser += ' （微信浏览器）'
        } else if (/QQBrowser/.test(userAgent)) {
            browser = userAgent.match(/ \D?QQBrowser[^ ]+ /)[0].replace('/', ' ')
            browser += ' （QQ浏览器）'
        } else if (/UCBrowser/.test(userAgent)) {
            browser = userAgent.match(/UCBrowser[/0-9.]+/)[0].replace('/', ' ')
            browser += ' （UC浏览器）'
        } else if (/Chrome/.test(userAgent)) {
            browser = userAgent.match(/Chrome[/0-9.]+/)[0].replace('/', ' ')
        } else if (/Safari/.test(userAgent)) {
            browser = userAgent.match(/Safari[/0-9.]+/)[0].replace('/', ' ')
        }
    }
} catch (e) {
    err += 'system: ' + e
}

var telphoneArray = [
    'OPPO'
]
try {
    telphoneArray.forEach(function (item) {
        if (userAgent.indexOf(item) > -1) {
            var reg = new RegExp(item + '[^;]+')
            telphone = userAgent.match(reg)[0]
        }
    })
} catch (e) {
    err += ' 系统不支持forEach，估计是IE9以下系统'
}

// 本地时间
var addZero = function (str, length) {
    str = String(str);
    if (typeof str !== "string" || typeof length !== "number") {
        return str;
    }
    while (str.length < length) {
        str = "0" + str;
    }
    return str;
}
var formatDate = function (date) {
    return date.getFullYear() + "-" + addZero(date.getMonth() + 1, 2) + "-" + addZero(date.getDate(), 2) + " " +
        addZero(date.getHours(), 2) + ":" + addZero(date.getMinutes(), 2) + ":" + addZero(date.getSeconds(), 2);
}
var time = formatDate(new Date())

var dom = document.getElementById('app')
if (dom) {
    dom.innerHTML += '<tr><td>系统：</td><td>' + system + '</td></tr>' +
        '<tr><td>浏览器：</td><td>' + browser + '</td></tr>' +
        '<tr><td>机型：</td><td>' + telphone + '</td></tr>' +
        '<tr><td>userAgent：</td><td>' + navigator.userAgent + '</td></tr>' +
        '<tr><td>appName：</td><td>' + navigator.appName + '</td></tr>' +
        '<tr><td>错误信息：</td><td>' + err + '</td></tr>' +
        '<tr><td>机型：</td><td>' + telphone + '</td></tr>' +
        '<tr><td>屏幕分辨率：</td><td>' + window.screen.width + ' x ' + window.screen.height + '</td></tr>' +
        '<tr><td>色深：</td><td>' + window.screen.colorDepth + '</td></tr>' +
        '<tr><td>本地时间：</td><td>' + time + '</td></tr>'
}

// 获取电池信息
try {
    navigator.getBattery().then(function (battery) {
        console.log('是否在充电：' + battery.charging ? '是' : '否');               // 是否在充电
        console.log('电量比例：' + battery.level);                  // 电量比例
        console.log('充电时长：' + battery.chargingTime);           // 充电时长
        console.log('放电时长：' + battery.dischargingTime);        // 放电时长

        /* 事件 */
        console.log('充电状态放生变化：' + battery.onchargingchange)        // 充电状态放生变化
        console.log('电量发生变化：' + battery.onlevelchange)         // 电量发生变化
        console.log('充电时长发生变化：' + battery.onchargingtimechange)   // 充电时长发生变化
        console.log('放电时长发生变化：' + battery.ondischargingtimechange) // 放电时长发生变化

        dom.innerHTML +=
            '<tr><td>是否在充电：</td><td>' + (battery.charging ? '是' : '否') + '</td></tr>' +
            '<tr><td>电量比例：</td><td>' + battery.level + '</td></tr>' +
            '<tr><td>充电时长：</td><td>' + battery.chargingTime + '</td></tr>' +
            '<tr><td>放电时长：</td><td>' + battery.dischargingTime + '</td></tr>' +
            '<tr><td>充电状态放生变化：</td><td>' + battery.onchargingchange + '</td></tr>' +
            '<tr><td>电量发生变化：</td><td>' + battery.onlevelchange + '</td></tr>' +
            '<tr><td>充电时长发生变化：</td><td>' + battery.onchargingtimechange + '</td></tr>' +
            '<tr><td>放电时长发生变化：</td><td>' + battery.ondischargingtimechange + '</td></tr>'
    });
} catch (e) {
    dom.innerHTML += '<tr><td colspan="2">无法检测到电池信息：</td></tr>'
}

// 来源页
dom.innerHTML += '<tr><td>来源页：</td><td>' + document.referrer + '</td></tr>'

// 陀螺仪
var isOrientation = false

function handleOrientation(event) {
    window.removeEventListener("deviceorientation", handleOrientation);
    dom.innerHTML += '<tr><td>Z 轴旋转角度：</td><td>' + event.alpha + '</td></tr>' +
        '<tr><td>X 轴旋转角度：</td><td>' + event.beta + '</td></tr>' +
        '<tr><td>Y 轴旋转角度：</td><td>' + event.gamma + '</td></tr>'
    event.alpha; // Z 轴旋转角度
    event.beta;  // X 轴旋转角度
    event.gamma; // Y 轴旋转角度
    isOrientation = true
}

window.addEventListener("deviceorientation", handleOrientation);

// 显卡
var canvas = document.createElement("canvas");
var gl = canvas.getContext("experimental-webgl");
3
var debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
dom.innerHTML += '<tr><td>显卡：</td><td>' + gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) + '</td></tr>'