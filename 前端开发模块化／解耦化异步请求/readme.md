<h2>前端开发模块化／解耦化异步请求</h2>

<h3>1、异步请求的特点</h3>

在现代web前端的开发过程中，异步请求是常见需要处理的情形之一，他具有以下几个特点：

1. 异步：因此需要依赖回调、或者Promise来接受结果；
2. 复用：同一个请求可能多次／在不同地方被调用；
3. 形式固定：通常情况，异步请求的 ``url``、``get/post`` 类型、数据格式等是固定的，只有数据是可变的；
4. 输入数据可变：但发起请求传输的数据通常是不固定的；
5. 过程多种状态：比如 【输入数据不符合要求】、【``404`` 等请求过程出错】、【请求成功，未返回预期结果】、【请求成功】等多种过程；
6. 处理结果固定：虽然过程状态比较多，但对每一个异步请求都是通用的，并且可以提前预期其各种可能；
7. 封装：使用异步请求应该只关心输入和输出数据，就像调用函数一样，其他事情应该被异步请求来处理；
8. 内聚：封装的异步请求函数，应该不关心业务逻辑，只关心异步请求本身

<h3>2、开发过程中，异步请求的三层结构</h3>

基于以上特点，我们将异步请求在代码层上，应该划分为三层；

1. 第一层：``XMLHttpRequest`` 层，例如 axios 的 ``axios.then/catch`` 、或 jQuery 的 ``$.ajax()`` 函数，通常是由第三方库解决，也可以自己封装；
2. 第二层：异步请求层，负责提前预置好 ``url``、``get/post`` 类型，以及处理各种异常状态，将其转为业务代码可使用的数据；
3. 第三层：业务逻辑层，负责将业务数据传给异步请求层，以及通过回调函数、或 Promise 的 then 方法处理返回结果；

<h3>3、三层结构的分工</h3>

<h4>3.1、``XMLHttpRequest``层：</h4>

负责将异步请求发送到服务器，并获取其返回结果。

在此过程中，需要处理发起异步请求时，遇见的各种问题。

一般是通过构建``XMLHttpRequest``对象来实现异步请求，也有通过 ``fetch`` 的方式来实现的。

只要是异步请求，通常都有可能遇见错误情况发生，并且表现形式是一样的，因此应该单独封装为一层，作为最底层的代码：

可能的错误情况：

1. 由于本地代码错误，请求在发送出去之前就出错了，例如 ``data`` 理应是一个对象，但却传了一个布尔值，因此代码抛错；
2. 发起异步请求，但却遇见 ``404 Not Found`` ；
3. 返回结果预期是一个JSON字符串，但却返回的是一个不能转为JSON对象的字符串；

以上多种情况，统一在本层进行处理，正确的时候返回结果，错误的时候返回错误信息。

通常在这一层，我们会使用第三方的库，比如 axios 的 ``axios.then/catch`` 、或 jQuery 的 ``$.ajax()`` 函数，但如果面临的场景比较简单，引用第三方库就比较麻烦了，因此也可以自行封装一个微型的异步函数库来进行处理。

