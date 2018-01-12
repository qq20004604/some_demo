import React from 'react';
import ReactDOM from 'react-dom';
import Leaner from './Leaner';

function formatDate(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

let domClass = 'container parent'

class HelloWord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            seconds: 0
        }
        setInterval(() => {
            this.setState({
                seconds: this.state.seconds + 1
            })
        }, 1000)
    }

    render() {
        return <div className={domClass}>
            你好，距离上一次修改页面，过去了{this.state.seconds}秒
        </div>
    }
}

ReactDOM.render(
    <div>
        <HelloWord/>
        <p>当前时间是：{formatDate(new Date())}</p>
        <Leaner/>
    </div>,
    document.getElementById('root')
);