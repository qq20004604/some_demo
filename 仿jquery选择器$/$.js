(function (f) {
    f();
})(function () {
    //选择器
    if (window.$ !== "undefined") {
        var $OBJECT = window.$;
    }
    window.$ = function (selector) {
        if (selector.charAt(0) === '#') {
            return document.querySelector(selector)
        } else {
            return document.querySelectorAll(selector);
        }
    }
    if ($OBJECT) {
        if (Object.assign) {
            Object.assign(window.$, $OBJECT)
        } else if (Object.setPrototypeOf) {
            Object.setPrototypeOf(window.$, $OBJECT);
        } else if (window.$.__proto__) {
            window.$.__proto__ = $OBJECT;
        } else {
            console.error("你的浏览器不支持$选择器（这种可能性太低了……）");
        }
    }
});