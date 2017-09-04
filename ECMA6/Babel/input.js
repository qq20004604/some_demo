import "babel-polyfill"
function Foo() {
    console.log('Foo constructor')
}
Foo.staticFoo = function () {
    console.log("static foo")
}
Foo.prototype.foo = function () {
    console.log('foo')
}

class Bar {
    constructor() {
        Foo.prototype.constructor.call(this)
        console.log('Bar constructor')
    }

    bar() {
        console.log('bar')
    }
}
Bar.__proto__ = Foo
Bar.prototype.__proto__ = Foo.prototype

let p = new Bar()
// Foo constructor
// Bar constructor
p.foo() // foo
p.bar() // bar
Bar.staticFoo() // static foo
p.staticFoo()   // Uncaught TypeError: p.staticFoo is not a function
