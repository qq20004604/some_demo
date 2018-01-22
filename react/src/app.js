import React from 'react';
import ReactDOM from 'react-dom';

function formatDate(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

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