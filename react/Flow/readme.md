>安装 flow 本身

```
npm install --save-dev flow-bin
```

> 安装 webpack 的 flow 插件

```
npm install --save-dev flow-webpack-plugin
```

不然你 webpack 没法用 flow

> 配合babel 的 flow 插件（默认你已经装了babel）

```
npm install --save-dev babel-preset-flow
```

>.babelrc文件添加

```
"presets": [
    "flow"
]
```

>webpack.config.js 里添加：

```
// 引入
var FlowWebpackPlugin = require('flow-webpack-plugin');

// 将这个添加到插件里
plugins: [
    new FlowWebpackPlugin({
      flowArgs: ['status']
    })
]
```

注：status 会比较快， check 会比较慢。

>不检查 node_modules 文件夹

修改文件： ``/.flowconfig``，如果没有这个文件，记得运行 ``flow init`` 创建一下（不过直接运行 flow 命令，又需要全局装一下 flow 才行）

```
[ignore]
/node_modules
```

应该装完了吧。。。

<h3>使用方法</h3>

```
/* @flow */
// @flow  

以上两个都可以，只要带有这个注释，都会进行类型检测

或者
/* @flow weak */ 只对有加类型注解的变量进行类型检测
```

<b>注意：</b>

如果是 window 下挂的全局变量，比如document之类，必须通过 window.document 来调用才行，否则会报错。

例如：

```
var DOM = document.createElement('div')
DOM.innerHTML = '123'

// 正确
window.document.body.appendChild(DOM)

// 错误（报错）
document.body.appendChild(DOM)
```

