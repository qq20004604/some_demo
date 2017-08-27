import "babel-polyfill"

function delay(time, dealCallback) {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            try {
                dealCallback()
                throw new Error("abc")
                resolve()
            } catch (err) {
                reject(err)
            }
        }, time ? time : 1000)
    })
}

const byPromise = function (fn) {
    return function (...args) {
        return fn.call(this, ...args)
    }
}

function *g() {
    yield byPromise(delay)(null, function () {
        console.log('first')
    })
    yield byPromise(delay)(500, function () {
        console.log('second')
    })
}

function co(gen) {
    return new Promise((resolve, reject) => {
        // 略去判断gen不是generator函数的代码

        let g = gen()

        function onSuccess(res) {
            let result = g.next(res)
            // 增加错误捕获
            try {
                next(result)
            } catch (err) {
                reject(err)
            }
        }

        function onError(err) {
            let ret;
            try {
                ret = g.throw(err)
            } catch (e) {
                return reject(e)
            }
            next(ret)
        }

        function next(result) {
            if (result.done) {
                return resolve(result.value)
            }
            // 略去对每一步的value属性是不是Promise对象的检查
            result.value.then(onSuccess, onError)
        }

        onSuccess()
    })
}

co(g).then(data => {
    console.log(data)
}, err => {
    console.log(err)
})