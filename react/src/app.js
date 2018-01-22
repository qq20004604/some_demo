import React from 'react';
import ReactDOM from 'react-dom';


class Demo extends React.Component {
    constructor() {
        super()
        this.state = {
            display: ''
        }
        this.change = this.change.bind(this)
    }

    render() {
        return <div>
            {this.state.display && <button onClick={this.change}>现在是【A】，点击切换</button>}
            {!this.state.display && <button onClick={this.change}>点击切换，现在是【B】</button>}
        </div>
    }

    change() {
        this.setState({
            display: !this.state.display
        })
    }
}

ReactDOM.render(
    <div>
        <Demo/>
    </div>,
    document.getElementById('root')
)