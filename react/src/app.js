import React from 'react';
import ReactDOM from 'react-dom';

function formatDate(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

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

ReactDOM.render(
    <div>
        <HelloWord/>
    </div>,
    document.getElementById('root')
)