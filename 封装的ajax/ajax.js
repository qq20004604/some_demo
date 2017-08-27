/**
 * Created by 王冬 on 2017/6/11.
 */
function beginMyAjaxByWangdong() {
    var ajax = function (options) {
        /*  参数
         *   1、类型对象，以下是key：
         *   2、url：链接
         *   3、type：请求方式
         *  示例代码：
         *  this.$ajax({
         *      url: "/getForLearn",
         *      type: "get",
         *      data:{},
         *      isFormData:true/false   //默认false
         *  }).done(function (val) {
         *      console.log(val)
         *  }).fail(function (err) {
         *      console.error(err);
         *  })
         * */

        //创建一个空对象，之后将返回它
        var obj = {};
        //分别表示成功和失败时，执行函数的变量
        var success = function () {

        };
        var fail = function () {

        };
        //设置空对象的done和fail方法，确保能执行起来
        //由于可以连写，因此确保done和fail两个方法，在执行后的返回值也需要是obj对象（不然无法连写了）
        //回调函数作为参数传入，赋值给内置的变量
        //注意，此时只是赋值，没有执行
        obj.done = function (success2) {
            success = success2;
            return obj;
        }
        obj.fail = function (fail2) {
            fail = fail2;
            return obj;
        }

        //对象类型检查，首先要求参数必须是对象
        //然后如果url或者type类型需要是字符串
        //如果以上任何一个不通过，则报错
        if (!(options instanceof Object) || (typeof options.url !== 'string') || (typeof options.type !== 'string')) {
            //给个报错的提示信息呗
            console.error("error arguments for ajax");
            return obj;
        }

        //只有有data属性的时候才需要进行处理，
        if (typeof options.data !== 'undefined') {

            //假如data属性是一个函数，那么跳过，就当没有
            if (typeof options.data !== 'function') {

                // 假如类型是不是get，那么很好处理，因为都被放在请求体之中了
                // 直接通过JSON.stringify()方法转换使用
                // 记得，需要转为小写（因为可能用户是大写的）
                if (options.type.toLowerCase() !== 'get') {

                    //默认有JSON.stringify()方法，如果没有则报错
                    if (typeof JSON.stringify !== 'function') {
                        console.error("can't use JSON.stringify(), so can't Ajax by post when type of data is object");
                        return obj;
                    }

                    //如果是form表单形式提交，则需要拼接字符串
                    if (options.isFormData) {
                        //一个临时数组，用于存放拼接的字符串
                        var tempArray = [];

                        //注意，由于data可能有某属性也是对象或数组或其他类型；
                        //我们的处理方案是，假如某属性是对象、数组、函数，则直接跳过就当没有
                        //其他则添加到我们的字符串中
                        for (var k in options.data) {
                            if (typeof options.data[k] !== 'object' && typeof options.data[k] !== 'function') {
                                tempArray.push(k + "=" + options.data[k]);
                            }
                        }

                        //有长度的话则拼接起来
                        if (tempArray.length > 0) {
                            var data = tempArray.join("&");
                        }
                    } else {
                        //通过内置方法转为JSON字符串
                        var data = JSON.stringify(options.data);
                    }
                } else {

                    //此时请求类型必然是get
                    //为了简化，我们这么处理
                    //当data类型是对象时，以key1=val1&key2=val2这样拼接起来
                    //当data类型为字符串或数字时，直接添加到url后；
                    //当data类型为其他时，不发起请求并报错
                    if (typeof options.data === 'string' || typeof options.data === 'number') {
                        var data = options.data;
                    } else if (options.data instanceof Object) {

                        //一个临时数组，用于存放拼接的字符串
                        var tempArray = [];

                        //注意，由于data可能有某属性也是对象或数组或其他类型；
                        //我们的处理方案是，假如某属性是对象、数组、函数，则直接跳过就当没有
                        //其他则添加到我们的字符串中
                        for (var k in options.data) {
                            if (typeof options.data[k] !== 'object' && typeof options.data[k] !== 'function') {
                                tempArray.push(k + "=" + options.data[k]);
                            }
                        }

                        //有长度的话则拼接起来
                        if (tempArray.length > 0) {
                            var data = tempArray.join("&");
                        }
                    }
                }
            }
        }

        var req = new XMLHttpRequest();

        req.onreadystatechange = function () {
            //当属性值不是4的时候，说明ajax没有完成，因此返回不做处理
            if (this.readyState !== 4) {
                return;
            }
            //  当ajax的请求完成后，status状态码会发生改变
            //  其值来源于Http的头部的Status Code属性
            //  可以打开chrome控制台，查看network；
            //  然后选择一项请求后查看Headers选项卡中，General中的Status Code属性
            //  当值为200时，说明成功获取，否则失败
            if (this.status === 200) {

                //success是用户自己写的处理回调函数，我们将返回值作为参数传递
                //并执行用户自定义的回调函数
                //如果能解析则传递json解析后的内容，否则传原内容
                var isErr = false;
                try {
                    var res = JSON.parse(this.response);
                } catch (err) {
                    // console.error(err);
                    isErr = true;
                }
                if (isErr) {
                    success(this.response);
                } else {
                    success(res);
                }
            }
            else {
                //fail则是用户写的失败处理函数，同样将错误文本作为参数传递，并执行之
                var isErr = false;
                try {
                    var res = JSON.parse(this.response);
                } catch (err) {
                    // console.error(err);
                    isErr = true;
                }
                if (isErr) {
                    fail(this.response);
                } else {
                    fail(res);
                }
            }
        }

        //区分请求方式，决定data数据的传递方法
        if (options.type.toLowerCase() === 'get') {
            //当是get请求时，数据是作为url链接传递给字符串的
            if (typeof data !== 'undefined') {
                //但前提是data，设置url，第三个参数true或者默认值表示是异步
                req.open(options.type, options.url + "?" + data, true);
                //发送请求，并返回
                req.send();
            } else {
                //直接设置url即可
                req.open(options.type, options.url, true);
                //发送请求，并返回
                req.send();
            }
        } else {
            //非get方式时，data处理都是一样的，即放在请求体之中
            //先设置url
            req.open(options.type, options.url, true);
            //然后查看data是否存在
            if (typeof data !== 'undefined') {
                //如果存在，那么显然是JSON格式字符串（因为我们前面已经处理过了）
                //但是在发送前，我们需要设置一下请求头的Content-Type属性，告诉服务器我们发送的是一个json

                if (options.isFormData) {
                    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
                } else {
                    req.setRequestHeader("Content-Type", "application/json");
                }

                //然后再发送
                req.send(data)
            } else {
                //不然直接发送就行
                req.send();
            }
        }

        //最终返回obj对象
        return obj;
    }
    //冲突处理，默认通过$.ajax来调用，但是如果启用了jquery或者之类的，导致$.ajax有内容存在，那么则使用$ajax来调用（不过那个时候有必要用这个么？）
    if (typeof window.$ === "object" && window.$.ajax) {
        window.$ajax = ajax;
        return;
    }
    if (typeof window.$ === "undefined") {
        window.$ = {};
    }
    window.$.ajax = ajax;
}

beginMyAjaxByWangdong();

$.ajax({
    url: "/webaace/signinsrv/signinwithphone",
    type: "post",
    data: {
        "signInPhone": {
            "isWifiSignIn": false,
            "orgId": "5717118013",
            "longitude": 120.0607497829861,
            "latitude": 30.31542534722222,
            "deviceName": "",
            "placeName": "浙江省杭州市西湖区三墩镇西园七路3号3幢",
            "clientIp": "",
            "shortPlace": "三墩镇西园七路3号3幢",
            "wifiMacAddr": "",
            "deviceId": "0357a715e378b92f88964b01c4ef5e07"
        }
    }
}).done(function (result) {
    console.log(result)
})