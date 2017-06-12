/**
 * Created by 王冬 on 2017/6/9.
 */

//选择器
window.$ = function (selector) {
    if (selector.charAt(0) === '#') {
        return document.querySelector(selector)
    } else {
        return document.querySelectorAll(selector);
    }
}

let config = {
    imgSize: 39
}

let info = {
    size: 19,
    first: "black",
    // 下棋的每一步都存在这里，索引为0的地方，是棋盘(1, 1)的位置；
    // html标签的索引值let index = info.steps[info.steps.length - 1] + 1;
    steps: [],
    gameover: false
}

let start = function (isCreate) {
    let size = 0;
    if (isCreate) {
        //创建棋盘
        size = Number($("#size").value);
        info.size = size;
    } else {
        size = info.size
    }
    info.gameover = false;

    $("#checkerboard").innerHTML = "";

    //长宽 = size * config.imgSize单个图片尺寸
    $("#checkerboard").style.width = size * config.imgSize + "px";
    $("#checkerboard").style.height = size * config.imgSize + "px";


    for (let i = 1; i <= size * size; i++) {
        //四个角是|__型
        if (i === 1) {
            $("#checkerboard").append(createBox(["two", "left-top"], i));
        } else if (i === size) {
            $("#checkerboard").append(createBox(["two", "right-top"], i));
        } else if (i === size * (size - 1) + 1) {
            $("#checkerboard").append(createBox(["two", "left-bottom"], i));
        } else if (i === size * size) {
            $("#checkerboard").append(createBox(["two", "right-bottom"], i));
        } else if (i < size) {
            //第一排是横线T字
            $("#checkerboard").append(createBox(["three", "top"], i));
        } else if (i > size && i < size * (size - 1) && i % size === 1) {
            //左列
            $("#checkerboard").append(createBox(["three", "left"], i));
        } else if (i > size && i <= size * (size - 1) && i % size === 0) {
            //右列
            $("#checkerboard").append(createBox(["three", "right"], i));
        } else if (i > size * (size - 1)) {
            $("#checkerboard").append(createBox(["three", "bottom"], i));
        } else {
            $("#checkerboard").append(createBox(["four"], i));
        }
    }
    //棋盘创建完毕

    //初始化下棋步骤
    info.steps = [];
    changeColor();
}

//事件代理，避免重复绑定事件
let checkerboardClick = function (evt) {
    if (info.gameover) {
        return;
    }
    let dom = evt.target;
    let index = dom.getAttribute("index") - 1;
    if (checkCanPutPiece(index)) {
        createPiece(index);
    } else {
        return;
    }
    //如果有胜利者
    let isWin = whoIsWinner();
    if (isWin) {
        info.gameover = true;
        let winner = info.steps.length % 2 ? "黑方" : "白方";
        $("#winner").innerHTML = winner + "胜利！<br>" + isWin;
        $("#thisOrder").innerHTML = "游戏结束！";
    }
}

//悔棋
let backPiece = function () {
    let index = info.steps.pop();
    let child = $(".box")[index].children[0];
    $(".box")[index].removeChild(child);
    changeColor(index);
}

//创建<div class="box"></div>
//参数是数组，是额外添加的类名
let createBox = function (classNames, index) {
    let box = document.createElement("div");
    box.classList.add("box");
    if (classNames) {
        classNames.forEach(item => {
            box.classList.add(item);
        })
    }
    if (typeof index !== "undefined") {
        box.setAttribute("index", index);
    }
    return box;
}

//创造棋子
let createPiece = function (index) {
    let piece = document.createElement("div");
    piece.classList.add("piece");
    //奇数步为黑
    if ((info.steps.length + 1) % 2 === 1) {
        piece.classList.add("black");
    } else {
        piece.classList.add("white");
    }
    $(".box")[index].append(piece);
    //记录当前步数
    info.steps.push(index);

    //颜色转变
    changeColor();
}


//判断是否可以下这一步棋
let checkCanPutPiece = function (index) {
    if (info.steps.indexOf(index) > -1) {
        return false;
    } else {
        return true;
    }
}


//切换颜色
let changeColor = function () {
    if ((info.steps.length + 1) % 2 === 1) {
        $("#thisOrder").innerHTML = "<span style='background-color:white;color:black;display:inline-block;width:100%;'>黑方</span>"
    } else {
        $("#thisOrder").innerHTML = "<span style='background-color:black;color:white;display:inline-block;width:100%;'>白方</span>"
    }
}

