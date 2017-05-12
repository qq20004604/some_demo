##数字（number）的扩展

###0、一句话总结

```
1、二进制数字开头0b，八进制数字开头0o
2、更靠谱的类型判断有效数字，NaN，以及整数（es6新增）；
3、增加了一个极小的常量，用于判断浮点数计算，结果的误差小于这个常量则基本可以认为相等；
4、增加了安全范围的最大整数和最小整数常量，以及对他们的判断；
5、新增方法全部不会进行隐式转换；
6、探讨了一下最大数值和最小数值为何出现；
```

###1、二进制与八进制

####1.1、二进制

原本js是不能以数字的形式表达二进制的，只能通过parseInt(数字, 2)将数字解释为二进制，并返回值，例如：

```
parseInt(10,2);    //2
```

或者将数字转为二进制的字符串，如代码：

```
var a = 2;
a.toString(2);    //"10"这里是将数字转为二进制字符串
```

在ES6中，添加了二进制数字的表达法，以**0b**或者**0B**作为开头后面跟数字即可，如代码：

```
//注意，以下不是字符串，而是直接输数字
0b10;    //2
0B100;    //4
```

####1.2、八进制

之前八进制数字以0开头，例如010表示8，但仅在非严格模式下生效。

如果注意过的话，会发现在es5里，严格模式下不能使用八进制数字，会抛出一个SyntaxError。

在es6里，支持严格模式下的八进制数字的表示了，方法就是以0o开头（第二个是字母o，大小写都可以）；

如代码：

```
0o10;    //8
0O100;    //64
```

####1.3、转为十进制使用

1、可以直接和其他数字类型进行计算，会被隐式转换为十进制并输出结果，例如：

```
0o100 - 0o10;    //56
0o100 - 1;    //63
0o10 - 0b10;    //6
```

2、可以通过Number()或者parseInt()方法输出结果；

```
Number(0o10);    //8
parseInt(0b10);    //2
```

###2、数字类型判断

####2.1、判断数字是否是有限的

准确的说，只有当一个数字是合法数字（非NaN，非Infinity正无穷，必须是number类型）才会返回true。

>Number.isFinite(变量)

假如是一个合法数字，则会返回true，否则返回false

```
Number.isFinite(0);    //0，true
Number.isFinite(-1.1);    //数字，true
Number.isFinite("a");    //字符串，false
Number.isFinite({});    //对象，false
Number.isFinite(NaN);    //NaN虽然type是number，但没用，false
Number.isFinite(Infinity);    //正无穷类似NaN，false
Number.isFinite("1");    //不会被隐式转换，false
Number.isFinite([1]);    //也不会被隐式转换，false

var test = {};
test.toString = function () {
    return 1;
}
Number.isFinite(test);    //不会被隐式转换，false
```

作为对比：
```
//前面几个结果一样
isFinite("1");    //会被隐式转换，true
isFinite([1]);    //也会被隐式转换，true

var test = {};
test.toString = function () {
    return 1;
}
isFinite(test);    //会被隐式转换，true
```

####2.2、判断是否是NaN

和上面类似，只对NaN生效。

>Number.isNaN(变量)

例如：

```
Number.isNaN(NaN);    //true
Number.isNaN(1/NaN);    //参数如果是表达式，则计算表达式结果再判断，true
Number.isNaN(Infinity);    //显然不是NaN，false
Number.isNaN(1);    //数字不是NaN，false
Number.isNaN("NaN");    //不会被隐式转换，false

var test = {};
test.toString = function () {
    return NaN;
}
Number.isNaN(test);    //不会被隐式转换，false
```

于之前的isNaN()相比，避免了通过Number()先进行隐式所带来的结果转换，更准确。

对比isNaN()（只列不同）

```
isNaN("NaN");    //会被隐式转换，true
isNaN("NaNabcdef");    //会被隐式转换，true

var test = {};
test.toString = function () {
    return NaN;
}
isNaN(test);    //会被隐式转换，true
```

