import React from 'react';
import ReactDOM from 'react-dom';

function formatDate(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

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

ReactDOM.render(
    <div>
        <HelloWord mmm={'mmm'}/>
    </div>,
    document.getElementById('root')
)