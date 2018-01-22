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
2. ``package.json`` 里面的内容，随着学习进度的推进，而不断更新；
3. ``JSX`` 语法请自行学习；
4. 编辑器建议使用 ``webstorm`` 作为 IDE；
5. 默认读者已经有一定的框架开发知识（比如说学过 Vue.js），因此很多内容不会写的很细致

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

``document.getElementById('root')`` 表示将DOM插入到 ``id = 'root'`` 的 DOM 元素中。

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

<h3>4、组件</h3>

组件实例必须继承于 ``React.Component``。

组件是一个完整的系统，而 React 的 DOM 元素，只是 html 片断。

```
// 继承于 React.Component
// 类名必须大写字母开头
class HelloWord extends React.Component {
    constructor(props) {
        // 调用 this 前必须先执行 super(props) ，理由是es6规则
        super(props);
        // 通过 state 设置组件变量
        this.state = {
            world: 'world'
        }
        // 调用方法时，方法的 this 指向组件实例（也就是没啥特别的地方）
        this.log()
    }

    // 渲染函数，this 指向实例本身
    render() {
        console.log(this)
        return <div className={domClass}>
            Hello，{this.state.world}!
        </div>
    }

    log() {
        console.log(this)
    }
}
```

<h3>5、变量</h3>

被中括号包含。

```
let foo = 'world'

class HelloWord extends React.Component {

    render() {
        return <div className={domClass}>
            Hello，{foo}
        </div>
    }
}
```

<h3>6、组件变量</h3>

放在 state 属性中，通过 ``setState`` 方法修改.

```
class HelloWord extends React.Component {
    constructor(props) {
        super(props);
        // 必须存在this.state中
        this.state = {
            seconds: 0
        }
        setInterval(() => {
            // 调用setState方法修改变量的值
            this.setState({
                seconds: this.state.seconds + 1
            })
        }, 1000)
    }

    render() {
        return <div className={domClass}>
            Hello，{foo}！距离上一次修改页面，过去了{this.state.seconds}秒
        </div>
    }
}
```

<h3>7、更新组件变量</h3>

将组件变量存到 ``state`` 属性中，然后通过 ``setState()`` 来更新变量。

```
class HelloWord extends React.Component {
    constructor(props) {
        // props的值就是你传给他的变量，比如这里就是 {toChild: 'world'}
        super(props);
        // 必须存在this.state中
        this.state = {
            seconds: 0
        }
        setInterval(() => {
            // 调用setState方法修改变量的值
            this.setState({
                seconds: this.state.seconds + 1
            })
        }, 1000)
    }

    render() {
        return <div className={domClass}>
            {/* 需要通过this.state.world 来使用。当然你也可以赋值到 this 的其他变量 */}
            Hello，World！距离上一次修改页面，过去了{this.state.seconds}秒
        </div>
    }
}

ReactDOM.render(
    <div>
        <HelloWord/>
    </div>,
    document.getElementById('root')
)
```

<h3>8、变量传递</h3>

父组件中，通过写在子组件的标签里来传值。

```
class HelloWord extends React.Component {
    constructor(props) {
        // props的值就是你传给他的变量，比如这里就是 {toChild: 'world'}
        super(props);
        // 必须存在this.state中
        this.state = {
            world: props.toChild,
            seconds: 0
        }
        setInterval(() => {
            // 调用setState方法修改变量的值
            this.setState({
                seconds: this.state.seconds + 1
            })
        }, 1000)
    }

    render() {
        return <div className={domClass}>
            {/* 需要通过this.state.world 来使用。当然你也可以赋值到 this 的其他变量 */}
            Hello，{this.state.world}！距离上一次修改页面，过去了{this.state.seconds}秒
        </div>
    }
}

// 要传的变量
let foo = 'world'

ReactDOM.render(
    <div>
        {/* ---- toChild 就是传递给子组件的变量的key ---- */}
        {/* ---- foo就是被传的变量（这里就是字符串 'world'） ---- */}
        <HelloWord toChild={foo}/>
        <p>当前时间是：{formatDate(new Date())}</p>
        {/*<Leaner/>*/}
    </div>,
    document.getElementById('root')
)
```

<h3>9、类名（样式）</h3>

在 React 里，给元素添加类名，不是通过 ``class``，而是 ``<div className={domClass}></div>`` 这种形式；

示例：

```
let domClass = 'container parent'

class HelloWord extends React.Component {
    constructor(props) {
        // props的值就是你传给他的变量，比如这里就是 {toChild: 'world'}
        super(props);
    }

    render() {
        return <div className={domClass}>
        </div>
    }
}

ReactDOM.render(
    <div>
        <HelloWord/>
    </div>,
    document.getElementById('root')
)
```

结果是：

```
<div class="container parent"></div>
```

原因：

>警告:

>因为 JSX 的特性更接近 JavaScript 而不是 HTML , 所以 React DOM 使用 camelCase 小驼峰命名 来定义属性的名称，而不是使用 HTML 的属性名称。

>例如，class 变成了 className，而 tabindex 则对应着 tabIndex.


<h3>10、事件处理</h3>

> 事件的 this

注意，事件触发的 this，默认指向的 undefined；

所以请手动绑定 this 给事件相应函数。比如：

```
this.clickCount = this.clickCount.bind(this)
```

> onChange 事件

输入框获取修改后的值，通过 ``onChange`` 事件。

假如事件的参数是 ``e``，那么 ``e.target`` 获取到当前 DOM（即这个 ``<input>`` 标签），然后 ``e.target.value`` 获取输入框的值。

但这个时候修改是无效的，因此必须通过 ``this.setState()`` 来修改值。

> onClick事件

