#字符串的扩展

前注：不关心细节的人，可以看【一句话总结】部分；


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

**一句话总结：**

加上大括号，可以显示编码超过65535的字符；

---

###codePointAt(pos)

原型：
```
str.codePointAt(pos)
```

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


####**字符串的长度**

当字符的Unicode的编码大于65535时，该字符的长度会被认为是2。如代码：
```javascript
"𠮷".length;    //2
```

另外，也可以通过这个方法检查某个字符的编码是否大于65535来判断这个字符是2个字节还是4个字节。

####**返回十六进制的编码**

使用toString(16)，数字将会被转为十六进制后并返回，返回值类型是string

```javascript
'A'.codePointAt(0).toString(16);    //'41'
```

注意，这里是41是字符串，而且是十六进制的。


####**大于65535编码的字符的潜在问题**

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

使用ES6新增加的for...of方法，[点击查看MDN说明](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...of)，或者查阅我以后写的Iterator部分的内容。

简单来说，这个会自动迭代目标，类似for in，但是for in对四个字节的字符是不支持的（他是2个字节2个字节的遍历，对于4个字节的字符会遍历2次）。

如代码：
```javascript
var str = '𠮷𠮷';
for (let i of str) {
    console.log(i.codePointAt(0));
}
//134071
//134071
```
---

###String.fromCodePoint()

原型：

```
String.fromCodePoint(num1[, ...[, numN]])
```

解释：

    1. 简单来说，这个拿到编码，返回字符，类型是string；
    2. 这个和fromCharCode()方法相比，可以返回编码大于65535的字符；

可看代码：
```javascript
String.fromCodePoint(134071);     //𠮷，参数可以是number  
String.fromCodePoint("0x41");   //A，参数可以是字符串      
String.fromCodePoint(65);       //A，作为十进制来识别     
String.fromCodePoint(0x41);     //A，也可以直接是16进制的数字   
String.fromCodePoint(0101);     //A，也可以是八进制的数字（0开头表示八进制），但注意八进制不能写为字符串       
String.fromCodePoint(65, 65, 65); //AAA，多个参数直接被依次解释并放在同一个字符串里
```

总结：

1. 参数可以是字符串或者是number；
2. 如果是string，要能被隐式转化为number，然后转换后再处理；
3. 如果是number类型，那么要是大于等于0的整数，不能是负数，也不能是浮点数（除非小数点后都是0），否则会抛出异常；
4. 凡是不能被正常转化的，都会被抛出异常 ```Uncaught SyntaxError: Invalid or unexpected token```
5. 如果该方法有多个参数，那么会依次解析每个参数，并且将其按参数的顺序放到字符串中并返回；

<br>
**一句话总结：**
```
str.codePointAt(pos)
```
拿到字符，返回编码；

```
String.fromCodePoint(num1[, ...[, numN]])
```
拿到编码，返回字符



---

###at(pos) ——注：尚未被支持

解释：

    1. 首先，明确在默认情况下，这个方法是不被支持的；
    2. 其次，这个方法的作用是识别四个字节的字符，正确的返回字符串中的第(pos + 1)个字符。
    3. 如果需要使用，则查看github上相关内容

[at()的兼容处理](https://github.com/es-shims/String.prototype.at)

**一句话总结：**

默认不支持，用于返回字符串指定位置的字符；

---

###normalize()

原型：
```
str.normalize([form])
```

解释：

    1. 这个方法主要用于处理合成字符的；
    2. 对中文无效，对超过2个字符的合成无效；

合成字符：

用阮一峰举得例子就是，```'\u004F\u030C'``` 和 ```'\u01D1'``` 都表示字符 ```Ǒ```；  
但是他们的长度不同，也不相等（无论是三个等号还是两个等号），只有视觉和语音上的相同，但对js来说不同；

```javascript
'\u01D1' == '\u004F\u030C';  //false
'\u01D1'.length;    //1
'\u004F\u030C'.length;  //2
```

因此，通过这个方法，可以返回一个字符，你可以指定他返回的是哪一种形式；  
如何指定，就是靠参数了。

参数：（类型是字符串，要求大写）

```
同样以Ǒ为例
'NFC';    返回合成后的字符（例如'\u01D1'这样的）;
'NFD';    返回分解后的字符（例如'\u004F\u030C'）；
'NFKC';    返回语义上等价的，合成后的字符；
'NFKD';    返回语义上等价的，分解后的字符；

合成或者分解的验证可以通过str.length来得知。
```

语义上的等价我谷歌了一个答案：  
表格：
<table>
    <tr>
        <td>Character</td>
        <td>NFC</td>
        <td>NFD</td>
        <td>NFKC</td>
        <td>NFKD</td>
    </tr>
    <tr>
        <td>03D3(ϓ)GREEK UPSILON WITH ACUTE AND HOOK SYMBOL</td>
        <td>03D3</td>
        <td>03D2 0301</td>
        <td>038E</td>
        <td>03A5 0301</td>
    </tr>
    <tr>
        <td>03D4 (ϔ) GREEK UPSILON WITH DIAERESIS AND HOOK SYMBOL</td>
        <td>03D4</td>
        <td>03D2 0308	</td>
        <td>03AB</td>
        <td>03A5 0308</td>
    </tr>
    <tr>
        <td>1E9B (ẛ) LATIN SMALL LETTER LONG S WITH DOT ABOVE</td>
        <td>1E9B</td>
        <td>017F 0307</td>
        <td>1E61</td>
        <td>0073 0307</td>
    </tr>
<table>

[链接](http://unicode.org/faq/normalization.html)


更详细的解释看阮一峰关于这方面的解释，我就不重复阐述了（反正中文又不支持，偷个懒跳过）。[链接](http://es6.ruanyifeng.com/#docs/string#normalize)


