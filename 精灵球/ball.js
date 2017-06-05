/**
 * Created by 王冬 on 2017/6/1.
 * 下一步优化：
 * 1、将动画路径通过config.js来进行配置；
 * 2、将按下、移动、弹起分别抽象出一个接口（同时包含鼠标和touch），然后在回调函数里配置具体的代码
 */

//移动端大小变化监听
// 屏幕宽度小于等于640px宽度下，宽度为32rem。大于640px宽度，宽度为 (浏览器宽度 / 20)rem
function listenWindowResize(baseFontSize) {
    //这里是假设在640px宽度设计稿的情况下，1rem = 20px；
    //可以根据实际需要修改
    //如果传参了，那么根据参数来设置（参数是1rem=baseFontSize px）（设计稿为640px宽）

    var fun = function (doc, win) {
        var docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            recalc = function () {
                var clientWidth = docEl.clientWidth;
                if (!clientWidth) return;
                var fontSize = (baseFontSize ? baseFontSize : 20) * (clientWidth / 640);
                if (fontSize > 20) {
                    fontSize = 20;
                }
                docEl.style.fontSize = fontSize + 'px';
            };
        if (!doc.addEventListener) return;
        win.addEventListener(resizeEvt, recalc, false);
        doc.addEventListener('DOMContentLoaded', recalc, false);
    }
    fun(document, window);
}


$(function () {

    var $ball = $("#ball");
    var $pet = $("#pet");
    //是否正处于移动状态（鼠标按下后符合）
    var isMoving = false;
    //按下时的Y
    var downY = 0;
    //最大偏移Y，超过这个的就等于他
    var maxOffsetY = 1000;
    //累计Y值（多次移动）
    var totalOffsetY = 0;

    //监听鼠标移动
    function listenTouchMove() {
        var downFun = function (ev) {
            isMoving = true;
            downY = ev.clientY;
            if (ev.changedTouches) {
                downY = ev.changedTouches[0].clientY;
            } else {
                downY = ev.clientY;
            }
        }
        var upFun = function (ev) {
            isMoving = false;
            //距离按下时的偏离值
            var clientY = 0;
            if (ev.changedTouches) {
                clientY = ev.changedTouches[0].clientY;
            } else {
                clientY = ev.clientY;
            }
            //距离按下时的偏离值
            var y = clientY - downY;
            totalOffsetY = totalOffsetY + y;
            //当累计y偏移
            if (totalOffsetY < 0) {
                totalOffsetY = 0;
            } else if (totalOffsetY > maxOffsetY) {
                totalOffsetY = maxOffsetY;
            }
        }
        var moveFun = function (ev) {
            if (!isMoving) {
                return;
            }
            //距离按下时的偏离值
            var clientY = 0;
            if (ev.touches) {
                clientY = ev.touches[0].clientY;
            } else {
                clientY = ev.clientY;
            }
            console.log(clientY)
            var offsetY = clientY - downY;
            var thisY = totalOffsetY + offsetY;
            if (thisY < 0) {
                thisY = 0;
            } else if (thisY > maxOffsetY) {
                thisY = maxOffsetY;
            }
            toAnitmate(thisY);
            if (ev.which === 0 && !ev.touches) {
                var y = ev.clientY - downY;
                totalOffsetY = totalOffsetY + y;
                isMoving = false;
            }
        }

        $("#back").mousedown(downFun);
        $("#back").mouseup(upFun);
        $("#back").mousemove(moveFun);
        var back = document;
        back.addEventListener("touchstart", downFun, false);
        back.addEventListener("touchend", upFun, false);
        back.addEventListener("touchmove", moveFun, false);
    }

    //动画函数，根据Y值偏离而动画
    function toAnitmate(offsetY) {
        //累计偏离小于200，参照excel说明
        if (offsetY < 200) {
            //向下移动
            var top = computed(0, 200, 0, 10, offsetY);
            $ball.css("top", top);
            rotateBall($ball, 0);
            $pet.width(0);
            $pet.height(0);
        }
        else if (offsetY < 400) {
            //变大
            var size = computed(200, 400, 10, 10, offsetY);
            $ball.css("width", size);
            $ball.css("height", size);
            var left = computed(200, 400, 0, -5, offsetY);
            $ball.css("left", left);
            var top = computed(200, 400, 10, -5, offsetY);
            $ball.css("top", top);
            rotateBall($ball, 0);
            $pet.width(0);
            $pet.height(0);
        }
        else if (offsetY < 700) {
            //旋转
            var rotate = computed(400, 700, 0, 360, offsetY, true);
            rotateBall($ball, rotate);
            $pet.width(0);
            $pet.height(0);
        }
        else if (offsetY < 800) {
            //球变小 + 小精灵变大
            var rotate = 0;
            rotateBall($ball, rotate);
            //球变小
            //20 + 0~-10
            var size = computed(700, 800, 20, -20, offsetY);
            $ball.css("width", size);
            $ball.css("height", size);
            //-5 + 0~5
            var left = computed(700, 800, -5, 10, offsetY);
            $ball.css("left", left);
            //5 + 0~5
            var top = computed(700, 800, 5, 5, offsetY);
            $ball.css("top", top);

            $pet.width(0);
            $pet.height(0);
        } else if (offsetY < 1000) {
            $ball.css("width", 0);
            $ball.css("height", 0);

            //精灵变大
            var petSize = computed(800, 1000, 0, 20, offsetY);
            $pet.width(petSize);
            $pet.height(petSize);
            var petLeft = computed(800, 1000, 5, -10, offsetY);
            $pet.css("left", petLeft);
            var petTop = computed(800, 1000, 15, -10, offsetY);
            $pet.css("top", petTop);
        }
    }

    //计算属性，线性变化
    function computed(base, max, baseCount, maxCount, now, donnotHaveRem) {
        /*  参数解释：
         * 例如200~400offset区间，当前offset是300，变化值是10rem + 0~10rem
         * base  基础数值。比如上面的200offset
         * max   最大数值，比如上面的400offset
         * baseCount    基础变化值，比如上面的10
         * maxCount     最大变化值，比如上面的0~10里面的10（强制最小为0，有需要请改动基础变化值）
         * now   当前数值，比如上面的300offset
         * */
        var size = (now - base) / (max - base) * maxCount + baseCount;
        if (!donnotHaveRem) {
            size += "rem";
        }
        return size;
    }

    function rotateBall($ball, rotate) {
        $ball.css("-webkit-transform", "rotateZ(" + rotate + "deg)");
        $ball.css("-moz-transform", "rotateZ(" + rotate + "deg)");
        $ball.css("-ms-transform", "rotateZ(" + rotate + "deg)");
        $ball.css("-o-transform", "rotateZ(" + rotate + "deg)");
        $ball.css("transform", "rotateZ(" + rotate + "deg)");
    }

    listenWindowResize();
    listenTouchMove();
    $("#auto").click(function (ev) {
        $("#auto").hide();
        ev.preventDefault();
        totalOffsetY = 0;
        var timer = setInterval(function () {
            if (totalOffsetY > maxOffsetY) {
                totalOffsetY = maxOffsetY;
                clearInterval(timer);
                $("#auto").show();
                return;
            }
            totalOffsetY += 5;
            toAnitmate(totalOffsetY);
        }, 20);
    })

})
