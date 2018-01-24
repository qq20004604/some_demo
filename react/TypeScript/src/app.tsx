/**
 * Created by 王冬 on 2018/1/23.
 * QQ: 20004604
 * weChat: qq20004604
 */

// React DEMO
import * as React from "react";
import * as ReactDOM from "react-dom";

import {Hello} from "./Hello";

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