绑定点击事件，通过 ``onClick`` 事件。

参数同上，一个道理，但这里不需要。

> 其他事件

略，事件名和原理是一样的

```
class HelloWord extends React.Component {
    constructor(props) {
        super(props);
        // 通过 state 设置组件变量
        this.state = {
            count: 0,
            bindValue: ''
        }
        // 在这里手动绑定 this，原因是不绑定的话，this 将指向 undefined
        this.clickCount = this.clickCount.bind(this)
        this.changeValue = this.changeValue.bind(this)
    }

    // 渲染函数，this 指向实例本身
    render() {
        return <div>
            {/* onClick 注意是驼峰写法 */}
            <button onClick={this.clickCount}>点击我增加一次点击计数</button>
            <p>你已经点击了{this.state.count}次</p>
            这个输入框的值和上面的点击次数绑定了，因此无法被手动修改<input type="text" value={this.state.count}/>
            {/* 下面这个br标签，必须是闭合标签写法，否则会报错 */}
            <br/>
            <input type="text" value={this.state.bindValue} placeholder='请在这里输入值' onChange={this.changeValue}/>
            <br/>
            上面输入框的值是：{this.state.bindValue}
        </div>
    }

    clickCount() {
        this.setState({
            count: this.state.count + 1
        })
    }

    changeValue(e) {
        // e.target 拿到 输入框这个DOM，然后value属性拿到修改后的值
        var newValue = e.target.value
        console.log(newValue)
        // 需要通过 setState 来修改值才能生效
        this.setState({
            bindValue: newValue
        })
    }
}
```

<b>阻止默认事件：</b>

1. 阻止默认事件，需要通过 ``e.preventDefaul()`` 来实现（e 是事件的回调函数的参数）

<b>React 事件函数的特点：</b>

1. 事件参数是一个合成事件。React 根据 W3C spec 来定义这些合成事件，所以你不需要担心跨浏览器的兼容性问题；
2. 在 render 里，写成 ``this.xx``，但是这个事件执行时的 this 是 undefined，所以需要手动绑定（``bind``）；

<b>事件的传参：</b>

1. 原则上，就是返回一个带参数的函数；

【方法一】

返回通过 ``bind`` 绑定了 this 和 参数的函数;

需要注意的是，事件参数无需添加，会被默认后置到最后一个参数的位置：

```
class HelloWord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        }
    }

    // 渲染函数，this 指向实例本身
    render() {
        return <div>
            {/* 这种方法省略了 this 绑定的过程 */}
            <button onClick={this.clickCount.bind(this, 5)}>增加count</button>
            <br/>
            计数器二：{this.state.count}
        </div>
    }

    clickCount(number, e) {
        // 先是自定义参数，最后一个是事件参数
        console.log(arguments)
        this.setState({
            count: this.state.count + number
        })
    }
}
```

【方法二】

参数是一个函数，这个函数里执行了你准备执行的那个函数。

核心思想是：参数函数被执行 ——> 参数函数里执行了原本预期执行的函数 ——> 预期执行的函数里，放置了需要的参数

如代码：

```
class HelloWord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        }
    }

    // 渲染函数，this 指向实例本身
    render() {
        return <div>
            {/* 这种方法省略了 this 绑定的过程 */}
            <button onClick={e => this.clickCount.call(this, 5, e)}>增加count</button>
            <br/>
            计数器二：{this.state.count}
        </div>
    }

    clickCount(number, e) {
        // 先是自定义参数，最后一个是事件参数
        console.log(arguments)
        this.setState({
            count: this.state.count + number
        })
    }
}
```


<h3>11、组件复用</h3>

同一个组件可以同时插入多个到父组件中，并且各个组件的状态是独立的。

```
class HelloWord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        }
        this.clickCount = this.clickCount.bind(this)
    }

    // 渲染函数，this 指向实例本身
    render() {
        return <div>
            <button onClick={this.clickCount}>点击我增加一次点击计数</button>
            <p>你已经点击了{this.state.count}次</p>
        </div>
    }

    clickCount() {
        this.setState({
            count: this.state.count + 1
        })
    }
}

ReactDOM.render(
    <div>
        <HelloWord/>
        <HelloWord/>
    </div>,
    document.getElementById('root')
)
```

<h3>12、生命周期</h3>


<b>参考链接：</b>

