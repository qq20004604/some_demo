/**
 * Created by 王冬 on 2017/10/1.
 * QQ: 20004604
 * weChat: qq20004604
 */
import ToolOfCanvas from './ToolOfCanvas.js'
import {Parabola, SinItem} from './DrawItem.js'

function randomColor () {
    let str = 'rgb('
    str += parseInt(Math.random() * 255) + ', '
    str += parseInt(Math.random() * 255) + ', '
    str += parseInt(Math.random() * 255) + ')'
    return str
}

let tool = new ToolOfCanvas(document.getElementById('canvas'), {FPS: 60})
tool.beginDrawing()

let isSinItemRunning = false
let isParabolaRunning = true

setInterval(() => {
    if (isSinItemRunning) {
        let foo = new SinItem({
            offsetX: Math.random() * 100 - 100,
            MaxRandomX: 1 + Math.random() * 0.2 - 0.1,
            MaxRandomY: 1 + Math.random() * 0.2 - 0.1,
            radius: Math.random() * 1 + 2
        })
        tool.addIntoDrawList(foo)
    }
    if (isParabolaRunning) {
        let bar = new Parabola({
            MaxRandomX: 1 + Math.random() * 1 - 0.75,
            isRandomY: false,
            radius: Math.random() * 1 + 2,
            color: randomColor()
        })
        tool.addIntoDrawList(bar)
    }
}, 20)

document.getElementById('Parabola').onclick = function () {
    isParabolaRunning = !isParabolaRunning
}
document.getElementById('SinItem').onclick = function () {
    isSinItemRunning = !isSinItemRunning
}