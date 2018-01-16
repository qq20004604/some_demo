import React from 'react';
import ReactDOM from 'react-dom';

class Child extends React.Component {
    constructor(props) {
        console.log('4、constructor 【子组件】构造函数')
        super(props);
        this.todo = false
    }

    componentWillMount() {
        console.log('5、componentWillMount 【子组件】挂载前')
    }

    componentDidMount() {
        console.log('7、componentDidMount 【子组件】挂载后执行')
    }

    componentWillReceiveProps(props) {
        console.log('---->C、 componentWillReceiveProps 【子组件】当父组件的 state 改变后，这个函数会被执行。props的值：', props)
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log('---->D、 shouldComponentUpdate 【子组件】当state被改变后，这个函数会被执行，如果返回true，那么会触发render，否则不会触发render。但注意，事实上的值都会被更新', nextProps, nextState)
        this.todo = !this.todo
        if (!this.todo) {
            return false
        }
        return true
    }

    // 修改参数在这里比较好，不要在 render 里做事
    componentWillUpdate(nextProps, nextState) {
        console.log('---->E、 componentWillUpdate(nextProps, nextState) 【子组件】，render渲染前执行')
    }

    // 渲染完毕后执行，会优先执行子组件的渲染函数
    componentDidUpdate() {
        console.log('---->F、 componentDidUpdate 【子组件】 子组件的render已经渲染完毕')
    }

    render() {
        console.log('6、render 【子组件】渲染完毕')
        return <div>child</div>
    }
}

class HelloWord extends React.Component {
    constructor(props) {
        console.log('1、constructor 【父组件】构造函数')
        super(props);
        this.state = {
            count: 0
        }
        this.clickCount = this.clickCount.bind(this)
    }

    // 父组件挂载前，类似 Vue 的 created
    componentWillMount() {
        console.log('2、componentWillMount 【父组件】挂载前')
    }

    // 父组件已经挂载好啦，感觉类似 Vue 的 mounted
    componentDidMount() {
        console.log('8、componentDidMount 【父组件】挂载后执行')
    }

    // 到底要不要重新渲染 render 呢？
    shouldComponentUpdate(nextProps, nextState) {
        console.log('---->A、 shouldComponentUpdate 【父组件】当state被改变后，这个函数会被执行，如果返回true，那么会触发render，否则不会触发render。但注意，事实上的值都会被更新', nextProps, nextState)
        if (nextState.count % 2) {
            return true
        }
        return false
    }

    // state 变化，修改参数在这里比较好，不要在 render 里做事
    componentWillUpdate(nextProps, nextState) {
        console.log('---->B、 componentWillUpdate(nextProps, nextState) 【父组件】，render渲染前执行')
    }

    // 渲染完毕后执行，会优先执行子组件的渲染函数
    componentDidUpdate() {
        console.log('---->G、 componentDidUpdate 【父组件】 父组件的render已经渲染完毕')
    }

    // 渲染函数，this 指向实例本身
    render() {
        console.log('3、render 【父组件】')
        return <div>
            <Child></Child>
            <button onClick={this.clickCount}>当前{this.state.count}，点击增加1</button>
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
    </div>,
    document.getElementById('root')
)