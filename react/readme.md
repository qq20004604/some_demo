<h3>1、安装</h3>

推荐使用 DEMO 的 package.json 配置来安装

```
npm install
```

运行（HMR）：

```
npm run dev
```


单独安装

```
npm install --save react react-dom
npm i --save babel-preset-react babel-preset-es2015
```

说明：

1. ``babel-preset-react``: 需要配置 ``.babelrc`` 这个文件的 ``presets`` 属性，添加一个元素 ``"babel-preset-react"``；

<h3>2、使用</h3>

app.js 添加内容：

```
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
    <h1>Hello, world!</h1>,
    document.getElementById('root')
);
```

运行 ``npm run dev`` 即可。

<h3>3、嵌套</h3>

被嵌套的目标可以是函数或者类，需要以大写字母开头：

函数是 ``return`` 的返回值，类是 ``render`` 函数的返回值；

示例：

```
// 被嵌套
function Foo() {
    return <h3>这是一个h3标签</h3>
}

// 嵌套到目标
ReactDOM.render(
    <div>
        <Foo/>
        <p>当前时间是：{formatDate(new Date())}</p>
    </div>,
    document.getElementById('root')
)
```

核心是函数名/类名是 Foo，所以嵌套的地方的标签名也为 ``Foo``，并且是一个闭合标签。

类的写法：

```
class Foo extends React.Component {
    // 如果只是单纯的显示DOM，这里的构造函数可以省略
    constructor(props) {
        super(props)
    }

    render() {
        return <h3>这是一个h3标签</h3>
    }
}
```

<h3>4、变量</h3>

被中括号包含