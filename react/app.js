import React from 'react';
import ReactDOM from 'react-dom';

function formatDate(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

let domClass = 'container parent'

// const element = (<h1>
//     <p class={domClass + ' abc'}>Hello, world!</p>
//     <p>当前时间是：{formatDate(new Date())}</p>
// </h1>)

// let p1 = React.createElement(
//     'p',
//     {className: domClass + 'abc'},
//     'Hello, world!'
// )

function P1() {
    return <p className={domClass + " abc"}>Hello, world!</p>
}

setInterval(() => {
    ReactDOM.render(
        <h1>
            <P1 name="p1"/>
            <p>当前时间是：{formatDate(new Date())}</p>
        </h1>,
        document.getElementById('root')
    );
}, 1000)

ReactDOM.render(
    <h1>
        <P1 />
        <p>当前时间是：{formatDate(new Date())}</p>
    </h1>,
    document.getElementById('root')
);