>**总结：**<br>
简单来说，没有Number开头的方法，会先将参数通过Number()隐式转换为数字后，再去判断。（对象会先调用Object.toString()方法转换为字符串）<br>
而通过Number对象来调用的这两个方法，不会进行隐式转换，因此更准确。


####2.3、判断是否为整数

>Number.isInteger(变量)

注意，这个API为es6新增，并不存在isInteger(变量)这个方法。

效果是用于判断是否是整数，并且这个判断过程中不接受隐式转换。

另外，浮点数如果小数部分为0，例如1.000，也会被视为整数

```
Number.isInteger(1)；    //true
Number.isInteger(1.00);    //视为1，true
Number.isInteger(-1.0);    //整数，true
Number.isInteger(1.01);    //非整数，false
Number.isInteger(true);    //不会隐式转换，false
Number.isInteger('1');    //不会隐式转换，false
Number.isInteger(Infinity);    //正无穷不算是整数，false

var test = {};
test.toString = function () {
    return 1;
}
Number.isInteger(test);    //不会被隐式转换，false
```



####2.4、Number.parseInt()与Number.parseFloat()

>Number.parseInt(变量[, 进制])


>Number.parseFloat()

等同 ``parseInt()`` 和 ``parseFloat()`` ，并且有个很有意思的地方

```
Number.parseInt === parseInt;    //true
Number.parseFloat === parseFloat;    //true
```

###3、新增常量

####3.1、浮点误差判断，新增极小的常量

首先列出常量

>Number.EPSILON

他的值是：

```
Number.EPSILON;    //2.220446049250313e-16，大约可以理解为2.2e-16
```

进行浮点数计算时，会有一些很奇怪的问题，比如：

```
0.1 + 0.2;    //0.30000000000000004，大概是0.3 + 4e-17
```

但我们知道，他就是0.3，但代码却告诉我们，这个等式是不成立的

```
0.1+0.2 == 0.3;    //注意，我甚至没有用全等，false
```

es6的解决办法是引入一个误差常量，在计算浮点数时，用于进行判断误差。

具体来说，假如a-b的绝对值，小于这个常量，一般情况下就可以认为a==b，如代码：

```
0.1+0.2-0.3 < Number.EPSILON;    //true
```

这里借用阮一峰封装的误差检测函数：

```
//判断两个数是否相等（误差低于一定范围）
function withinErrorMargin(left, right) {
    //Math.abs的效果是返回绝对值（因为负数必然小于这个常量）
    return Math.abs(left - right) < Number.EPSILON;
}
withinErrorMargin(0.1+0.2, 0.3);    //true
```

####3.2、安全整数范围，新增最大安全整数常量和最小安全整数常量

简单来说，整数有最大和最小值，超出这个范围的，会产生误差。例如：

```
Math.pow(2, 53)+0 === Math.pow(2, 53)+1;    //true
Math.pow(2, 53)+1 === Math.pow(2, 53)+2;    //false

Math.pow(2,53)-1;    //9007199254740991
Math.pow(2,53);    //9007199254740992
Math.pow(2,53)+1;    //9007199254740992
Math.pow(2,53)+2;    //9007199254740994
Math.pow(2,53)+3;    //9007199254740996
Math.pow(2,53)+4;    //9007199254740996
Math.pow(2,53)+5;    //9007199254740996
```

> Number.MAX_SAFE_INTEGER  最大的安全整数

其值为2的53次方-1，值为9007199254740991

> Number.MIN_SAFE_INTEGER 最小的安全整数

其值为2的53次方+1，值为-9007199254740991<br>
在这个区间的计算是不会产生误差的（比如像上面那样val == val+1）

检查一个数字是否是安全整数，可以通过以下方法来判断

> Number.isSafeInteger(变量)

是安全整数则返回true，其他返回false

