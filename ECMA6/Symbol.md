#Symbol

##0、一句话总结

<ol>
    <li>一个新的数据类型；</li>
    <li>当key时，只有指定遍历方法，才能获取该属性名；</li>
    <li>Symbol.for(key)方法，同样的key可以生成同样的Symbol类型变量；</li>
    <li>一些内置属性，可以设置某些类型的属性，用于配置某些功能</li>
</ol>

##1、Symbol是什么？

一种新的数据类型。

于是js有七种数据类型：

1. undefined;
2. null
3. String;
4. Number;
5. Array;
6. Object;
7. Symbol;

<br>
生成方法：

>Symbol([description])

返回值就是Symbol类型变量。参数主要用于识别是哪个，作为描释符生效，传不传没影响。

```
var foo = Symbol();
foo;    //Symbol()
```


**特点：**

1、唯一的，任何两个Symbol类型的变量，都不相同（即使生成他们时传的参数相同）；
```
var foo = Symbol(1);
var bar = Symbol(1);
foo == bar;     //false
```
2、可以像字符串一样作为变量名；

```
var foo = Symbol();
var bar = {
    [foo]: 1
}
bar;    //{Symbol(): 1}
```

3、typeof运算符返回结果是Symbol

```
var foo = Symbol();
typeof foo; //"symbol"
```

4、可以显式转为字符串：

```
var foo = Symbol();
foo.toString(); //"Symbol()"
var bar = Symbol("test");
bar.toString(); //"Symbol(test)"
```

5、不会隐式转换为字符串：
```
var foo = Symbol();
foo + "a";    //VM555:1 Uncaught TypeError: Cannot convert a Symbol value to a string
```

6、Symbol可以被隐式转为布尔值，值为true；

```
var foo = Symbol();
Boolean(foo);    //true
```

7、不能使用new这种方式来创建；
```
new Symbol();//Uncaught TypeError: Symbol is not a constructor
```


##2、Symbol作为属性名时

简单来说，在使用字符串变量作为属性名时是怎么做的，用Symbol变量作为属性名就怎么用。、

唯一缺点是Symbol不能像字符串变量那样拼接

```
let foo = Symbol();
foo.toString(); //"Symbol()"
let bar = Symbol("test");
bar.toString(); //"Symbol(test)"
let test = {
    [foo + bar]: 1
};  //Uncaught TypeError: Cannot convert a Symbol value to a number
```

总而言之，当遇见问题的时候，想想字符串变量在这样的情况下能不能用？如果能用，再具体分析，如果不能用，想想字符串变量是怎么用的，就怎么用。

常见用法如下：

```
let foo = Symbol();
let test = {
    [foo]: 1
}
test[foo] = 2;
```


##3、遍历

直接的说，常见遍历方式对Symbol作为属性名的属性不生效，只有2个通常不太使用的才会生效。

如果需要的遍历时，拉取到的是该Symbol变量

具体见表格：

<table>
    <tr>
        <td>方法</td>
        <td>对Symbols属性是否有效</td>
    </tr>
    <tr>
        <td>for...in</td>
        <td><span style="color:red">无效</span></td>
    </tr>
    <tr>
        <td>Object.keys()</td>
        <td><span style="color:red">无效</span></td>
    </tr>
    <tr>
        <td>JSON.stringify()</td>
        <td><span style="color:red">无效</span></td>
    </tr>
    <tr>
        <td>Object.getOwnPropertyNames()</td>
        <td><span style="color:red">无效</span></td>
    </tr>
    <tr>
        <td>Reflect.ownKeys()</td>
        <td><span style="color:green">有效</span></td>
    </tr>
    <tr>
        <td>Object.getOwnPropertySymbols()</td>
        <td><span style="color:green">有效</span></td>
    </tr>
</table>

测试代码：

