/**
 * Created by 王冬 on 2018/1/23.
 * QQ: 20004604
 * weChat: qq20004604
 */

// React DEMO
import * as React from "react";
import * as ReactDOM from "react-dom";

export interface HelloProps {
    compiler: string;
    framework: string;
}

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export class Hello extends React.Component<HelloProps, {}> {
    render() {
        return <h1>Hello from {this.props.compiler} and {this.props.framework}!</h1>;
    }
}

ReactDOM.render(
    <Hello compiler="TypeScript" framework="React"/>,
    document.getElementById("root")
);

// 普通 DEMO
let a = 1;

function Foo(val: number) {
    return val * 3
}

function Bar(val: string) {
    return val + '：123'
}

let baz = Bar(String(Foo(a)))

function CreateDOM(str: string) {
    let DOM = document.createElement('div')
    DOM.innerHTML = str
    return DOM
}

let RootDOM = document.querySelector("#root")
if (RootDOM) {
    RootDOM.appendChild(CreateDOM(baz))
}
