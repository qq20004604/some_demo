#**ES5**的Object对象新增API

###Object.create(proto[, propertiesObject])

说明：

    1. 简单来说，这个用于创建一个新对象；
    2. 这个对象首先按引用继承了第一个参数的值，
    3. 然后将第二个参数所描述的值添加进去（如果相同则覆盖）

第一个参数：

    1. 第一个参数如果是个对象，那么这个对象的值改变时，新对象的同样属性的值也会随之改变；
    2. 第一个参数可以是null，返回是Object
    3. 可以是一个对象，返回还是Object
    4. 也可以是数组（例如var n = Object.create([1], {a: {value: 2}});
    5. 那么返回的是一个Array（通过instanceof得证）
    6. 这个数组可以通过n[0]来访问到数组的第一个元素1
    7. 也可以通过n.a访问到通过create方法添加进来的属性a的值2

第二个参数：

    1. 第二个参数并非常规对象的写法，而是以key和对象组合的形式作为一个k-v组合
    2. 他的组织形式是这样的：
       key: {
            value:"",
            enumerable: true,   //能否被枚举
            writable: true,     //能否被修改
            configurable: true  //属性的特性能否被修改/删除
       }
    3. value是必须有的，其他三个可以不加，默认取值是false
    4. enumerable表示能否被枚举，简单来说，就是for in遍历属性时，是否会遍历到这个属性。true则会，false不会
    5. writable表示值赋予之后，能否被修改。true为能，false为不能
    6. configurable决定属性的特性能否被修改，属性能否被删除（true能false不能），但不影响对value修改。
    7. 假如configurable为false，writable为true，那么value可以被修改，writable可以被修改
    8. 但假如在上一步的情况下，writable修改为false，那么就无法改回来了（因为configurable的原因）
    9. 修改这三个属性，需要用Object.defineProperty方法来进行，而不能直接通过例如obj.prop.writable这样

关于set和get：

    1. 虽然在上面没有写setter和getter，但Object.create创建的属性，的确也是可以用setter和getter的；
    2. 虽然没有一一验证，但是可以推断出，类似的方法，应该都可以使用setter和getter，以及上面四个属性的（虽然他们之间会有冲突）；
    3. setter和getter的介绍请参照Object.defineProperties部分；
    4. setter和getter在使用时，会和value以及writable有冲突，具体同样参照下面的说明；
    5. setter和getter，就是指set方法和get方法（To 那些诧异setter和getter与set和get之间关系的人）；

关于writable：

    1. 有些类似const；
    2. 假如值是字符串（或其他），那么无法被修改为其他字符串/数值/对象的；
    3. 假如值是对象/数组等按引用传递类型，虽然依然不能被修改其指向的对象/数组，但是可以直接修改其子属性的值/添加删除数组；
    4. 例如test.props的值是{} 空对象，那么test.props = "abc";是失败的。
    5. 但是test.props.a = 'abc'; 是被允许的。
    6. 数组类似，可以通过.push像数组新增，或者其他；
    7. 也就是说，对于按引用传递类型，不能修改其指向的对象，但是修改其指向对象的值。


###Object.defineProperties(obj, props)

说明：

    1. 对obj对象添加新属性、修改原属性；
    2. 本方法可以同时新增/修改多个属性；
    3. 该方法会返回一个对象，这个对象就是被修改对象（即返回值===obj）；
    
参数1：

    1. 第一个参数是被修改的对象，略；

参数2：

    1. 先解释写一个属性的方法，重点的set和get
    2. 第二个参数是一个对象，属性以key-val形式存在于对象中；
        示例：
        {
            属性名: {       //属性名，例如要设置test.a，那么这里的属性名就是a
                value: "props3",    //值，和get、set不能同时存在。这里四个属性可以参考
                writable: true,    //是否可修改
                configurable: true,    //属性是否可修改
                enumerable: true,    //是否可被for in
                set: function(val){},    //set方法，不能与value属性同时出现，具体以下细解
                get: function(){ return xxx; }    //get方法，同上
            }
        }
    3. value、writable、configurable、enumerable之前已经介绍过了，略；
    4. set和get总是成对出现的，当有set和get时，不能有value和writable属性存在，相反也是，不然会报错；
    5. set方法是一个函数，有一个参数val，这个val的值是你写例如test.a = 'abc'; 时的这个字符串abc；
    6. 你需要将这个abc赋给对象的某个属性，
    7. get方法也是一个函数，没有参数，但需要有返回值，返回值就相当于test.a的值；
    8. 还记不记得6中的那个被赋值的属性，这个时候，你将这个值作为return的返回值；
    9. 通过5~8这四步，你就相当于实现了value的效果。
    10. 潜在缺陷：被set和get方法作为中介的那个值，可能被枚举到或者可以直接从test中查看到（比如通过for in）；
    11. 解决方法：可以用一个不可被枚举的属性（值是对象）作为存储空间，然后把中间值放在这个存储空间中来存储这个中介值。（具体可以见DEMO）

同时修改多个属性：

    1. 在参数二中，并列设置即可；
        示例：
        {
            属性1:[ xxxx },
            属性2:{ xxxx },
            属性3:[ xxxx }
        }
        中间具体写法已省略，同前面
        
兼容性写法：

    好像没有很好能兼容的，见过的就算有，代码也很长，所以IE9以下的基本不要考虑了吧


###Object.defineProperty(obj, prop, descriptor)

说明：

    1. 类似Object.defineProperties，不过本方法一次只能新增/修改一个属性；
    2. 第二个参数写Object.defineProperties中的key，类型是字符串；
    3. 第三个参数是Object.defineProperties中的val，类型是对象；
    4. 第三个参数的写法可以参照上面Object.defineProperties的说明，没有什么不同；
    5. 还不懂的话就看DEMO吧。

关于继承：

    1. MDN网站说某些选项可能不是自身属性（继承来的），因此要考虑到这种情况；
    2. 为了保留这些东西，因此可能要在修改之前冻结Object.prototype（避免因修改而导致源属性也被修改）；
    3. 也可以将__proto__指向null；
    4. 我不是很懂他的意思，我觉得主要是我没明确他指的这件事发生的场景是什么
    5. 无论如何，给个链接吧
    https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
    

###Object.keys(obj)

说明：

    1. 效果很简单直白，类似for in，遍历对象，然后把key放在数组里，返回这个数组；
    2. 不能被枚举的属性（例如enumerable值为false的），不会被放入；
    3. 不能被枚举的属性，假如其子属性可以被枚举到，那么也不会被添加进去；
    4. 但是若直接以不能被枚举的属性作为Object.keys的参数，那么子属性假如可以被枚举，则会被添加进去；
    