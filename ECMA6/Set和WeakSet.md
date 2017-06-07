#Set和WeakSet

##0、一句话总结

<ol>
    <li>Set类型可以用于存储元素，并且变量内每个元素都是独一无二的（不会重复）；</li>
    <li>可以通过Set内置方法——添加、删除、查有无、清空元素；</li>
    <li>Set可以方便的转为数组后进行处理，在初始化为Set类型变量；</li>
    <li>WeakSet是弱化版的Set，并且只对引用类型有效（其他报错）；</li>
    <li>WeakSet只支持添加、删除、查有无，其他统统没有</li>
</ol>

##1、Set

###1.1、是什么？

简单来说，Set可以说是一种数据结构，但不是数据类型。

>new Set([iterable]);

有以下特点：

1. 像是一个数组；
2. **Set的每个元素都互相不相同**；
3. 不能像数组那样，利用下标取用（不存在下标）；
4. 可以通过调用Set内置的方法取出元素，或者添加元素，或者清空；
5. 添加Set内已有的元素时，会被忽视（不会报错）；
6. 可以用数组来初始化自己；
7. 可以查看该Set里是否有某个值；
8. 可以利用Array.from()来将其转为数组；

另外提一句，Babel默认情况下，是不能转换Set和Map等数据类型的，引自：

>Babel 默认只转换新的 JavaScript 句法（syntax），而不转换新的 API，比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如Object.assign）都不会转码。<br>举例来说，ES6在Array对象上新增了Array.from方法。Babel 就不会转码这个方法。如果想让这个方法运行，必须使用babel-polyfill，为当前环境提供一个垫片。

