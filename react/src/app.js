import React from 'react';
import ReactDOM from 'react-dom';

class ChildDemo extends React.Component {
    render() {
        return <div>
            <input type="text" ref={this.props.getInput}/>
        </div>
    }
}

class RefsDemo extends React.Component {
    render() {
        return <div>
            {/* 因为函数简单，所以直接写到这里，箭头函数自带绑定this到声明时的作用域 */}
            <ChildDemo getInput={DOM => {
                console.log(DOM)
                this.myInput = DOM
            }}/>
        </div>
    }

    // 注释掉
    // getInput(DOM) {
    //     console.log(DOM)
    //     this.myInput = DOM
    // }
}

ReactDOM.render(
    <div>
        <RefsDemo/>
    </div>,
    document.getElementById('root')
)