```
Number.isSafeInteger(1);    //true
Number.isSafeInteger(Number.MAX_SAFE_INTEGER);    //true
Number.isSafeInteger(Number.MAX_SAFE_INTEGER - 1);    //true
Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 1);    //超出范围，false
Number.isSafeInteger(1.1);    //浮点数显然不是整数，更别说是安全整数了，false
Number.isSafeInteger(1.0);    //视为整数，true
Number.isSafeInteger('1');    //不会隐式转换，false
```

另外，当可能涉及到超出安全整数范围的问题时，除了结果之外，需要验证 **每一个参与计算的数**，否则依然可能结果不符合预期，如以下代码：

```
(Math.pow(2,53)+1) - (Math.pow(2,53));    //0
```

显然，验算结果的返回值是true，但第一个数和第二个数都不是安全整数，而他们的结果显然也不是0。

所以，假如参与计算的数字里，有一个不在安全整数范围内，那么最终结果仍然可能是不精确的。



####3.3、正数的最大值和最小值（非es6新增）

> Number.MAX_VALUE

最大值：1.7976931348623157e+308

> Number.MIN_VALUE

最小值：5e-324。注意，这是一个小数。

这2个值有什么意义呢？因为他们表示的是正数的最大值和最小值。

在正数范围内，超出这个范围之外，要么和最大或者最小值相等，要么就是Infinity或0。如代码：

```
Number.MAX_VALUE + Math.pow(2,969) === Number.MAX_VALUE;    //true
Number.MAX_VALUE + Math.pow(2,970) === Number.MAX_VALUE;    //false
Number.MAX_VALUE + Math.pow(2,970);    //Infinity
Number.MIN_VALUE/2;    //0
Number.MIN_VALUE/1.2 === Number.MIN_VALUE;    //true
```


####3.4、探讨：关于2的53次方

为什么是2的53次方呢？

首先，知道的比较多的同学，可能知道int类型，分为16位（少见）、32位或64位bit（每1bit由0或1组成），也可能知道double类型。

而double类型就是**双精度浮点数**，这种指使用64位（8字节）来存储一个浮点数。

根据规定，这64位bit里，分为三部分：

**第一部分(1bit)：**

符号位，表示正负，正数为0，负数为1。

**第二部分(11bit)：**

阶码位，也可以称为指数位。

**第三部分（52bit)**

尾数位，即表示实际数字的。

假如正负符号的值为S，正数S为1，负数S为-1；<br>
假如指数位表示的值为E（计算后），指数位表示的值为2的E次方；<br>
假如尾数位表示的值为M，尾数位表示的值为M；<br>

根据科学表示法，任何一个范围内的浮点数可以通过以下方法来表示：（别问我为啥，我没去谷歌……）

> 浮点数 = S * Math.pow(2,E) * M;

#####3.4.1、符号位

0表示正数，S=1；<br>
1表示负数，S=-1；

#####3.4.2、尾数位

尾数位最终表现的值是1.xxxx，这是规定；

由于小数点前的1固定存在，因此忽略；

因为尾数位共52位，加上省略掉的1，因此实际可以理解为53位（但只占用了52位的空间）；

那么尾数位如何表示浮点数呢？

一个例子说明：

```
//0.5**2表示0.5的2次方，下同（es6新增）
//二进制
1011;
//转成十进制浮点数的计算方式
1*0.5**1 + 0*0.5**2 + 1*0.5**3 + 1*0.5**4 = 0.6875

//十进制
0.6875
//二进制
0.6875 = 1*0.5**1 + 0.1875，因此第一位取1
然后0.1875小于0.5**2——0.25，因此第二位取0
0.1875 - 0.5**3 = 0.1875 - 0.125 = 0.0625，因此第三位取1
0.0625 - 0.5**4 = 0，因此第四位取1；
此时剩余0，计算结束，因此最终结果是1011，加上固定省略掉的1和小数点，因此实际应该为1.1011
```

因此52位尾数可以表示很高的精度，具体来说，最小是52个0，表示0.5的52次方；（但为什么不是1+0.5的52次方？不是以1作为浮点数开头么？）