[阮一峰](http://es6.ruanyifeng.com/#docs/intro#babel-polyfill)

我自己实践测试来看：

1. 必须引用babel-polyfill才能正常运行Set和Map类型（不然会报错）；
2. 引入的方法就是安装这个插件，然后import或者require他就行；
3. 但单独js引入是不行的，需要利用webpack之类的打包（因为一般情况，浏览器是不支持直接跑js文件的require语法）；

###1.2、创建方式

创建他的方式有以下两种：

```
//good
let foo = new Set();    //空的Set
let bar = new Set([1, 2]);    //用数组初始化一个Set，内有2个元素，分别是数字1和2
```

**错误的创建方式：**
```
//bad
let x = new Set("1");   //初始只有一个元素的Set，该元素是"1"（字符串）
let y = new Set("1", "2");  //虽然给了两个参数，但只有第一个有效
```

其中前两种是标准的创建方式，而后两种完全不推荐；

首先，参数只允许使用以下几种：

1. undefined：当作为传参处理；
2. null：当作未传参处理；
3. 数组：数组的元素，会被依次添加到Set变量中，作为Set的元素（另外，因为不同浏览器对于数组的空位的处理机制可能有所差异，不建议将有空位的数组作为参数使用）；
4. 字符串：不推荐，实现和一般预期中不同；

另外参数不能是number，object，symbol，会报错。

但使用字符串的时候，又不会当做一个完整的字符串来看待，而是当作数组来看待。如代码：

```
new Set("a");    //Set(1) {"a"}
new Set("ab");    //Set(2) {"a", "b"}
new Set("aba");    //有重复，Set(2) {"a", "b"}
```

并且最后一种容易带来误解，很可能预期是想添加一个字符串"aba"，但实际是将字符串拆成数组添加进去"a"和"b"。

###1.3、Set的内置方法

####1.3.1、元素个数

>mySet.size

**效果：**

返回Set类型变量里面的元素个数，类型是number。

```
let foo = new Set();    //空的Set
let bar = new Set([1, 2]);    //用数组初始化一个Set，内有2个元素，分别是数字1和2
foo.size;   //0
bar.size;   //2
foo.add("1").size;  //1
```

####1.3.2、添加元素
>mySet.add(value)

**效果：**

将value添加到Set类型变量中。

具有以下特点：

1. 在初始化之后，只能通过这个方法将元素添加到Set类型变量中；
2. 如果重复，则无法添加（因为Set里每个元素都是不同的）；
3. 对非引用类型看值，对引用类型看引用的对象是不是同一个；
4. 返回值是Set变量本身，因此可以连写；
5. 参数是数组时，整个数组被认为是一个元素，而不是像初始化时，数组的每个元素都被认为是一个元素

```
let foo = new Set();    //空的Set
foo.size;   //0
foo.add("1").size;  //1
foo.add("1").size;  //1，添加的元素和之前重复，所以Set的变量的元素不变
foo.add("2").add("3").size; //3，连续添加
foo.add(["1", "2", "3"]).size;  //4，整个数组作为一个元素添加进去
console.log(foo);   //Set(4) {"1", "2", "3", (3) ["1", "2", "3"]}
```

####1.3.3、删除元素

>mySet.delete(value);

**效果：**

从mySet里删除元素value，返回值是是否删除成功。

```
let foo = new Set([1, 2, {}]);    //空的Set
foo.delete(1);  //true
foo.delete(1);  //false，不存在，所以删除失败
foo.delete({}); //false，即使里面有空对象，但由于对象是引用类型，所以还是删除失败的
console.log(foo);   //foo.delete({});
```


####1.3.4、检查元素是否存在

>mySet.has(value);

**效果：**

检查Set类型变量里面有没有value元素，有返回true，没有返回false。

简单暴力没啥好说的。


####1.3.5、移除所有元素

>mySet.clear();

移除该变量里所有元素，也就是说清空。

没有返回值。


###1.4、遍历

####1.4.1、返回遍历器对象

>mySet.keys()<br>
mySet.values()<br>
mySet.entries()

**效果：**

返回的都是一个遍历器对象（Iterator对象）。通过这个遍历器对象，可以依次访问Set类型变量的每个元素。

注意：遍历器对象不是数组，因此不能通过数组的下标那种方式来访问。

对于Set类型变量来说，key就是value，value就是key，所以前两个方法获取的结果可以认为是一样的（虽然显然返回的两个对象他们并不相等）。

这里直接拿阮一峰的作为例子好了

```
let set = new Set(['red', 'green', 'blue']);

for (let item of set.keys()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.values()) {
  console.log(item);
}
// red
// green
// blue

for (let item of set.entries()) {
  console.log(item);
}
// ["red", "red"]
// ["green", "green"]
// ["blue", "blue"]
```

讲道理说，一般用遍历器的还是比较少的（吧？）

>let...of

利用let...of直接遍历set类型对象，如代码：

```
let set = new Set(['red', 'green', 'blue']);
for (let item of set) {
    console.log(item);
}
//red
//green
//blue
```

但是，不能用for...in（不报错，但无效）

####1.4.2、返回数组

以我个人经验来看，如果要对Set进行处理，要么是针对单一元素，要么就是针对整个Set变量。

通过迭代器来访问是可以，不过有些太麻烦了，把其当做数组来处理更符合一般人的习惯吧。

将Set类型变量转为数组有以下方法：

>Array.from(mySet);

通过Array.from，将Set变量转为数组并返回。

数组里元素的顺序是添加时的顺序。

```
let set = new Set(['red', 'green', 'blue']);
let arr = Array.from(set);
arr;    //["red", "green", "blue"]
```

>mySet.forEach(callback[, thisArg])

类似数组的forEach方法。回调函数的前两个是一样的，都是Set的元素（因为key和value一致）。回调函数的第三个是Set变量本身。

如代码：

```
let set = new Set(['red', 'green', 'blue']);
set.forEach(function (item, key, setValue) {
    console.log(arguments);
})
//["red", "red", Set(3)]，只列出常用的，其他略
//["green", "green", Set(3)]
//["blue", "blue", Set(3)]
```


>[...mySet]

利用扩展运算符三个点进行解构赋值

```
let set = new Set(['red', 'green', 'blue']);
let arr = [...set];
console.log(arr);   //["red", "green", "blue"]
```

**当转为数组后：**

1. 当将Set转为数组后，就可以使用数组的各种API对其进行操作了；
2. 而数组可以作为初始化Set类型对象的参数；
3. 因此如果操作比较复杂的话，可以将其先转为数组，修改完毕后再通过new Set()重新转为Set类型对象；



##2、WeakSet

###2.1、是什么？

简单来说：WeakSet是一个功能弱化版的Set，在里面只能放置引用类型变量（比如数组或者对象）。

由于是弱化版的，所以Set类型不允许做的事情，WeakSet统统也不行。

除此之外，WeakSet还少了一些方法和属性。

再另外，存放在WeakSet的对象，不会影响内存回收，即里面的元素在引用数为0时，会直接被内存回收（即使放在WeakSet里面，也不会影响其回收）。

简单来说：

1. 只对对象、数组有用；
2. 只能添加、删除，并且查看某个元素是否存在；
3. 不可以遍历，不能转为数组进行处理；
4. 因为不可遍历，所以可以认为在WeakSet里面没有对其的引用，所以不会导致内存溢出不回收。

###2.2、WeakSet有的属性、方法

>ws.add(value);<br>
ws.delete(value);<br>
ws.has(value);

效果同Set的同名方法，返回值也相同，如代码：

```
let foo = {a: 1};
let bar = {b: 2};
let set = new WeakSet([foo]);
set.has(foo);   //true
set.has({});    //false
set.add(bar);   //{Object {a: 1}, Object {b: 2}}
set.delete(foo);    //true
```

###2.3、WeakSet **没有**的方法和属性

以下方法和属性 **不存在**：

>ws.size;

size属性返回值为undefined，说明没有这个属性。

>Array.from(ws);

Array.from方法对其无效，返回空数组

```
let foo = {a: 1};
let set = new WeakSet([foo]);
Array.from(set);    //[]
```

>let...of

会直接报错

```
let foo = {a: 1};
let set = new WeakSet([foo]);

for (let item of set) {    //Uncaught TypeError: undefined is not a function
    console.log(item);
}
```

>ws.keys()<br>
ws.values()<br>
ws.entries()

```
let foo = {a: 1};
let set = new WeakSet([foo]);
set.keys();     //Uncaught TypeError: set.keys is not a function
set.values();   //Uncaught TypeError: set.values is not a function
set.entries();  //Uncaught TypeError: set.entries is not a function
```

>[...ws];

扩展运算符三个点也不能用

```
let foo = {a: 1};
let set = new WeakSet([foo]);
[...set];   //Uncaught TypeError: undefined is not a function
```

