/**
 * Created by 王冬 on 2018/1/23.
 * QQ: 20004604
 * weChat: qq20004604
 */

// React DEMO
import * as React from "react";
import * as ReactDOM from "react-dom";

interface UserInputState {
    totalPrice: string;
    downPayment: string;
}

class UserInput extends React.Component <{}, UserInputState> {
    constructor(props: object) {
        super(props)
        this.state = {
            totalPrice: '',
            downPayment: ''
        }
        this.changeValue = this.changeValue.bind(this)
    }

    render() {
        return <div>

            <label>
                房价总计：<input value={this.state.totalPrice} onChange={this.changeValue.bind(null, 'totalPrice')}/><b>万</b>
            </label>
            <label>
                首付比例：
                <select value={this.state.downPayment} onChange={this.changeValue.bind(null, 'downPayment')}>
                    <option value="0.1">一成</option>
                    <option value="0.2">两成</option>
                    <option value="0.3" selected>三成</option>
                    <option value="0.4">四成</option>
                    <option value="0.5">五成</option>
                    <option value="0.6">六成</option>
                    <option value="0.7">七成</option>
                    <option value="0.8">八成</option>
                    <option value="0.9">九成</option>
                </select>
            </label>
            <label>
                年利率：<input id="年利率" value="6"/><b>％</b>
            </label>
            <label>
                总计年数：<input id="总计年数" value="30"/><b>年</b>
            </label>
            <label>
                CPI年均通货膨胀：<input id="CPI年均通货膨胀" value="3"/><b>％</b>
            </label>
        </div>
    }

    changeValue(type: string, input: any): void {
        let DOM: (HTMLInputElement | HTMLSelectElement) = input.target
        let value: string = DOM.value
        let obj: object = {
            [type]: value
        }
        this.setState(obj)
        // if (type === 'totalPrice') {
        //     this.setState({
        //         totalPrice: value
        //     })
        // } else if (type === 'downPayment') {
        //     this.setState({
        //         downPayment: value
        //     })
        // }
    }
}


ReactDOM.render(
    <div>
        <UserInput/>
    </div>,
    document.getElementById('root')
)