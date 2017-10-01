/**
 * Created by 王冬 on 2017/10/1.
 * QQ: 20004604
 * weChat: qq20004604
 */
class ToolOfCanvas {
    constructor (canvasNode, {
        drawItems = undefined,
        FPS = 30
    } = {}) {
        this.ctx = canvasNode.getContext('2d');
        this.width = canvasNode.width
        this.height = canvasNode.height
        // 需要被绘制的都被放入这里面
        if (Object.prototype.toString.call(drawItems) === '[object Array]') {
            this.drawList = new Set([...drawItems])
        } else {
            this.drawList = new Set(drawItems ? [drawItems] : drawItems)
        }
        this.drawFPS = FPS
        this.drawManagerTool = {
            autoTimer: 0,
            isWorking: false
        }
    }

    // 将绘制单位添加到绘制列表里
    addIntoDrawList (drawItems) {
        if (Object.prototype.toString.call(drawItems) === '[object Array]') {
            drawItems.forEach(item => {
                this.drawList.add(item)
            })
        } else {
            this.drawList.add(drawItems)
        }
    }

    // 绘制函数
    beginDrawing () {
        this.drawManagerTool.autoTimer = setInterval(() => {
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.drawList.forEach(item => {
                try {
                    // 如果返回false，那么将从drawList里移除他
                    if (!item.draw(this.ctx)) {
                        new Promise(resolve => {
                            resolve()
                        }).then(_ => this.drawList.delete(item))
                    }
                } catch (err) {
                    console.error(`↓↓ The item can't use 'draw()'↓↓。Error message is: ${err}`)
                    console.error(item)
                }
            })
        }, 1000 / this.drawFPS)
        this.drawManagerTool.isWorking = true
    }

    // 停止绘制
    stopDrawing () {
        if (this.drawManagerTool.isWorking) {
            clearInterval(this.drawManagerTool.autoTimer)
            this.drawManagerTool.isWorking = false
            return true
        } else {
            console.error(`CanvasDraw isn't working, you don't need to stop it!`)
            return false
        }
    }
}

export default ToolOfCanvas