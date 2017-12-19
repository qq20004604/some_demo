/**
 * Created by 王冬 on 2017/12/19.
 * QQ: 20004604
 * weChat: qq20004604
 */
var appVersion = window.navigator.appVersion
var appName = window.navigator.appName
var userAgent = 'Mozilla/5.0 (Linux; Android 7.1.1; OPPO R9s Build/NMF26F; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/53.0.2785.49 Mobile MQQBrowser/6.2 TBS/043632 Safari/537.36 MicroMessenger/6.5.23.1180 NetType/WIFI Language/zh_CN'

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
        if (/MicroMessenger/.test(userAgent)) {
            browser = userAgent.match(/MicroMessenger[^ ]+/)[0]
            browser += ' （微信浏览器）'
        } else if (/QQBrowser/.test(userAgent)) {
            browser = userAgent.match(/ \D?QQBrowser[^ ]+ /)[0].replace('/', ' ')
            browser += ' （QQ浏览器）'
        } else if (/UCBrowser/.test(userAgent)) {
            browser = userAgent.match(/UCBrowser[/0-9.]+/)[0].replace('/', ' ')
            browser += ' （UC浏览器）'
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

var dom = document.getElementById('app')
if (dom) {
    dom.innerText = '系统：' + system + '\n浏览器：' + browser + '\n机型：' + telphone + '\nuserAgent：' + navigator.userAgent + '\nappName：' + navigator.appName + '\n错误信息：' + err
}