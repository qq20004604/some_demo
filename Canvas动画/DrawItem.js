/**
 * Created by 王冬 on 2017/10/1.
 * QQ: 20004604
 * weChat: qq20004604
 */
// 绘制单个元素
// 需要考虑时间、x轴坐标、y轴坐标这三个关系
// 其中x轴坐标依赖于时间，y轴坐标依赖于x轴坐标
// x轴需要给出随着时间与x的关系。即xBySecond（每1000ms的x变化值）
// 实际x = time / 1000 * xBySecond
// y轴坐标需要增加两个系数hundredPercent和Max


    // 基类：绘制类
class DrawItem {
    constructor (options) {
        let defaultOptions = {
            // x轴依赖于实际时间变化递增，或者是随绘制次数而递增
            isCountNotDate: false,
            color: '#000',  // 默认颜色
            // x和y实际坐标，超出这个范围，draw会返回false，然后ToolOfCanvas类会删除本元素
            MinX: -500,
            MaxX: 500,
            MinY: -300,
            MaxY: 300,
            radius: 3   // 半径
        }
        Object.assign(this, defaultOptions, options)

        // 如果是true，表示每次draw后递增x值。false表示根据自然时间流逝增加x值
        if (this.isCountNotDate) {
            this.timeCount = 0
        } else {
            this.beginTime = Number(new Date())
        }
    }

    draw (ctx) {
        ctx.fillStyle = this.color
        ctx.beginPath()
        let x = this.getRectX()
        let y = this.getRectY()
        ctx.arc(x, y, this.radius, 0, 2 * Math.PI)
        // console.log(this.getRectX(), this.getRectY())
        ctx.fill()
        ctx.closePath()
        if (this.isCountNotDate) {
            this.timeCount += 33
        }
        if (x > this.MaxX || x < this.MinX || y > this.MaxY || y < this.MinY) {
            return false
        }
        return true
    }
}

// 子类，算法类
// 必备两个方法getRectX、getRectY
class SinItem extends DrawItem {
    constructor (options = {}) {
        let defaultOptions = {
            // 实际y = y / hundredPercentY * MaxHeight + offsetY
            hundredPercentY: 1.2,   // 当理论上y是多少时，在y轴上移动了100%的距离
            MaxHeight: 150,  // 表示y坐标上的值
            offsetY: 140,   // y坐标偏移值
            // 理论x值每秒增加数值
            xBySecond: 1.5,
            // 理论x值乘以increaseX将是实际x值
            increaseX: 50,
            // x、y坐标的实际偏移值（px）
            offsetX: 0,
            // 随机，乘法计算
            isRandomX: true,
            MaxRandomX: 1.1,
            isRandomY: true,
            MaxRandomY: 1.1,
            color: Math.random() > 0.5 ? '#3e3' : '#494'
        }
        let opts = Object.assign(defaultOptions, options)
        super(opts)
    }

    // 理论x
    getX () {
        if (this.isCountNotDate) {
            return this.timeCount / 1000 * this.xBySecond
        } else {
            return (Number(new Date()) - this.beginTime) / 1000 * this.xBySecond
        }
    }

    // 实际x坐标
    getRectX () {
        let x = this.getX() * this.increaseX + this.offsetX
        if (this.isRandomX) {
            x *= this.MaxRandomX
        }
        return x
    }

    // 理论y值
    getY () {
        return Math.sin(this.getX())
    }

    // 实际y坐标
    getRectY () {
        let y = this.getY() / this.hundredPercentY * this.MaxHeight + this.offsetY
        if (this.isRandomY) {
            y *= this.MaxRandomY
        }
        return y
    }
}

// 抛物线
class Parabola extends DrawItem {
    constructor (options = {}) {
        let defaultOptions = {
            // 实际y = y / hundredPercentY * MaxHeight + offsetY
            hundredPercentY: 5,   // 当理论上y是多少时，在y轴上移动了100%的距离
            MaxHeight: 300,  // 表示y坐标上的值
            offsetY: -250,   // y坐标偏移值
            // 理论x值每秒增加数值，更改这个可以影响动画速度
            xBySecond: 2,
            // 理论x值乘以increaseX将是实际x值
            increaseX: 50,
            // x、y坐标的实际偏移值（px）
            offsetX: 250,
            // 随机，乘法计算
            isRandomX: true,
            MaxRandomX: 1.1,
            isRandomY: true,
            MaxRandomY: 1.1,
            MinX: -500,
            MaxX: 500,
            MinY: -300,
            MaxY: 500,
            color: Math.random() > 0.5 ? '#3e3' : '#494'
        }
        let opts = Object.assign(defaultOptions, options)
        super(opts)
        this.toLeft = Math.random() > 0.5 ? true : false
    }

    // 理论x
    getX () {
        let x
        if (this.isCountNotDate) {
            x = this.timeCount / 1000 * this.xBySecond
        } else {
            x = (Number(new Date()) - this.beginTime) / 1000 * this.xBySecond
        }
        return x
    }

    // 实际x坐标
    getRectX () {
        let x = this.getX() * this.increaseX
        if (this.isRandomX) {
            x *= this.MaxRandomX
        }
        x += this.offsetX
        if (this.toLeft) {
            x = -this.MinX - x
        }
        return x
    }

    // 理论y值
    getY () {
        let x = this.getX() - 3
        return 0.5 * x * x + 0 * x + 4.7
    }

    // 实际y坐标
    getRectY () {
        let y = this.getY() / this.hundredPercentY * this.MaxHeight + this.offsetY
        if (this.isRandomY) {
            y *= this.MaxRandomY
        }
        return y
    }
}

export {SinItem, Parabola}