这里有一个我自行封装的仿 jQuery.ajax 的异步请求库（没有使用 ES6语法），可以 [点击访问ajax.js](https://github.com/qq20004604/a-ajax-project-for-learner/blob/master/public/ajax.js)。

---

<h4>3.2、异步请求层：</h4>

在经过 ``XMLHttpRequest`` 层进行封装好，我们发起一个异步请求，可能通过以下方式来实现：

```
var data = {
    age: 100,
    like: ["learning", "game"],
    name: "wang dong",
    testtest: 123
};
//普通post请求
$.ajax({
    url: "/postForLearnResByString",
    type: "post",
    data: data
}).done(function (result) {
    console.log(" ");
    console.log("post发送信息，返回值是字符串");
    console.log(result);
})
```

在实际开发中，这样一个异步请求很可能被多次调用，因此你会在 N 个地方，复制粘贴以上代码。

那么问题来了，假如后端哥哥告诉你，因为某些原因，这个接口要做以下改动：

1. url 从 ``/postForLearnResByString`` 变为 ``/foo/bar``；
2. 请求类型 从 ``post`` 更改为 ``get``；
3. 数据格式 从 ``JSON`` 更改为 ``formData``；
4. 错误返回值 从 ``code: '0'`` 扩展为 ``code: '500'``，提示信息从``msg`` 变为 ``message``；

那么你是不是有种想要ooxx他的冲动。

为了应对复杂的开发需求，我们必须将异步请求层抽象出来。让业务代码只关心输入数据、输出正常的数据和输出错误的数据。

例如用在业务逻辑中的代码，最好是下面这样的：

```
let data = {
    userName: '12',
    password: '34'
}
login(data).then(result => {
    // 正常的返回结果，页面跳转
    this.$router.push('/memberInfo')
}).catch(err => {
    // 错误的返回结果，弹出错误提示框
    alert(err)
})
```

即业务逻辑代码只关心输入和输出的数据，不关心过程。

为了应对以上情况，我们应该对异步请求的代码进行封装，示例代码如下：

```
function login (data) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: "/login",
            type: "post",
            data: data
        }).done(function (result) {
            /* 假设返回值如下
            * result = {
            *     code: '200',    // 错误时为'0'
            *     data: {
            *         token: 'foo',
            *         userId: 'bar'
            *     },
            *     message: 'success'    // 错误时值为错误原因
            * }
            * */
            if (result.code === '200') {
                resolve(result.data)
            } else {
                reject(result.message)
            }
        }).fail(err => {
            reject(err)
        })
    })
}
```

正常的时候，返回输出结果；错误的时候，返回错误信息。

<b>统一管理：</b>

另外，在实际开发中，为了方便管理，我们通常会异步请求层的代码，都放到一起形成一个模块，进行集中管理。

示例代码：

```
// http.js
// 测试数据总开关，值为false时禁止全部测试数据
const enableTestData = true
console.log('%c%s', 'color:red', '目前启用了测试数据的开关')

let http = {
    login (data) {
        // 输入时的测试数据
        if (enableTestData && true) {
            data = {
                userName: 'foo',
                password: 'bar'
            }
        }
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "/login",
                type: "post",
                data: data
            }).done(function (result) {
                // 输出时的测试数据
                if (enableTestData && true) {
                    result = {
                        code: '200',
                        data: {
                            token: '123',
                            userId: '456'
                        }
                    }
                }
                if (result.code === '200') {
                    resolve(result.data)
                } else {
                    reject(result.message)
                }
            }).fail(err => {
                reject(err)
            })
        })
    },
    getUserInfo (data) {
        // 略
    },
    modify (data) {
        // 略
    }
}

export default http
```

---

<h4>3.3、业务逻辑层：</h4>

理解了前两层后，业务逻辑层就没什么好说的了，如以下代码：

```
import http from 'http.js'

let data = {
    userName: '12',
    password: '34'
}
http.login(data).then(result => {
    // 正常的返回结果，页面跳转
    this.$router.push('/memberInfo')
}).catch(err => {
    // 错误的返回结果，弹出错误提示框
    alert(err)
})
```

业务需求该怎么写就怎么写好了，没啥好说的。

如果需要连续调用，也可以在原有基础上使用 ``async/await`` 函数，很简单。

```
import http from 'http.js'

async function foo (data) {
    let userId = await http.login(data)
    let userInfo = await http.getUserInfo({
        userId
    })
    return userInfo
}

let data = {
    userName: '12',
    password: '34'
}

foo(data).then(userInfo => {
    // 略
}).catch(err => {
    // 弹窗提示错误，移动端可以这么干
    alert(err)
})
```

<h3>4、总结</h3>

我们根据实际开发的需要，将异步请求粗浅的分为三层，但是在实际开发中，也可能因为种种原因，会分为更多层。

但总的来说，就是总结异步请求过程中的共性，然后将某些共性抽象出来封装为一层，方便统一管理，并且让每一层独立。

即让 *异步请求* 的归 **异步请求** ，让 *业务逻辑* 的归 **业务逻辑** 。

在此基础上，解耦，以及单独抽离出模块，都是顺势而为了。

所以，我们开发中应该多思考，多反思，从而才能提高自己的代码功力，让自己成长起来。