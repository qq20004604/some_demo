#Map和WeakMap

##0、一句话总结

<ol>
    <li>Map的参照1.1</li>
    <li>WeakMap的是弱化版Map，只有增、查、取、删四个API</li>
</ol>

##1、Map

###1.1、是什么？

1. 一种数据类型；
2. 类似对象的键值对组合；
3. 任何数据类型都可以作为key来使用（包括undefined、null甚至函数）；
4. 键值对是一一对应的，而key是唯一的；
5. 可以新增、删除、通过key查看值，是否有某key、清空所有元素；
6. 也可以遍历他（像Set那样）
7. 可以和数组互相转换（比如通过扩展运算符三个点）；
8. 也可以通过简单的函数，转为对象或者从对象转为Map类型；


###1.2、创建Map类型

>new Map([iterable])

关于参数：

1. 可以不加参数创建空的Map变量；
2. 也可以添加一个符合要求的数组、或者迭代器对象；
3. 无论是哪个，都要求其每个元素都是键值对，或者是至少有两个元素的数组；
4. 如果元素是数组，那么数组的第一个元素作为key，第二个元素作为value；
5. 键值对就不用说了；
6. Map本身也可以作为新的Map的初始化参数；

如代码：

```
let foo = new Map();
foo;    //Map(0) {}

let bar = new Map([["key1", "value1"], ["key2", "value2"]]);
bar;    //Map(2) {"key1" => "value1", "key2" => "value2"}

let x = new Map(bar);
x;  //Map(2) {"key1" => "value1", "key2" => "value2"}
```

###1.3、Map类型的元素数、增、删、查、清

看过Set的，会发现跟Set的很像。

####1.3.1、元素数

>myMap.size

返回值是number类型，表示该Map变量里有几个键值对。

```
let foo = new Map();
foo.size;   //0

let bar = new Map([["key1", "value1"], ["key2", "value2"]]);
bar.size;   //2
```

####1.3.2、新增

>myMap.set(key, value);

新增一个键值对。返回值是myMap本身（因此可以连续调用）。

如果key不存在则新增键值对，如果key存在则覆盖原键值对。

```
let foo = new Map();
foo.set("theKey", "theValue").set("foo", "FOO");
foo;    //Map(2) {"theKey" => "theValue", "foo" => "FOO"}
```

####1.3.3、删除

>myMap.delete(key);

以key作为关键词删除某个键值对。如果删除成功返回值则为true，删除失败（比如不存在该键值对）返回值为false。

```
let foo = new Map();
foo.set("theKey", "theValue").set("foo", "FOO");
foo.delete("theKey");   //true
foo.delete("theKey");   //false，第二次已经没有该键值对了
```

>myMap.clear();

清空所有键值对。没有返回值。

```
let foo = new Map([["key1", "value1"], ["key2", "value2"]]);
foo.size;   //2
foo.clear();
foo.size;   //0
```


####1.3.4、查找

>myMap.has(key);

查找某个key是否存在于该Map变量中，返回值是true（有）或者false（没有）。

```
let foo = new Map([["key1", "value1"], ["key2", "value2"]]);
foo.has("key1");    //true
foo.has("value1");     //false
```

另外需要注意，引用类型作为key时，需要引用的是同一个对象或对象，才能正确查找到。

>myMap.get(key);

通过key来查找Map变量的键值对的值，返回值当然是这个值啦，没找到就是undefined。

```
let foo = new Map([["key1", "value1"], ["key2"]]);
foo.get("key1");    //"value1"
foo.get("value1");     //undefined，不存在该键值对
foo.get("key2");    //undefined，存在key但是没有设置值，因此值默认为undefined
```


###1.4、遍历

遍历方式跟Set类型基本一样，教练，我可以复制粘贴么？不行？好吧……

####1.4.1、for...of

遍历之，遍历出来的每个键值对都是一个数组，分别是key和val，见代码：

```
let foo = new Map([["key1", "value1"], ["key2", "value2"]]);
for (let item of foo) {
    console.log(item);
}
//["key1", "value1"]
//["key2", "value2"]
```

注意：for...in无效

####1.4.2、获取迭代器

>myMap.keys()<br>
myMap.values()<br>
myMap.entries()

分别是返回一个key的迭代器，value的迭代器和键值对组的迭代器

```
let foo = new Map([["key1", "value1"], ["key2", "value2"]]);
foo.keys(); //MapIterator {"key1", "key2"}
for (let item of foo.keys()) {
    console.log(item);
}
//key1
//key2

for (let item of foo.values()) {
    console.log(item);
}
//value1
//value2

for (let item of foo.entries()) {
    console.log(item);
}
//["key1", "value1"]
//["key2", "value2"]
```

####1.4.3、forEach

>myMap.forEach(callback[, thisArg])

和数组的forEach没啥区别。

回调函数的第一个值是value，第二个值是key，第三个值是myMap本身。

```
let foo = new Map([["key1", "value1"], ["key2", "value2"]]);
foo.forEach(function (value, key, map) {
    console.log(arguments)
})
//["value1", "key1", Map(2)]
//["value2", "key2", Map(2)]
```

###1.5、类型转换

1. Map类型可以用原生API直接转为数组，或者从符合要求的数组生成Map类型变量;
2. 可以在符合某种条件下通过简单的代码转为对象，可以随时通过简单代码从对象转为Map类型；
3. JSON字符串和Map可以在有限条件下互转（JSON转Map要求低，Map转JSON要求高）;