>(0.5**52)

最大是52个1，表示2-0.5的52次方
>(2 -0.5**52)

#####3.4.3、阶码位（指数位）

其中阶码位就是用于存储指数的；

为什么是11bit？（注意，wiki的解释和js有所区别）

首先，2的11次方的值是2048。但这个2048同时包括正负部分；<br>
其次，规定，当阶码全为1，尾码全为0时，表示正负无穷Infinity（根据符号位）；
第三，规定，当阶码全为0，尾码也为0时，表示0（根据符号位有正0或者负0）；
第四，实际使用时为了小数，因此有偏码值1023，11bit表示的数值-1023才是实际的指数位的数字；
第五，综合以上情况，11bit可以表示2048，减去表示0和正负无穷的两种，剩下2046种（1~2046）。减去偏差值，可以得出指数位可以表示（-1022~1023）。

然后指数位最终如何套用到公式里呢？是通过2的指数位次方来套用进去的，具体来说：

最小是2的-1022次方，最大是2的1023次方；

#####3.4.4、结果

因此我们所能表示的正数，最小的是：（尾数全为0，指数10个0，最后1）

Math.pow(2, -1022) * Math.pow(0.5, 52);

```
Number.MIN_VALUE === Math.pow(2, -1022) * Math.pow(0.5, 52);    //true
```

最大是值是：（尾数全为1，指数10个1，最后一个0）

Math.pow(2, 1023) * (2 - Math.pow(0.5, 52));

```
Math.pow(2, 1023) * (2 - Math.pow(0.5, 52)) === Number.MAX_VALUE;    //true
```

关于探讨为何最大和最小安全整数的问题，可以参考[知乎的这篇答案](https://www.zhihu.com/question/29010688)

####3.5、位计算

注意，位计算只支持32位整型数的计算，并不支持64位的。


###4、Math对象的扩展

####4.1、去掉小数部分的Math.trunc()

> Math.trunc(变量)

简单来说，如果不是number类型，或者不能隐式转换成number类型，则返回NaN；<br>
如果可以被转化为number类型，则转换为number类型后，省略掉小数部分并返回number类型的值；

```
Math.trunc(1);    //1
Math.trunc(1.9);    //1
Math.trunc(-10.9);    //-10
Math.trunc(-0);    //-0，注意会保留负号
Math.trunc('-10.9');    //-10，可以识别字符串
Math.trunc(0o10);    //8，可以正常识别二进制、八进制和十六进制数字

var obj = {};
obj.toString = function () {
    return '+2.9';
}
Math.trunc(obj);    //2，对于对象通过toString隐式转换，不会保留+号（但会保留减号）

Math.trunc('a10');    //NaN，不能被隐式转换为number
Math.trunc([1, 2]);    //NaN，也不能
Math.trunc({});    //NaN，显然也不能
```


####4.2、判定变量的正负Math.sign()

> Math.sign(变量)

五种情况：

1. 正数返回+1；
2. 负数返回-1；
3. 正0返回0；
4. 负0返回-0；
5. 其他返回NaN；

参数会被隐式转换为number类型再判断。示例：

```
Math.sign(0);    //0
Math.sign(-0);    //-0
Math.sign(100.1234);    //1
Math.sign(-100.1234);    //-1
Math.sign(Number.MIN_VALUE);    //1
Math.sign(Number.MIN_VALUE / 2);    //0，这个是因为已经是最小的数字了，再除以在存储的时候和0一样，于是就变成0了

var obj = {};
obj.toString = function () {
    return '+2.9';
}
Math.sign(obj);    //1，说明是被隐式转换过的

Math.sign('a10');    //NaN，不能被隐式转换为number
Math.sign([1, 2]);    //NaN，也不能
Math.sign({});    //NaN，显然也不能
```


####4.3、开立方Math.cbrt()

> Math.cbrt(变量)

简单来说，求变量的开立方根结果。例如数字8开立方根的结果是2。

另外提一句，开平方根是Math.sqrt();

变量会被隐式转换后再计算，不符合要求的输入内容会返回NaN。

```
Math.cbrt(1);    //1
Math.cbrt(8):    //2
Math.cbrt(-8);    //-2
Math.cbrt(0);    //0

var obj = {};
obj.toString = function () {
    return '8';
}
Math.cbrt(obj);    //2，说明会被隐式转换

Math.cbrt({});    //NaN
```

####4.4、返回一个整数二进制开头的0的数量Math.clz32()

> Math.clz32()

首先，在位计算相关的函数里，只支持32位整型数的计算（见3.5，更多请谷歌百度）；

其次，这个函数只对32位整型数生效；

第三，忽视小数部分；

第四，当一个32位整型数被存储时，他只会占用0~32位，而这个函数将返回未被占用的二进制的byte的数量；

第五，对于超过32位整型数的数字，固定返回32；

第六，会隐式转换为number来处理，对于依然不合法输入，返回32；

第七，左移<< 和 右移>> 位计算符，可以直接影响结果（毕竟会多占或少占一位）；

第八，负数固定返回0.

```
Math.clz32(0);    //32
Math.clz32(-0);    //32
Math.clz32(-1);    //0
Math.clz32(1);    //31
Math.clz32(1<<1);    //30
Math.clz32(4);    //29
Math.clz32(4>>1);    //30
Math.clz32(Math.pow(2,32)-1);    //0
Math.clz32(Math.pow(2,32));    //32
Math.clz32({});    //32
Math.clz32('5');    //29
```

####4.5、Math.imul()

> Math.imul(变量1, 变量2)

按照说明：

两个数相乘，得到一个数，然后返回结果的32位整型数的部分。

> alert：实际结果与预想不符，

如按 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/imul) 给的polyfill函数的运行结果，与chrome中的Math.imul()的运行结果不同；


