/**
 * Created by 王冬 on 2017/6/11.
 * 使用的MySQL，需要配置MySQL的连接池
 * 标准数据是
 *  {
 *  url : "",    //当前页面url
 *  error : ""   //错误信息
 *  }
 *  然后服务器生成ctime，插入到表errorLog中
 *  引入方式是：
 *  在主js文件里，比如app.js，插入以下代码即可：（注意路径）
 *  //错误日志存储
 *  var saveError = require("./routes/saveError");
 *  app.use("/saveError", saveError);
 */
'use strict'
let express = require('express'); // 调用express模块
let router = express.Router();  // 调用模块的Router方法
let mysql = require("mysql");   //调用nodejs和mysql交互的模块；
let pool = mysql.createPool({   //创建连接池
    host: '127.0.0.1',  //表示本地的数据库
    user: 'root',       //账号
    password: '123456', //密码
    port: '3306',       //默认端口
    database: 'govsite'    //库名
})

//错误处理，插入表中
router.post('/', function (req, res, next) {
    //没有错误数据
    if (!req.body.error) {
        return res.send({
            code: 401,
            data: "You are not allowed post advice to Server"
        });
    } else if (typeof req.body.error !== "string") {
        return res.send({
            code: 400,
            data: "Your postmessage is error."
        });
    }

    saveErrorToSQL(req.body.error, req.body.url,
        function (err, result) {
            if (result) {   //有结果
                return res.send({
                    code: 200,
                    data: result.insertId  //只返回id
                });
            }
            if (err) {  //如果报错，返回报错信息
                return res.send({
                    code: 500,
                    data: "server error"
                });
            }
            return res.send({
                code: 501,
                data: "nothing loaded."
            })
        })

})

//错误信息存储函数
function saveErrorToSQL(error, url, callback) {
    var selectResult;
    db.con(function (connect) {
        connect.query("INSERT errorlog (ctime, url, errorMessage) values(?, ?, ?)", [getNowTime(), url, error], function (err, result) {
            if (err) {  //报错
                console.log(error + " error information is: " + err);
                return callback(err, null);
            }
            console.log(result);
            selectResult = result;  //这里的result是一个数组，只包含一个元素（或者是空）
            if (selectResult.insertId || selectResult.changedRows) {  //查询到的话，数组是有元素的（即length > 0）
                return callback(null, selectResult) //这里的selectResult就是user对象，包含name和password属性
            } else {
                return callback(null, null);    //如果查询不到，两个参数都为空
            }
        })
    })
}

let db = {};
db.con = function (callback) {   //callback是回调函数，连接建立后的connection作为其参数
    pool.getConnection(function (err, connection) { //创建一个链接
        if (err) {      //对异常进行处理
            throw err;  //抛出异常
        } else {
            callback(connection);   //如果正常的话，执行回调函数（即请求），具体请求在回调函数中写
        }
        connection.release();   //释放连接
    })
}
let formatDate = function (date) {
    return date.getFullYear() + "-" + addZero(date.getMonth() + 1, 2) + "-" + addZero(date.getDate(), 2) + " " +
        addZero(date.getHours(), 2) + ":" + addZero(date.getMinutes(), 2) + ":" + addZero(date.getSeconds(), 2);
}

//在字符串开始补足0
let addZero = function (str, length) {
    str = String(str);
    if (typeof str !== "string" || typeof length !== "number") {
        return str;
    }
    while (str.length < length) {
        str = "0" + str;
    }
    return str;
}
let getNowTime = function () {
    return formatDate(new Date());
}


module.exports = router;