```
let bar = Symbol();
let foo = {
    [bar]: 1
}
/*遍历方式*/
//for...in
console.log("for...in");
let arrFoo = [];
for (let i in foo) {
    arrFoo.push(i);
}
console.log(arrFoo);    //[]

console.log("-----");

//Object.keys();
console.log("Object.keys()");
console.log(Object.keys(foo));  //[]

console.log("-----");

//JSON.stringify()
console.log("JSON.stringify()");
console.log(JSON.stringify(foo));   //[]

console.log("-----")

//Object.getOwnPropertyNames()返回一个数组，包含对象自身的所有属性（不含Symbol属性，但是包括不可枚举属性）。
console.log("Object.getOwnPropertyNames()");
console.log(Object.getOwnPropertyNames(foo));   //[]

console.log("-----");

//Reflect.ownKeys()返回一个数组，包含对象自身的所有属性，不管属性名是Symbol或字符串，也不管是否可枚举。
console.log("Reflect.ownKeys()");
console.log(Reflect.ownKeys(foo));  //[Symbol()]

console.log("-----");

//Object.getOwnPropertySymbols()返回一个数组，包含对象自身的所有Symbol属性
console.log("Object.getOwnPropertySymbols()");
console.log(Object.getOwnPropertySymbols(foo)); //[Symbol()]
```

```
//判断返回值和Symbol变量是否相等
console.log(Object.getOwnPropertySymbols(foo)[0] === bar); //true
```

##4、获取某个指定参数的Symbol类型变量

首先，依然明确，通过Symbol获取的变量是唯一的（即使传的参数一样）；

那么，假如我遇见这样的场景：

1. 有一个对象；
2. 他可能有一个Symbol类型属性名的属性；
3. 假如有，我需要修改他；
4. 假如没有，我需要创建这个属性并对其设置值；

<br>
对于普通类型的属性名，我可以判断这个属性名是否存在，然后再进行处理。

但是Symbol类型的特点是任意两个Symbol类型的属性名不相等，因此即使你能获取到这个对象有哪些Symbol类型的属性名（Object.getOwnPropertySymbols()），但也无法据此来判断是否有你需要的那个属性。

解决办法是使用``Symbol.for(key)``：

###4.1、创建带标识符的Symbol类型变量

>Symbol.for(key);

效果是：**注册一个用key作为标识符的Symbol类型变量。**

```
Symbol.for();    //Symbol(undefined)
```

只要创建的时候带key，那么这2个key相同的，通过本方法创建的Symbol类型变量则必然相同。

```
let foo = Symbol.for('1');
let bar = Symbol.for('1');
console.log(foo === bar);   //true
```

另外，不传key和key传的是undefined的效果是相同的。

```
let foo = Symbol.for(undefined);
let bar = Symbol.for();
console.log(foo === bar);   //true
```

通过这种方法创建的Symbol类型变量，和通过``Symbol()``方法创建的Symbol类型变量，即使参数相同，他们也不相等。

```
let foo = Symbol.for('1');
let bar = Symbol('1');
foo == bar;   //false
```

###4.2、通过带标识符的Symbol类型变量获取key

> Symbol.keyFor(sym);

效果：

**获取Symbol类型变量的标识符。**

可以对``Symbol()``方式创建或者通过``Symbol.for()``方式创建的都有效

```
let foo = Symbol();
let bar = Symbol('1');
let x = Symbol.for();
let y = Symbol.for("1");
Symbol.keyFor(foo); //undefined，这个是undefined类型`
Symbol.keyFor(bar); //undefined，这个是undefined类型
Symbol.keyFor(x);   //"undefined"，这个是字符串
Symbol.keyFor(y);   //"1"，这个也是字符串
```

##5、Symbol的内置属性

比如``Symbol.isConcatSpreadable``， ``Symbol.match``等，应该算是语法糖。

对Class、或者对象、数组等使用。

类似内置开关。例如对数组设置``Symbol.isConcatSpreadable``属性为false时，数组在作为concat的参数时，不会展开

引阮一峰的例子：

```
let arr1 = ['c', 'd'];
['a', 'b'].concat(arr1, 'e') // ['a', 'b', 'c', 'd', 'e']
arr1[Symbol.isConcatSpreadable] // undefined

let arr2 = ['c', 'd'];
arr2[Symbol.isConcatSpreadable] = false;
['a', 'b'].concat(arr2, 'e') // ['a', 'b', ['c','d'], 'e']
```

