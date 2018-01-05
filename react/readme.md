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
