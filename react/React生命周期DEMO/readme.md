<h3>12、生命周期</h3>


<b>参考链接：</b>

[React组件生命周期小结](https://www.jianshu.com/p/4784216b8194)

<b>组件结构：</b>

父组件套用子组件

<b>初次渲染：</b>

1. constructor 【父组件】构造函数
2. componentWillMount 【父组件】挂载前
3. render 【父组件】渲染
4. constructor 【子组件】构造函数
5. componentWillMount 【子组件】挂载前
6. render 【子组件】渲染完
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

生命周期表格：

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