差异如代码：
```
imul(0x7ffff,0x7ffff);    //8588886017
Math.imul(0x7ffff,0x7ffff);    //-1048575
524287*524287;    //274876858369，但这个的值大于2的32次方-1
```

####4.6、返回单精度浮点数Math.fround

>Math.fround(变量)

####4.7、返回参数平方和的平方根

>Math.hypot(arguments)

参数可能存在多个；

简单来说就是每个参数先自乘获得平方，然后再将结果的和相加，然后开方即可。

注意和Math.sqrt()的结果可能所有差异（主要是因为精度问题）

```
Math.hypot(1);    //1
Math.hypot(1,2);    //2.23606797749979
Math.hypot(1,2,3);    //3.741657386773941
Math.sqrt(1 +4+9);    //3.7416573867739413
Math.hypot(1,2,-3) === Math.hypot(1,2,3);    //true
```


####4.8、增加了一些对数方法

略略略

> Math.expm1(x)

返回ex - 1，即Math.exp(x) - 1

> Math.log1p()

返回1 + x的自然对数，即Math.log(1 + x)。如果x小于-1，返回NaN。

> Math.log10()

返回以10为底的x的对数。如果x小于0，则返回NaN。

> Math.log2()

返回以2为底的x的对数。如果x小于0，则返回NaN

####4.9、增加了一些三角函数的方法

略略略

> Math.sinh(x)

返回x的双曲正弦（hyperbolic sine）

> Math.cosh(x)

返回x的双曲余弦（hyperbolic cosine）

> Math.tanh(x)

返回x的双曲正切（hyperbolic tangent）

> Math.asinh(x)

返回x的反双曲正弦（inverse hyperbolic sine）

> Math.acosh(x)

返回x的反双曲余弦（inverse hyperbolic cosine）

> Math.atanh(x)

返回x的反双曲正切（inverse hyperbolic tangent）


####4.10、指数运算符**

> **

注，就是2个乘号连一起

简单来说：

```
2**3 === Math.pow(2, 3);    //true
5**7 === Math.pow(5, 7);    //true
```

