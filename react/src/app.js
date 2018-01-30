import React from 'react';
import ReactDOM from 'react-dom';

class RefsDemo extends React.Component {
    constructor() {
        super()
        this.state = {
            a: 1,
            b: 2
        }
        this.change = this.change.bind(this)
    }

    render() {
        return <div>
            <input type="text" value={this.state.a} onChange={e => {
                this.change('a', e)
            }}/>
        </div>
    }

    change(type, e) {
        console.log(type, e)
    }
}

ReactDOM.render(
    <div>
        <RefsDemo/>
    </div>,
    document.getElementById('root')
)