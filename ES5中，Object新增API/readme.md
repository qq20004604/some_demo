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
    3. 不能被枚举的属性，假如其子属性可以被枚举到，那么也不会被添加进去（原因参照5）；
    4. 但是若直接以不能被枚举的属性作为Object.keys的参数，那么子属性假如可以被枚举，则会被添加进去；
    5. 只能枚举直接子属性，不能获取间接子属性，例如以下对象：
        var obj = {
            test: {
                test1: 'value'
            }
        }
        使用Object.keys(obj);返回的数组是['test']，而不是['test', 'test1']；
        如果使用Object.keys(obj.test); 返回值的数组则为['test1']
        

###Object.freeze(obj)

说明：

    1. 效果是，让一个对象被冻结。禁止新增、删除、修改属性（包括例如enumerable等数据描述符和存储描述符）；
    2. 返回值是被冻结的对象（返回值 === obj的结果是true）；
    3. 总而言之，如果想让一个对象不能做任何修改，用这个就可以了；
    4. 冻结后无法恢复；
    5. 对象不能被修改，但是可以修改指向的对象。例如var test = {a:1};
       然后test被冻结了，此时冻结的是对象（还记不记得对象是按引用传递）；
       然后此时你让test={b:2};那么虽然{a:1}这个对象依然不能被修改，但是此时test已经指向的是{b:2}了
       所以此时的test可以被修改。
    6. 可以冻结的是对象和数组（按引用传递）；
    7. 无法冻结的是string，number类型等（非按引用传递），准确的说，是冻结成功但依然可以被修改。
    8. 当需要对被冻结的对象进行修改，又因为冻结无法修改的解决办法：
       创建一个新对象，然后通过克隆一个具有相同属性的对象，并用这个新对象来替代已被冻结的对象。

具体见DEMO

###Object.isFrozen(obj)

说明：

    1. 查看一个对象是否被冻结；
    2. 被Object.freeze()冻结的对象返回是true；
    3. 空对象被Object.preventExtensions()后的返回值，用本方法查看的话返回值是true。但非空对象用同样流程，本方法返回值是false
    4. 非空对象在删除所有属性后，使用Object.preventExtensions()设置，然后再用本方法检查，返回值是true，否则false
    5. 更多的参照：https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/isFrozen

###Object.seal(obj)

说明：

    1. 阻止属性的添加和删除；
    2. 已有属性可以被修改；
    3. 被锁定的对象可以被Object.isSealed检查并返回true;
    4. 锁定后不可逆；
    5. 想要修改的解决办法：克隆一个新的，然后用新的。
    6. 可以锁定数组，数组被锁定后，无法添加新的、删除旧的，但是可以修改已有的；
    7. 对锁定数组的push等操作，会抛出异常TypeError；
    8. 会将属性的configurable属性（通过defineProperties设置的），设置为false（禁止修改属性）；


###Object.isSealed(obj)

说明：

    1. 检查是否被锁定，是则返回true；
    2. ES5下对非object对象操作会抛出异常，ES6下不会；
    3. 被freeze冻结的对象，本方法也会返回true；
    4. 被禁止新增扩展的对象，返回false；

###Object.preventExtensions(obj)

说明：

    1. 阻止属性的添加；（这个，freeze和seal都会阻止属性的添加和删除）
    2. 不会阻止属性的删除；（seal和freeze会阻止属性的删除）
    2. 已有属性可以被修改；（这个和seal都可以做到）
    4. 锁定后不可逆；
    5. 想要修改的解决办法：克隆一个新的，然后用新的。
    


###Object.isExtensible(obj)

说明：

    1. 检查属性是否可扩展，可扩展则返回true；（注意！以上是被锁定/冻结返回true，这个是 没有 被禁止扩展返回true）
    2. 被冻结、锁定、和禁止属性添加，都会返回false；
    3. 用于检查是否可以给对象添加属性；
    4. 通过Object.defineProperty设置属性，
       假如属性原本是对象/数组，那么无论三个属性怎么设置，由于不影响该属性添加/删除/修改，因此返回值是true；
       如果属性原本不是对象和数组，因此显然不能添加新属性，因此返回值为false；


##**控制对象状态**

转自http://huangtengfei.com/2015/03/the-standard-library-of-javascript/

1. JavaScript提供了三种方法，精确控制一个对象的读写状态，防止对象被改变。最弱一层的保护是preventExtensions，其次是seal，最强的freeze。

2. Object.preventExtensions方法可以使得一个对象无法再添加新的属性，但可以用delete命令删除它的现有属性。Object.isExtensible方法可以用来检查是否可以为一个对象添加属性。

3. Object.seal方法使得一个对象既无法添加新属性，也无法删除旧属性。Object.seal还把现有属性的attributes对象的configurable属性设为false，使得attributes对象不再能改变。Object.isSealed方法用于检查一个对象是否使用了Object.seal方法。

4. Object.freeze方法可以使得一个对象无法添加新属性、无法删除旧属性、也无法改变属性的值，使得这个对象实际上变成了常量。Object.isFrozen方法用于检查一个对象是否使用了Object.freeze()方法。

5. 使用上面这些方法锁定对象的可写性，但是依然可以通过改变该对象的原型对象，来为它增加属性。