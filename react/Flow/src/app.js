/* @flow */
function multiple10(num: number) {
    return num * 10
}

multiple10(123)

function getLength(str) {
    return str.length
}

getLength('3')
getLength([1, 2, 3])

var DOM = document.createElement('div')
DOM.innerHTML = '123'
window.document.body.appendChild(DOM)