//胜负判断
let whoIsWinner = function () {
    //先获取最后一步的索引
    let index = info.steps[info.steps.length - 1];
    let rect = rectTransformation.changeIndexToXY(index);
    //以该位置为中心，下来取横、竖、左上到右下、右上到左下四个数组
    //每个数组长度为9，当前索引为第5个元素
    let Left_Right = [];
    let Top_Bottom = [];
    let TopLeft_BottomRight = [];
    let TopRight_BottomLeft = [];
    //通过当前坐标的x、y坐标，计算和他相连的每个方向8个棋子的坐标值
    for (let i = -4; i < 5; i++) {
        Left_Right.push({
            x: rect.x + i,
            y: rect.y
        });
        Top_Bottom.push({
            x: rect.x,
            y: rect.y + i
        });
        TopLeft_BottomRight.push({
            x: rect.x + i,
            y: rect.y + i
        });
        TopRight_BottomLeft.push({
            x: rect.x - i,
            y: rect.y + i
        });
    }
    //排除过界元素
    Left_Right = filter.beyondBorder(Left_Right);
    Top_Bottom = filter.beyondBorder(Top_Bottom);
    TopLeft_BottomRight = filter.beyondBorder(TopLeft_BottomRight);
    TopRight_BottomLeft = filter.beyondBorder(TopRight_BottomLeft);

    //排除颜色不同的棋子、以及不存在的棋子
    Left_Right = filter.filterSameColor(Left_Right);
    Top_Bottom = filter.filterSameColor(Top_Bottom);
    TopLeft_BottomRight = filter.filterSameColor(TopLeft_BottomRight);
    TopRight_BottomLeft = filter.filterSameColor(TopRight_BottomLeft);

    let haveWin = "";
    if (isWin(Left_Right)) {
        haveWin += "左右一排五子连珠，";
    }
    if (isWin(Top_Bottom)) {
        haveWin += "上下一排五子连珠，";
    }
    if (isWin(TopLeft_BottomRight)) {
        haveWin += "左上右下一排五子连珠，";
    }
    if (isWin(TopRight_BottomLeft)) {
        haveWin += "左下右上五子连珠，";
    }
    if (haveWin) {
        return haveWin
    } else {
        return false;
    }

}

//x、y坐标与索引转换函数
let rectTransformation = {
    changeIndexToXY  (index) {
        //index从0开始，左上角坐标为(1,1)
        let x = index % info.size + 1;
        let y = parseInt(index / info.size) + 1;
        return {
            x, y
        }
    },
    changeXYToIndex(obj){
        return (obj.x - 1) + (obj.y - 1) * info.size;
    }
}


//过滤器，用于处理越界情况
let filter = {
    //超界排除
    beyondBorder(arr){
        //原理：x或y小于1的，或者x或y大于info.size（比如19格棋盘就是>19）的
        return arr.map(item => {
            if (item === undefined) {
                return undefined;
            }
            if (item.x < 1 || item.y < 1 || item.x > info.size || item.y > info.size) {
                return undefined;
            } else {
                return item;
            }
        })
    },
    //过滤掉数组中该位置棋子颜色不同的
    filterSameColor(arr){
        // 过滤原理：
        // 1、先得知当前这一步下棋的颜色（通过奇偶判断）；
        // 2、从当前可能连成一条线的数组索引中，依次取出一个元素；
        // 3、查看该元素是否在已下棋的数组中info.steps，不在则设置该位置为undefined；
        // 4、如果在，则查看该位置与当前这一步下棋步数的奇偶是否一致，不一致则设置该位置为undefined；
        // 5、如果在info.steps，并且奇偶一致，则保持不变；
        let isEven = (info.steps.length - 1) % 2;
        return arr.map(item => {
            if (item === undefined) {
                return undefined;
            }
            let index = rectTransformation.changeXYToIndex(item);
            let i = info.steps.indexOf(index);
            if (i === -1 || i % 2 !== isEven) {
                //不存在
                return undefined;
            } else {
                return item;
            }
        })
    }
}

//判断是否胜利
let isWin = function (arr) {
    // 参数是一个排除掉过界、以及颜色不同的对象之后的数组，只有当前位置元素合法才保留该位置元素，否则为undefined。
    // 遍历数组，当前元素不为空则放入临时数组，临时数组元素个数满5则说明符合条件；
    // 为空则清除临时数组；
    // 遍历结束后，未曾满5过，则说明这一排不成立。
    let tempArr = [];
    let overFive = false;
    arr.forEach(function (item) {
        if (item !== undefined) {
            tempArr.push(item);
        } else {
            tempArr = [];
        }
        if (tempArr.length === 5) {
            overFive = true;
        }
    })
    return overFive;
}

//启动棋盘
start(true);

$("#checkerboard").addEventListener("click", checkerboardClick);

$("#start-btn").addEventListener("click", function () {
    start(true)
});
$("#reset-btn").addEventListener("click", function () {
    start(false)
});
$("#backPiece-btn").addEventListener("click", backPiece);