<table>
    <tr>
        <td>来源</td>
        <td>转换成</td>
        <td>前提和条件</td>
        <td>其他</td>
    </tr>
    <tr>
        <td>Map</td>
        <td>Array</td>
        <td>无要求</td>
        <td>有API支持直接转换</td>
    </tr>
    <tr>
        <td>Array</td>
        <td>Map</td>
        <td>要求较低，需要数组每个元素都是键值对或者也是数组</td>
        <td>可以通过初始化Map时作为参数</td>
    </tr>
    <tr>
        <td>Map</td>
        <td>对象</td>
        <td>要求中等，key需要是字符串</td>
        <td>需要写一些代码来转换</td>
    </tr>
    <tr>
        <td>对象</td>
        <td>Map</td>
        <td>简单</td>
        <td>需要写一些代码来转换</td>
    </tr>
    <tr>
        <td>Map</td>
        <td>JSON字符串</td>
        <td>难度中等。可以先转对象再转JSON，或者先转数组再转JSON。<br>但假如key或者value类型比较特殊，比如是DOM元素这种作为key或者value，可能会有潜在问题</td>
        <td>需要写一些代码来转换</td>
    </tr>
    <tr>
        <td>JSON字符串</td>
        <td>Map</td>
        <td>可以转为对象或数组后，再转为Map</td>
        <td>需要写一些代码来转换</td>
    </tr>
</table>

####1.5.1、Map转数组

>Array.from(myMap);<br>
[...myMap]

以上两个方法都可以将其转为数组。

```
let foo = new Map([["key1", "value1"], ["key2", "value2"]]);
Array.from(foo);    //[["key1", "value1"], ["key2", "value2"]]
[...foo];   //[["key1", "value1"], ["key2", "value2"]]
```

另外友情提示，虽然两个方法返回值都是数组，但是他们之间是不等的，甚至两个``Array.from(foo)``返回的值都是不等的（原因是按引用传递类型），应该不会有人会犯这个错误吧？


####1.5.2、数组转Map

符合要求的，直接作为 ``new Map()`` 的参数使用。

如果添加到已有的Map里，则遍历数组，然后通过 ``myMap.set()`` 来添加.


####1.5.3、Map转对象

原则上是遍历Map，比如forEach，entries()，for...of等来遍历，然后组装带空对象之中。

但要求Map的key是字符串，如果不是字符串，那么那一个键值对就会失效，毕竟对象的key只能是字符串。

需要在转换时判断一下key的类型，以免报错，或者触发了隐式转换函数toString()方法，导致与预期的结果不同。

```
let foo = new Map([["key1", "value1"], ["key2", "value2"]]);
var bar = {};
bar[foo] = 1;
bar;    //{[object Map]: 1}
```

以上代码中，``[object Map]``就是一个字符串

####1.5.4、对象转Map

这个很简单啦，比如可以Object.keys()遍历对象的key，然后通过set方法添加进去就行。

但是如果对象存在enumberable的值为false的属性，就比较麻烦，需要使用其他API菜可以。

可以参考[es6对象的扩展](http://blog.csdn.net/qq20004604/article/details/72860849#t2)，查看表格提供的遍历方法就行。

```
//转换函数
function ObjectToMap(obj, map) {
    Reflect.ownKeys(obj).forEach(function (item) {
        map.set(item, obj[item]);
    })
}

let foo = new Map();
var bar = {
    x: 1
};
Object.defineProperty(bar, "y", {
    value: 2,
    enumberable: false
})
ObjectToMap(bar, foo);
foo;    //Map(2) {"x" => 1, "y" => 2}
```

####1.5.5、JSON转Map和Map转JSON

JSON和Map的关系，与对象和Map的关系很像。

但JSON比对象更麻烦一些。

主要原因在于：

1. 对象只对key有限制，必须是字符串。
2. JSON如果是通过对象来转的话，对value也有限制，比如说只是基本类型，不能是函数、Set或Map，Symbol或者DOM元素等；
3. JSON如果是通过数组来转的话，数组的元素也需要是普通的那种，不能是特殊的类型（参照第二条）；

只有当Map的键值对符合要求后，才能先将Map转为对象或数组，然后再转为JSON（通过 ``JSON.stringify()``）。


而JSON转成Map时：

1. 如果是数组形式的，对比数组转Map的要求；
2. 如果是对象形式的，对比对象转Map的要求；

##2、WeakMap

###2.1、是什么？

1. 弱化版Map；
2. key只能是对象（不包括null），不然会报错；
3. key不计入引用次数，不影响内存回收；
4. 凡是Map有的要求，他都有；
5. Map没有的方法，他都没有；
6. Map有的方法，他只有极少数；
7. 不能显示元素数目，也不能遍历；
8. 只能新增、删除、查看有没有、查看某个key的值是什么；
9. 适用于key为DOM元素的时候。

###2.2、有的方法（没写的就是没有）

>wm.set(key, value);<br>
wm.has(key);<br>
wm.get(key);<br>
wm.delete(key);

```
var arrList = [{}]
let foo = new WeakMap();
foo.set(arrList[0], "1");   //foo.set(arrList[0], "1");
foo.has(arrList[0]);    //true
foo.has(arrList[1]);    //false
foo.get(arrList[0]);    //"1"
foo.delete(arrList[0]); //true
foo.delete(arrList[0]); //false
```