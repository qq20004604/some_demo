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