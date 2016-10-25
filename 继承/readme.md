#**继承**

###前注

参考阮一峰的博客所写：

博客链接：

http://www.ruanyifeng.com/blog/2010/05/object-oriented_javascript_inheritance.html


###一、构造函数绑定继承

关键点：

1. 是相当于在新函数里执行了一遍被继承的构造函数；
2. 使用apply方法，第一个参数是this，第二个参数是参数数组；
3. 可以变相理解为，将被继承的构造函数里的代码，整个移动到了新函数之中，用于替换xx.apply(this, arguments)这一行代码

        function Animal() {
            var test = 'test';
            this.species = '动物';    //species是种类的意思
            this.name = "abc";
            this.log = function () {
                console.log(test);
            }
        }

        // *** 继承方法一：构造函数继承***
        function Dog(name, color) {
            // this是指向Dog的this，而arguments是参数数组，比如就这里而言，是[name, color]
            // 这里是将Animal这个方法提供给Dog调用。具体来说，相当于执行了一遍Animal这个方法，并且该方法里的this指向的是Dog这个实例的this
            Animal.apply(this, arguments);
            this.name = name;
            this.color = color;
        }

        // *** 继承完毕，开始调用 ***
        // 注意，这里用全局变量是为了方便在console里调试，正常情况下不要这么写
        dog = new Dog("哈士奇", "黑白色");
        console.log(dog);

 显示结果为：
 
        Dog {species: "动物", name: "哈士奇", color: "黑白色"}
        另有log方法，species:"动物" 属性
                

解释：

1. Dog这个函数可以理解为这样：

        function Dog(name, color) {
            var test = 'test';
            this.species = '动物';
            this.name = "abc";    //这个和后面的name重名，因此这个比较靠前的被覆盖了
            this.log = function () {
                console.log(test);
            }
            this.name = name;
            this.color = color;
        }
        
2. 可以调用Aniaml的log方法，显示Animal中的test变量的值；

 Animal这个构造函数中的name变量被覆盖（因为其先声明的）；

3. Animal也可以使用参数，但需要修改Animal这个构造函数。更改为：

        function Birds(name) {
            this.nameInBirds = name;
        }

        function Pigeon(name, color) {
            Birds.apply(this, arguments);
            this.nameInPigeon = name;
            this.color = color;
        }

        var aBird = new Pigeon("鸽子", "白色");
        console.log(aBird);
    
 显示结果为：
 
         Pigeon {nameInBirds: "鸽子", nameInPigeon: "鸽子", color: "白色"}
         

###二、prototype继承

首先，你得知道prototype是什么，完全不知道的去google或者百度。

简单来说，就是让继承的方法（例如Cat）的prototype属性指向被继承对象的实例（例如一个new Animal()）；

然后，Animal这个实例的属性，都被挂载在了Cat的prototype属性下（原有prototype属性，则被全部移除）。

于是，Cat实例，通过Cat构造函数创建的属性，可以被直接查看。而通过Animal构造函数创建的属性，则在实例的__proto__属性下可以被找到。（注意，虽然在__proto__属性下，但是依然可以被直接访问——如果和Cat中的方法没有冲突的话）；

具体代码见 prototype继承.html

另外：
hasOwnProperty 只能直接访问直接的属性，不能访问原型链上的，但注意，可以访问通过apply继承的属性
in 可以访问原型链上的。