[React组件生命周期小结](https://www.jianshu.com/p/4784216b8194)

两个生命周期，分别是组件的生命周期，和状态变更的声明周期

<b>组件结构：</b>

父组件套用子组件

<b>初次渲染：</b>

1. constructor 【父组件】构造函数
2. componentWillMount 【父组件】挂载前
3. render 【父组件】渲染
4. constructor 【子组件】构造函数
5. componentWillMount 【子组件】挂载前
6. render 【子组件】渲染
7. componentDidMount 【子组件】挂载后执行
8. componentDidMount 【父组件】挂载后执行

总结：

1. 先**构造函数**，然后执行**挂载前函数**，然后父组件**开始渲染**；
2. 渲染的时候，查到子组件，开始递归子组件，执行以上流程；
3. 收尾的时候，先执行子组件的**挂载后函数**，再执行父组件的该函数；

<br>
<b>state 被改变：</b>

1. shouldComponentUpdate 【父组件】当state被改变后，这个函数会被执行，如果返回true，那么会触发render，否则不会触发render。但注意，事实上的值都会被更新 {} {count: 1}
2. componentWillUpdate(nextProps, nextState) 【父组件】，render渲染前执行
3. render 【父组件】
4. componentWillReceiveProps 【子组件】当父组件的 state 改变后，这个函数会被执行。props的值： {}
5. shouldComponentUpdate 【子组件】当state被改变后，这个函数会被执行，如果返回true，那么会触发render，否则不会触发render。但注意，事实上的值都会被更新 {} null
6. componentWillUpdate(nextProps, nextState) 【子组件】，render渲染前执行
7. render 【子组件】渲染完毕
8. componentDidUpdate 【子组件】 子组件的render已经渲染完毕
9. componentDidUpdate 【父组件】 父组件的render已经渲染完毕

总结：

1. 父组件state被改变后，首先判断需不需要重新渲染，不需要的话就没有更多事情了；
2. 需要渲染的话，先执行父组件**渲染前函数**，然后执行父组件 render；
3. 进入递归流程，开始检查子组件；
4. 子组件先执行获取 props 的函数（props 从父组件传来）；
5. 然后子组件判断要不要重新渲染子组件，如果不需要，则子组件终止流程，跳回父组件执行父组件的渲染完毕（``componentDidUpdate``）；需要则继续下一步；
6. 子组件执行**渲染前函数**（渲染前处理 props 用，同第二步），然后执行子组件 render；
7. 如果子组件还有子组件，则重复 3 ~ 6 ；
8. 子组件渲染完毕后，执行子组件 **渲染完毕函数**，并冒泡执行父组件 **渲染完毕函数**；

建议参照 [DEMO](https://github.com/qq20004604/some_demo/tree/master/react/React%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9FDEMO) 查看。

使用说明：

1. 第一次点击按钮，执行完整的 state 改变周期；
2. 第二次点击，父组件改变但不渲染；
3. 第三次点击，父组件渲染，但是子组件不渲染；
4. 第四次点击，同第二次；

即父组件第 2n+1 次点击渲染，2n 次不渲染；子组件是父组件第 2n 次渲染时，不渲染，第 2n+1 次渲染时，渲染；

<table>
    <thead>
    <tr>
        <td>生命周期钩子函数</td>
        <td>执行时间</td>
        <td>描述</td>
    </tr>
    </thead>
    <tbody>
    <tr>
        <td>constructor</td>
        <td>创建组件时调用</td>
        <td>显然创建组件时，会第一时间调用这个</td>
    </tr>
    <tr>
        <td>componentWillMount</td>
        <td>组件挂载前</td>
        <td>在组件挂载之前调用一次。如果在这个函数里面调用setState，本次的render函数可以看到更新后的state，并且只渲染一次。</td>
    </tr>
    <tr>
        <td>componentDidMount</td>
        <td>组件挂载后</td>
        <td>此时子组件挂载好了，可以在这里使用 refs。<br/>注意，在此之前子组件会先执行完生命周期钩子（比如子组件的这个函数比父组件的这个函数优先执行）</td>
    </tr>
    <tr>
        <td>componentWillReceiveProps(nextProps)</td>
        <td>父组件的 state 改变后，子组件的这个函数会被执行</td>
        <td>父组件的 state 被改变后，子组件的这个函数会执行（参数是props），并且子组件的 render 函数随后会被执行</td>
    </tr>
    <tr>
        <td>shouldComponentUpdate(nextProps, nextState)</td>
        <td>state 被改变后（包括父组件），这个函数会被执行；<br/>
            return true 会触发render和子组件的这个函数（默认true）<br/>
            return false 值已被修改但不会触发 render；
        </td>
        <td>
            返回true，会导致先执行父组件的 render（渲染），再执行子组件的 componentWillReceiveProps（子组件props更新），再执行子组件的
            shouldComponentUpdate（子组件是否渲染）；如果子组件返回true，则依次类推；<br/>
            返回false，上面后续的全部不会执行
        </td>
    </tr>
    <tr>
        <td>componentWillUpdate(nextProps, nextState)</td>
        <td>shouldComponentUpdate 返回 true 后，执行这个（更新前）</td>
        <td>上面返回 true 才会执行，否则不会</td>
    </tr>
    <tr>
        <td>render</td>
        <td>渲染函数</td>
        <td>这个是核心，一般返回 JSX 语法的 DOM；<br/>建议不要在这里修改state的值</td>
    </tr>
    <tr>
        <td>componentDidUpdate(preProps, preState)</td>
        <td>渲染完毕后执行</td>
        <td>先执行子组件的这个函数，再执行父组件的这个函数。<br>注意，这里的2个参数，是之前的 state 的值，而不是最新的 state 的值，如果要拿最新的，请通过 this.state.xx 来获取</td>
    </tr>
    <tr>
        <td>componentWillUnmount</td>
        <td>组件卸载时执行</td>
        <td>卸载时执行</td>
    </tr>
    </tbody>
</table>


<h3>13、setState 是异步行为</h3>

>setState()

这是一个异步操作，如：

```
class HelloWord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        }
        this.clickCountAsync = this.clickCountAsync.bind(this)
    }

    // 渲染函数，this 指向实例本身
    render() {
        return <div>
            <button onClick={this.clickCountAsync}>异步增加count</button>
        </div>
    }

    clickCountAsync() {
        console.log('【异步】setState之前，count的值：', this.state.count)
        this.setState({
            count: this.state.count + 1
        })
        console.log('【异步】setState之后，count的值：', this.state.count)
    }
}
```

会发现，两个 log 语句，输出的结果的值，都是一样的。

原因是 React 会合并多个 setState，然后统一更新；

那么如何获取更新后的数据，答案是通过回调函数；

说明见注释

```
class HelloWord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            anotherCount: 0
        }
        this.clickCountAsync = this.clickCountAsync.bind(this)
        this.clickCountSync = this.clickCountSync.bind(this)
    }

    // 渲染函数，this 指向实例本身
    render() {
        return <div>
            <button onClick={this.clickCountAsync}>异步增加count</button>
            <br/>
            <button onClick={this.clickCountSync}>增加count，并同步更新计数器二的值等于异步增加后的count</button>
            <br/>
            计数器二：{this.state.anotherCount}
        </div>
    }

    clickCountAsync() {
        console.log('【异步】setState之前，count的值：', this.state.count)
        this.setState({
            count: this.state.count + 1
        })
        console.log('【异步】setState之后，count的值：', this.state.count)
    }

    clickCountSync() {
        // 通过setState 更新 state.count 的值
        this.clickCountAsync()
        // 1、这里是更新前的值
        console.log('【同步】setState之前，count的值：', this.state.count)
        this.setState((prevState, props) => {
            // 3、这里的回调函数，是更新后执行（即
            console.log(prevState, props)
            // 返回值就像设置 setState 的参数一样
            return {
                anotherCount: prevState.count
            }
        })
        // 2、这里也是更新前的值
        console.log('【同步】setState之后，count的值：', this.state.count)
    }
}
```

当然，这又出现一个问题，那就是假如我调用一个方法，分别修改了 A 变量，然后又调用某个方法需要修改 B 变量，并且 B 变量依赖于 A 变量修改后的值（这就是以上场景）；

可是假如我又需要调用第三个方法修改 C 变量，并且 C 的值依赖于 B 修改后的值。那么这就有问题了。

原因是：

1. React 里并不存在类似 Vue 的 computed/watch 这样的计算属性。如果需要实现，那么可能需要引入额外的库（watch.js/Rx.js/mobx）；
2. setState 本身是异步的，并且回调函数获取变更后的值，也是异步的。因此在场景复杂的情况下，你很难判断哪一个 setState 的回调函数，会优先执行；

解决办法：

1. 一个是引入额外的库，仿 Vue.js；
2. 考虑使用生命周期函数 ``componentWillUpdate(nextProps, nextState)``，将依赖的变量的修改逻辑，添加到这个函数里，如下面代码，可以解决部分场景的问题；

```
componentWillUpdate(nextProps, nextState) {
    nextState.anotherCount *= 2
    console.log(nextProps, nextState)
}
```


<h3>14、条件渲染（类似 Vue 的 v-if）</h3>

讲道理说，React 本身的条件渲染，没有 Vue.js 用起来舒服。Vue.js 只需要在标签上添加 ``v-if`` 或者 ``v-show`` 就行，但 React 就比较麻烦了。

```
class HelloWord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
    }

    // 渲染函数，this 指向实例本身
    render() {
        let display = this.display.bind(this)
        return <div>
            {/* 这种方法省略了 this 绑定的过程 */}
            <button onClick={display}>{this.state.show ? '点击隐藏' : '点击显示'}</button>
            {
                this.state.show
                    ?
                    <p>显示出来啦</p>
                    :
                    null
            }
        </div>
    }

    display() {
        this.setState({
            show: !this.state.show
        })
    }
}
```

如以上示例，通过三元操作符里面，返回 ``JSX`` 语法的 DOM 标签，或者 null ，来决定是否显示；

也可以将 JSX 语法的 DOM 作为变量，像下面这样使用。

```
render() {
    let display = this.display.bind(this)
    let DOM = null
    if (this.state.show) {
        DOM = <p>显示出来啦</p>
    }

    return <div>
        {/* 这种方法省略了 this 绑定的过程 */}
        <button onClick={display}>{this.state.show ? '点击隐藏' : '点击显示'}</button>
        {DOM}
    </div>
}
```

关于 v-show 就没什么好说的了吧？手动设置标签的 style 就行，很简单。

<h3>15、列表渲染（对标 v-for）</h3>

【实现思路】

1. 基础：数组的元素是 JSX 语法的 DOM，该数组作为 JSX 语法的 DOM，可以自动拼起来；
2. 实现：遍历数组，然后将将数组元素变为 JSX 语法的 DOM，得到一个新的数组（元素是 JSX 的 DOM），将这个新数组作为变量插入到渲染元素中即可。

如以下代码：

```
class HelloWord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [1]
        }
        this.add = this.add.bind(this)
    }

    render() {
        console.log(this.state)
        let DOM = this.state.list.map((item, index) => (<li key={index}>{item}</li>))

        return <div>
            <p>列表元素：</p>
            <ul>
                {DOM}
            </ul>
            <button onClick={this.add}>点击添加一个列表元素</button>
        </div>
    }

    add() {
        this.state.list.push(parseInt(Math.random() * 1000))
        this.setState({
            list: this.state.list
        })
    }
}
```

【key】

注意，必须在列表的标签里设置唯一的 key 属性，不然会抛出异常（虽然还会正常执行）。

通常建议使用 id（因为 id 一般唯一）来作为 key，实在不行，使用数组的索引作为 key 也勉勉强强了（至少不会报错）。


<h3>16、表单</h3>

<B>总结写前面</b>

1. 值的改变，通过 ``onChange`` 事件触发（包括文字输入框、radio、checkbox）；
2. 

【form】标签：

如果用 form 标签的话，在通过 submit 按钮提交时，会自动触发页面跳转，但这个通常是我们不需要的；

解决办法是，添加 onSubmit 事件，如：``<form onSubmit={this.submit}>``，在这个函数里，通过 ``e.preventDefault()`` 阻止默认的提交行为，

示例代码：

```
class HelloWord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: ''
        }
        this.submit = this.submit.bind(this)
    }

    render() {
        return <form onSubmit={this.submit}>
            <label>
                male
                <input type="radio" name='gender' value='male'/>
            </label>
            <label>
                female
                <input type="radio" name='gender' value='female'/>
            </label>
            <input type="submit"/>
        </form>
    }

    submit(e) {
        console.log(arguments)
        e.preventDefault();
    }
}
```

【``input[type=text]``】标签：

默认情况下，通过 ``value=this.state.xxx`` 绑定，是单向绑定。即改变 state 存储的值，可以自动修改 input 的值，但是用户修改 input 的值，是无法修改成功的。

用户想要输入值，必须设置 onChange 事件才可以，这样才能实现 **双向绑定**。

示例代码：

```
class HelloWord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        }
        this.valueChange = this.valueChange.bind(this)
    }

    render() {
        return <form onSubmit={this.submit}>
            <input type="text" value={this.state.value} onChange={this.valueChange}/>
            <br/>
            输入框的值：{this.state.value}
        </form>
    }

    valueChange(e) {
        this.setState({
            value: e.target.value
        })
    }
}
```

【``textarea``】标签：

使用方法等同 ``input[type=text]``，略。

【``input[type=radio]``】标签：

注意，radio 以及 checkbox 的 value 设置和一般不同。

原因在于，radio 的 value 属性，表示当你选中这个单选框时，这个单选框的值，当你需要表示我选中这个单选框，那么应该通过 ``checked = true|'check'`` 来实现选中。

示例代码：

```
class HelloWord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gender: 'male'
        }
        this.select = this.select.bind(this)
    }

    render() {
        return <form>
            <label>
                male
                {/* 可以返回 true 表示选中 */}
                <input type="radio" name='gender' value='male'
                       checked={this.state.gender === 'male'}
                       onChange={this.select}/>
            </label>
            <label>
                female
                {/* 也可以返回checked 表示选中 */}
                <input type="radio" name='gender' value='female'
                       checked={this.state.gender === 'female' ? 'checked' : ''}
                       onChange={this.select}/>
            </label>
            <br/>
            你当前选择的性别是：{this.state.gender}
        </form>
    }

    select(e) {
        this.setState({
            gender: e.target.value
        })
    }
}
```

【``input[type=checkbox]``】标签：

这个显然就更麻烦了。他表现 选中/未选中 状态，和 radio 是一样的。

但问题在于，checkbox 在一个 name 属性下可能有多个变量，

所以你需要用数组来存储当前选中的 checkbox 有谁，

例如：``gender: ['male', 'female']``，

然后通过 ``indexOf(xx) > -1`` 来判断存在不存在（-1 表示不存在）。

示例代码：

```
class HelloWord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gender: ['male', 'female']
        }
        this.select = this.select.bind(this)
    }

    render() {
        return <form>
            <label>
                male
                {/* 可以返回 true 表示选中 */}
                <input type="checkbox" name='gender' value='male'
                       checked={this.state.gender.indexOf('male') > -1}
                       onChange={this.select}/>
            </label>
            <label>
                female
                {/* 也可以返回checked 表示选中 */}
                <input type="checkbox" name='gender' value='female'
                       checked={this.state.gender.indexOf('female') > -1}
                       onChange={this.select}/>
            </label>
            <br/>
            你当前选择的性别是：{this.state.gender.join(',')}
        </form>
    }

    select(e) {
        // 先拿到值和索引
        let v = e.target.value
        let i = this.state.gender.indexOf(v)
        // 有则移除，无则添加
        if (i === -1) {
            this.state.gender.push(v)
        } else {
            this.state.gender.splice(i, 1)
        }
        // 最后必须setState设置一下，才会触发render
        this.setState({
            gender: this.state.gender
        })
    }
}
```

当然，也可以通过 **对象** 的方式来存储，写的话更简单，只不过取用数据的时候，可能会麻烦一些，如示例：

```
class HelloWord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gender: {
                male: false,
                female: false
            }
        }
        this.select = this.select.bind(this)
    }

    render() {
        return <form>
            <label>
                male
                <input type="checkbox" name='gender' value='male'
                       checked={this.state.gender.male}
                       onChange={this.select}/>
            </label>
            <label>
                female
                <input type="checkbox" name='gender' value='female'
                       checked={this.state.gender.female}
                       onChange={this.select}/>
            </label>
            <br/>
            你当前选择的性别是：{JSON.stringify(this.state.gender)}
        </form>
    }

    // 以下这种写法是可复用写法（即多个不同的 checkbox 可以复用这一个函数）
    select(e) {
        let v = e.target.value
        let name = e.target.name
        this.state[name][v] = !this.state[name][v]
        this.setState({
            [name]: this.state[name]
        })
    }
}
```

【select】标签：

select 标签在使用的时候，和 Vue 有一点最大的不同之处在于：

1. 当 Vue 中设置 select 标签的值为 **空字符串** 时，那么 select 标签会不选中任何 option；
2. 当 React 中设置 select 标签的值为 **空字符串3** 时，那么 select 标签会默认选中 **第一个 option 标签** ；
3. 不管将 select 标签绑定的 value 的值设置为 **空字符串** ，或者是 null，或者是 **option** 标签不存在的值，React 都会将 select 标签绑定的 value 的值设置为 **空字符串**；
4. 然后由于当 select 标签绑定的值为空字符串时，会在 **页面视觉** 上，默认选中第一个 option 标签；
5. 如果你此时去拿select的值，拿到的是空字符串；但是通过select标签来拿值，那么拿到的是第一个 option 的值；

也就是说，当值为 **空字符串** 时，页面上显示的效果，和实际值不同！

所以需要通过 js 手动将该 DOM 标签的值设置为空字符串，才可以。

具体解决办法如下（包含 select 标签使用方法）：

```
class HelloWord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gender: ''
        }
        this.select = this.select.bind(this)
    }

    render() {
        return <div>
            <select value={this.state.gender} ref={input => {
                this.DOM = input
            }} onChange={this.select} id='abc'>
                <option value="male">male</option>
                <option value="female">female</option>
            </select>
            <br/>
            你当前选择的性别是：{this.state.gender}
            <button onClick={this.setGender.bind(this)}>点击不设置gender</button>
        </div>
    }

    // 以下这种写法是通用写法
    select(e) {
        let v = e.target.value
        this.setState({
            gender: v
        })
    }

    setGender() {
        this.setState({
            gender: ''
        })
    }

    // 如果假如 select 为空的话，需要通过 ref 手动拿到元素，然后设置 value 的值为空，从而默认不选择值
    componentDidUpdate(preProps, preState) {
        console.log('componentDidUpdate', arguments)
        if (this.state.gender === '') {
            this.DOM.value = ''
        }
    }

    // 如果初始为空的话，也需要在这里手动配置一波，这是组件创建时【生命周期】在挂载完毕时执行的函数
    componentDidMount() {
        console.log('componentDidMount')
        if (this.state.gender === '') {
            this.DOM.value = ''
        }
    }
}
```


<h3>17、组件通信</h3>

这个很好理解，我们开发常面对几种情况：

1. **子组件** 需要使用 **父组件** 的值：通过标签传入，props取值，如：``<Status temperaature={this.state.temperaature}></Status>``
2. **父组件** 需要使用 **子组件** 的值：不能直接将父组件值传入子组件并在子组件修改（不好），应采用父组件传函数到子组件，子组件调用父组件的该函数，并通过函数参数传值；
3. **子组件** 需要使用 **另一个子组件** 的值：将值存储在 **父组件** 中，第一步通过【2】中的方法，数据来源子组件修改存于父组件的值，第二步通过【1】中的方法，目标子组件使用了修改后的值；

这里放一个示例：

父组件Parent 存储变量temperaature，子组件Status 负责显示这个变量的值，子组件Controller 负责修改这个变量的值。

如代码：

```
// 显示组件
class Status extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>
            当前温度：{this.props.temperaature} 摄氏度
        </div>
    }
}

// 控制组件
class Controller extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>
            {/* 通过调用父组件传给子组件的 onControllerChange 来实现修改，传值的不同是参数 */}
            {/* 这两种写法，都可以实现目的，但假如没有在父组件绑定this（应该不会吧），会导致下面那种写法的this指向错误 */}
            <button onClick={e => {
                this.props.onControllerChange(true)
            }}>点击开始自动升温
            </button>
            <button onClick={this.props.onControllerChange.bind(null, false)}>点击开始自动降温</button>
        </div>
    }
}

// 父组件
class Parent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            temperaature: 0
        }
        // 注意，因为这里绑定了this，所以后面子组件再次绑定this是无效的
        this.changeTemplate = this.changeTemplate.bind(this)
        this.timer
    }

    render() {
        return <div>
            <Status temperaature={this.state.temperaature}></Status>
            <Controller temperaature={this.state.temperaature}
                        onControllerChange={this.changeTemplate}></Controller>
        </div>
    }

    changeTemplate(status) {
        console.log(this)
        if (this.timer) {
            clearInterval(this.timer)
        }
        if (status) {
            this.timer = setInterval(() => {
                // 如果大于等于100，则停止计时器并返回
                if (this.state.temperaature >= 100) {
                    return clearInterval(this.timer)
                }
                this.setState({
                    temperaature: this.state.temperaature + 1
                })
            }, 200)
        } else {
            this.timer = setInterval(() => {
                // 如果小于等于-100，则停止计时器并返回
                if (this.state.temperaature <= -100) {
                    return clearInterval(this.timer)
                }
                this.setState({
                    temperaature: this.state.temperaature - 1
                })
            }, 200)
        }
    }
}
```

<h3>18、组合（类似 Vue 组件的插槽）</h3>

在Vue中，假如我们需要让子组件的一部分内容，被父组件控制，而不是被子组件控制，那么我们会采用插槽的写法 ``<slot></slot>`` 

在 React 里也有类似的写法，父组件写法是相同的，但子组件是采用 ``{this.props.children}`` 来实现。

示例：

```
class MyChild extends React.Component {
    render() {
        return <div>
            {this.props.children}
        </div>
    }
}

class WelcomeDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            date: (new Date()).toLocaleTimeString()
        }
        setInterval(() => {
            // 显示内容全部由父组件控制，子组件不关心父组件显示什么，只关心显示在哪里
            this.setState({
                date: (new Date()).toLocaleTimeString()
            })
        }, 1000)
    }

    render() {
        return <div>
            <MyChild>
                {this.state.date}
            </MyChild>
        </div>
    }
}
```

如上代码，子组件展现的内容，是父组件中，子组件标签内含的内容。

---

<b>关于 ``this.props.children`` 这个变量：</b>

以``<MyChild>``为例，注意，这个名字只跟子组件名挂钩，不是固定的。

1. 字符串：``<MyChild>``标签内是一个普通的字符串；
2. 对  象：``<MyChild>``标签内是一个 DOM 元素，例如：``<MyChild> <span>{this.state.date}</span> </MyChild>``；
3. 数  组：``<MyChild>``标签内是多个 DOM 元素，例如：``<MyChild> <span>{this.state.date}</span> <span>{this.state.date}</span> </MyChild>``；

<b>如何获取 ``<MyChild>`` 标签内的二级或者更多级元素？</b>

以以下为例：

```
<MyChild>
    <div>
        abc
        <span>{this.state.date}</span>
    </div>
</MyChild>
```

1. 显然，标签内必须是一个DOM标签；
2. DOM标签里有二级元素，以上为例，有两个元素，分别是一个字符串 ``abc`` 和一个 ``span`` 标签；
3. 那么如何获取这两个元素呢？通过 ``this.props.children.props.children`` 来获取（第一个 children 指传递进来的元素，第二个指二级元素）；
4. ``this.props.children.props.children`` 在以上情况下，是一个数组，数组元素一是字符串 abc，数组元素二，是对象（即 ``span`` 标签）；
5. props 这个属性，不是固定类型的，可能是字符串，也可能是数组或对象，根据该级元素是什么，以及有几个而决定；


示例代码：

```
class MyChild extends React.Component {

    constructor(props) {
        super(props)
        console.log(this.props)
    }

    render() {
        return <div>
            父元素的第一个字符串：{this.props.children.props.children[0]}
            <br/>
            父元素的第二个字符串：{this.props.children.props.children[1]}
        </div>
    }
}

class WelcomeDialog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            date: (new Date()).toLocaleTimeString(),
            year: (new Date()).toLocaleDateString()
        }
        setInterval(() => {
            // 显示内容全部由父组件控制，子组件不关心父组件显示什么，只关心显示在哪里
            this.setState({
                date: (new Date()).toLocaleTimeString(),
                year: (new Date()).toLocaleDateString()
            })
        }, 1000)
    }

    render() {
        return <div>
            <MyChild>
                <div>
                    {this.state.date}
                    {this.state.year}
                </div>
            </MyChild>
        </div>
    }
}
```

当然，如果是纯字符串的话，通过变量 props 直接传入更好一些。

而以上这种写法，更适合传 JSX 语法的 DOM 元素。


<h3>19、继承（事实上还是组合，但展现的效果像是继承）</h3>

我们有时候会面临这样一个情况：

1. 有一个表单；
2. 表单里有单行输入框（input）、多行输入框（textarea），也许还有其他的比如单选框，或多选框；
3. 输入框的样式是统一的，所以希望统一管理；
4. 但每个输入框的验证逻辑不同；
5. 每个输入框都有自己的错误提示；

在往常情况下，我们是这么解决的：

1. 将每个输入框单独拆分成组件，然后表单里依次引入这些组件；
2. 对于 css，因为样式相同，所以采用的是统一的 class，因此可能需要将这些样式单独写入某个css文件，然后在这些样式组件里引入并使用这些类；
3. 在每个组件里写样式，逻辑等；
4. 如果多个样式他们有相同的逻辑，可能需要复制粘贴（优化方式是将这些验证逻辑单独抽象到一个js文件，然后在这些组件里引用这个js文件，并使用这些逻辑）；

示例略。

这种写法，讲道理说，对于一般项目来说，也足够了，优化程度也不差；

但毕竟还有更好的写法，先提思路：

1. 组件分为基础组件和扩展组件；
2. 基础组件是输入框，有样式、HTML 元素、基本的验证逻辑、一些通用的逻辑等（比如通用错误提示）；
3. 扩展组件里内置基础组件，负责 控制值（传到基础组件，但是在这一层控制）、验证逻辑（显然姓名、电话、日期输入框，他们的验证逻辑是不同的）、提示信息（比如 HTML 标签的 title 属性）等；
4. 表单里引入扩展组件；
5. 这意味着，我们在使用的时候，只需要从扩展组件里引入基础组件即可；
6. 在写扩展组件时，只需要专心于逻辑，不需要关心样式等通用性问题；
7. 而写基础组件的时候，只需要关心共性，而不需要关心逻辑，有逻辑则使用逻辑，没有逻辑则执行空函数即可；

附代码（结尾见解释）：

```
// 基础组件
class BaseInput extends React.Component {
    render() {
        let left = {display: 'inline-block', width: '100px'}
        let right = {display: 'inline-block', width: '200px', boxSizing: 'border-box'}
        let DOM
        let changeFn
        if (this.props.onChange) {
            changeFn = e => {
                this.props.onChange(e)
            }
        } else {
            changeFn = () => {
            }
        }
        // 首先，根据类型选择需要的输入框
        if (this.props.type === 'input' | !this.props.type) {
            DOM = <span>
                <span style={left}>{this.props.label}</span>
                <input style={right} type="text"
                       onChange={changeFn}
                       value={this.props.value}/>
            </span>
        } else if (this.props.type === 'textarea') {
            DOM = <span>
                <span style={left}>{this.props.label}</span>
                <textarea style={right} type="text" onChange={changeFn}
                          value={this.props.value}/>
            </span>
        }
        return <div style={{height: '50px'}}>
            {DOM}
            {/* 其次，允许将额外补充内容添加到这里 */}
            {this.props.children}
        </div>
    }
}

class ChineseName extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: ''
        }
        this.verification = this.verification.bind(this)
    }

    verification(e) {
        let v = e.target.value
        // 必须是中文字符
        if (/[\u4e00-\u9fa5]/.test(v)) {
            this.setState({
                value: v
            })
        }
    }

    render() {
        return <BaseInput label={'名字'}
                          type={'input'}
                          value={this.state.value}
                          onChange={this.verification}>
            <span style={{color: 'red'}}>只允许输入中文字符</span>
        </BaseInput>
    }
}

class EnglishName extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: ''
        }
        this.verification = this.verification.bind(this)
    }

    verification(e) {
        let v = e.target.value
        // 只能是英文字母和空白符
        if (!/[^a-zA-Z\s]/.test(v)) {
            this.setState({
                value: v
            })
        }
    }

    render() {
        return <BaseInput label={'英文名'}
                          type={'input'}
                          value={this.state.value}
                          onChange={this.verification}>
            <span style={{color: 'red'}}>只允许输入a~z，或者A~Z，或者空白字符</span>
        </BaseInput>
    }
}

class TextareaInput extends React.Component {
    render() {
        return <BaseInput label={'个人情况'} type={'textarea'}>
            <span style={{color: 'red'}}>请务必填写</span>
        </BaseInput>
    }
}


ReactDOM.render(
    <div>
        <ChineseName/>
        <EnglishName/>
        <TextareaInput/>
    </div>,
    document.getElementById('root')
)
```

说明：

1. BaseInput 是基础组件，他负责开放接口。其他扩展组件只需要关心他开放了哪些接口，然后使用即可；
2. ChineseName 是扩展组件之一（是基础组件的特殊实例）；
3. 通过 props.type 告诉基础组件，基础组件负责选择使用哪一个类型的 HTML 元素（input 或者 textarea）；
4. 通过 props.value 传值给基础组件，基础组件负责将这个指放到指定的位置；
4. 传递验证函数 ``verification`` 给基础组件，基础组件负责管理什么时候调用他；
5. 通过 props.children 告诉基础组件，需要将一些来源于扩展组件的 HTML 元素插入，而基础组件负责决定插入到哪里；

更好的优化方法：

1. 假如这个基础组件更加复杂，可以将基础组件再拆分；
2. 比如拆分为 MyInput 组件和 MyTextArea 组件；
3. 基础组件专心于基础组件本身的样式，以及一些通用逻辑，以及 props.children 放置在哪里等；
4. 细分后的 MyInput 组件，可以专心于搞定 input 输入框的样式，通用逻辑等；

<h3>20、style 写法</h3>

JSX里，写 style 属性，有几点需要注意：

1. 以 k-v （对象）形式来写 style 属性（如果直接写在 html 标签里，容易以为是双大括号，事实上还是单大括号）；
2. key 使用驼峰写法；
3. 值是字符串；
4. 如果想混合多个属性，需要先通过例如 ``Object.assign()`` 将其混合为一个对象，再使用。 **不能** 使用数组或写 2 个 ``style={}`` 来实现；

示例代码：

```
class StyleDemo extends React.Component {
    render() {
        let style = {
            fontSize: '100px',
            color: 'red'
        }
        return <div style={style}>
            这是一段红色文字
        </div>
    }
}
```

<h3>21、class 写法</h3>

有几点注意：

1. 写在标签里的时候，不是 ``class = "xxx"``， 而是 ``className = "xxx"``；
2. 值是字符串，自行拼空格；

示例代码：

```
class StyleDemo extends React.Component {
    render() {
        let myClass = 'abc def'
        return <div className={myClass}>
            这是一段红色文字
        </div>
    }
}
```

<h3>22、JSX</h3>

【1】标签名可以是对象的属性（前提对象属性是一个组件）

这种情况下，对象和属性的首字母，可以不大写（但 **建议大写** ，以作区分）

```
let MyDom = {
    my() {
        return <p>这是一行</p>
    }
}

class MyInput extends React.Component {
    render() {
        return <div>
            <MyDom.my/>
        </div>
    }
}
```

【2】标签名不能是表达式（注意和上面的区别）：

也就是说，通过标签名，你可以得到一个确定的组件，而不是一个只有在运行时，才能确认加载哪个组件。

【3】表达式：

可以用的简单，不能用的，当然就是 if 判断语句，或者是 for 循环啦，以及类似的东西。

不过函数是可以用的（注意是否成功返回 JSX 或者 你需要的内容，千万不要表达式的结果是一个函数，而不是函数运行的结果）

示例代码：

```
class Demo extends React.Component {
    constructor() {
        super()
        this.state = {
            arr: ['a', 'b', 'c']
        }
    }

    render() {
        return <div>
            {
                this.state.arr.map((item, index) => <p key={index}>{item}</p>)
            }
        </div>
    }
}
```

【4】未传值则默认传值为true：

```
class Demo extends React.Component {
    render() {
        return <div>
            {/* 以下两个，效果相同 */}
            <input type='checkbox' checked={true}/>
            <input type='checkbox' checked/>
        </div>
    }
}
```

【5】同时传多个属性：

如果觉得一个一个写绑定属性太麻烦了，那么可以用 es6 的对象的扩展操作符来实现。

不过唯一有问题的地方在于，假如你需要传一个state的变量，那么这种写法可能导致，state 被更新后，无法正常渲染到子组件（当然，也不是没办法解决，比如赋值的代码，写在生命周期里）。

```
class MyInput extends React.Component {
    render() {
        return <input value={this.props.theValue} onChange={e => {
            this.props.changeEvent.call(null, e)
        }}/>
    }
}

class Demo extends React.Component {
    constructor() {
        super()
        this.state = {
            value: ''
        }
        this.changeEvent = this.changeEvent.bind(this)
        this.myProps = {
            // theValue: this.state.value,  // 这种写法是不可以的，因为是 state 变量
            changeEvent: this.changeEvent
        }
    }

    render() {
        return <div>
            <MyInput theValue={this.state.value} {...this.myProps}/>
        </div>
    }

    changeEvent(e) {
        this.setState({
            value: e.target.value
        })
    }
}
```

【6】不会被显示的内容：

false、null、undefined 和 true 都是有效的，但它们不会直接被渲染：

如果你需要显示字符串形式的以上，可以通过 js 表达式，将他们转为字符串；

如果想选择性的显示一个 DOM，可以通过表达式来实现；



<h3>23、</h3>

<h3>24、</h3>

<h3>25、</h3>

<h3>26、</h3>