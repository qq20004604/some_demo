#字符串的扩展

###字符串的Unicode表示法

首先，任意一个字符（比如数字、英文字符、汉字、符号等）都可以用Unicode的表示方法来表示。
 
关于Unicode的更多介绍可以自行百度或者谷歌，其大致可以理解，在js里为用“\u”加上四个十六进制字符来表示任意一个字符。

在之前版本的js里，若要用Unicode表示一个字符，可以像以下这么做：

```javascript
console.log("\u0041");    //A
```

注意，需要补足4位（前面补0）才能正常输出结果，否则会报错；

如果有一个字符超出\u0000~\uFFFF所能表示的范围呢，那么旧版的写法是无法表示出这个字符的（原因是不能识别）。

在ES6中，为了避免这个问题的出现，解决办法是用大括号{}将\u后的编码放在一起。

这样如果不足4位则不用补零，超过4位也无须担心无法解析。如代码：

```javascript
console.log("\u{41}");    //A
```

字符表示法汇总（指在字符串里会被自动转换，而不是网页里）

```javascript
console.log("A");  //普通斜线表示法  
console.log("\A");  //普通斜线表示法
console.log("\101");    //斜线后直接数字会被认为是八进制，转换为十进制后是65，而ANSI码中的65表示大写字符A
console.log("\x41");    //斜线后x开头会被认为是16进制，相当于十进制的65
console.log("\u0041");  //Unicode表示法
console.log("\u{41}");  //es6新增
if ("A" === "\A" && "A" === "\101" && "A" === "\x41" && "A" === "\u0041" && "A" === "\u{41}") {
    console.log("yes");    //yes
}
```

他们之间是全等（===）的。


###codePointAt(pos)

解释：

    1. 简单来说，这个方法返回字符串中某个字符的Unicode编码。
    2. 参数表示显示哪一个字符，类型是number，第一个字符是0，第二个是1。如果不存在则默认为0
    3. 返回值是类型是number，十进制的Unicode编码。
    4. 如果找不到（例如返回长度为1的字符串的第二个字符的编码），会返回Unicode

如代码：

```javascript
'A'.codePointAt();  //65
'A'.codePointAt(0); //65
'ABC'.codePointAt();    //65
'ABC'.codePointAt(1);   //66表示B
'𠮷'.codePointAt(0);   //134071
```

和其类似的有方法 ```charCodeAt()```，但这个只能返回编码是0~65535之间的字符的编码，如果超出这个范围，那么就无法正常显示了。但 ```codePointAt()``` 这个方法依然会正确显示结果。

[MDN的 ```charCodeAt()``` 的说明](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt)


####字符串的长度

当字符的Unicode的编码大于65535时，该字符的长度会被认为是2。如代码：
```javascript
"𠮷".length;    //2
```

另外，也可以通过这个方法检查某个字符的编码是否大于65535来判断这个字符是2个字节还是4个字节。

####返回十六进制的编码

使用toString(16)，数字将会被转为十六进制后并返回，返回值类型是string

```javascript
'A'.codePointAt(0).toString(16);    //'41'
```

注意，这里是41是字符串，而且是十六进制的。


####大于65535编码的字符的潜在问题

这个方法可以正常显示大于65535编码的文字，但仍存在一个问题，具体来说，看以下代码：

```javascript
"𠮷𠮷".codePointAt(0);     //134071
"𠮷𠮷".codePointAt(1);     //57271
 ```
 
理论上，由于字符串的第一个和第二个字符都是同一个字，那么我们期望当参数为1和参数为2时，返回的是同样的结果134071。

但事实上，当参数为1时，返回的却是57271。

之所以这样，是因为该文字占4个字符，而不是2个字符。因此实际使用时，只有```'𠮷𠮷'.codePointAt(2); ```的返回值才是134071。

这和我们预期的不符。

**解决办法：**

使用for of方法，[点击查看MDN说明](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...of)

简单来说，这个会自动迭代目标，类似for in，但是for in对四个字街的字符是不支持的（他是2个字符2个字符的遍历）。

如代码：
```javascript
var str = '𠮷𠮷';
for (let i of str) {
    console.log(i.codePointAt(0));
}
//134071
//134071
```

