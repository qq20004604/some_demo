#字符串的扩展

前注：不关心细节的人，可以看【一句话总结】部分；


###字符串的Unicode表示法

解释：

    1. 首先，任意一个字符（比如数字、英文字符、汉字、符号等）都可以用Unicode的表示方法来表示。
    2. 关于Unicode的更多介绍可以自行百度或者谷歌，其大致可以理解，在js里为用“\u”加上四个十六进制字符来表示任意一个字符。
    3. 在之前版本的js里，若要用Unicode表示一个字符，可以像以下这么做：

    console.log("\u0041");    //A

    4. 注意，需要补足4位（前面补0）才能正常输出结果，否则会报错；
    5. 如果有一个字符超出\u0000~\uFFFF所能表示的范围呢，那么旧版的写法是无法表示出这个字符的（原因是不能识别）。
    6. 在ES6中，为了避免这个问题的出现，解决办法是用大括号{}将\u后的编码放在一起。
    7. 这样如果不足4位则不用补零，超过4位也无须担心无法解析。如代码：

    "\u{41}";    //A
    "\u{20BB7}";    //𠮷，如果看到的是乱码，则自行在浏览器的console里输入本行代码查看，下同


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


···

###includes(), startsWith(), endsWith()

原型：

    str.includes(searchString[, position])
    str.startsWith(searchString[, position])
    str.endsWith(searchString[, position])
    
解释：

    1. 简单来说，在默认情况下（只有第一个参数）：
        str.includes(searchString)    用于检测某个字符串（str）中是否包含参数字符串（searchString）；
        str.startsWith(searchString)    用于检测某个字符串（str）是否以参数字符串（searchString）为开头；
        str.endsWith(searchString)    用于检测某个字符串（str）是否以参数字符串（searchString）为结尾；
        请参照【示例代码一】
        
    2. 关于第二个参数，用于限定寻找范围（只搜索字符串中一部分）
        str.includes(searchString, pos)    表示寻找范围是(pos, str.length-1)，注意，str的第一个字符pos值为0
        str.startsWith(searchString, pos)    表示寻找范围是(pos, str.length-1)，即编号为pos的字符视为开始字符
        str.endsWith(searchString, pos)    表示寻找范围是前pos个字符，即编号为(pos - 1)的字符视为最后一个字符
        请参照【示例代码二】

【示例代码一】只有第一个参数
```javascript
"abc".includes("bc");   //true
"abc".includes("cb");   //false
"abc".startsWith("ab"); //true
"abc".startsWith("bc"); //false
"abc".endsWith("bc");   //true
"abc".endsWith("cb");   //false
```

【示例代码二】包含位置参数
```javascript
"abc".includes("b", 1);   //true, bc中显然包含b
"abc".includes("b", 2);   //false, c中不包含b
"abc".startsWith("ab", 1); //false, bc不是以ab为开头的
"abc".startsWith("bc", 1); //true, bc是以bc开头的
"abc".endsWith("bc", 2);   //false, ab的结尾不是bc
"abc".endsWith("ab", 2);   //true, ab的结尾是ab3
```

---

###repeat()

原型：

    str.repeat(count)
    
解释：

    1. 简单来说，就是将str这个字符串重复count次并返回；
    2. 参数类型要求是number类型（或被隐式转换为number类型）；
    3. 参数的值要求是非负整数次（包括0），浮点数会被取整（舍去小数部分）；
    4. 非法参数会抛出异常；
    5. 参数

示例代码：

```javascript
var str = "abc";
str.repeat(0);     //""
str.repeat(1);     //"abc"
str.repeat(2);     //"abcabc"
str.repeat(1.9);     //"abc"
str.repeat(-1);     //Uncaught RangeError: Invalid count value
```

一句话总结：

    把字符串复制n份并返回

---

###padStart(), padEnd()——ES7特性，ES6不支持

原型：

    str.padStart(length [, padString])
    str.padEnd(length [, padString])
    
解释：

    1. 首先，你的浏览器很可能不支持这个方法，比如我的chrome的版本号为55.0.2883.87就不支持；
    2. 另外，我不太确定是ES7的哪一个版本，但我尝试用Babel转换，即使安装了第四个阶段的ES7转换规则，依然是无法转换的；
    3. 该API在MDN上有文档说明；
    4. 其作用是，当str的长度小于length时，补全str这个字符串到length的长度；
    5. 如何补全呢，内容来源于第二个参数（如果没有则为空白符——应该是一个空格）；
    6. 据说“目前只有 firefox48以上的版本才提供padStart方法。”

更多内容参照阮一峰的吧，我的代码跑不出来结果就不写了。

[链接](http://es6.ruanyifeng.com/#docs/string#padStart，padEnd)

---

###模板字符串

解释：

    1. 简单来说，就是一个字符串，但是这个字符串里，可以省略掉拼接字符串的“+"符号，还会保留换行符、空白符等；
    2. 变量的嵌入靠  ${变量}  ，括号是花括号，花括号里可以是变量，也可以是函数（函数的话会计算出返回值后再插入）；
    3. 用反引号将字符串括起来（而不是单引号或者双引号），反引号是大键盘数字1键左边，tab键上面，和波浪线~同一个键位的符号；
    4. 如果用过例如Vue.js或者React之类，会发现写法有些相似。

附一个简单的demo

```javascript
var dom = $("#test");

//可以字符串       
var userName = "李雷";

//也可以是数字 
var userAge = 20;   

//可以是对象的一个属性 
//也可以是函数
var user = {
    description: "他很高",     
    friends: ["韩梅梅", "Lily", "Lucy"]    
};

//用反引号包裹字符串
var str = `有一个人叫${userName}，他今年${userAge}岁，${user.description}，有几个朋友，分别叫${user.friends.join("，")}`;

//可以直接添加html换行符，不涉及变量的话不需要用反引号              
str += "</br>";   

//也可以直接添加数组作为变量，元素之间会用英文逗号作为连接符。使用变量时必须用反引号
str += `${user.friends}`;   

//string，虽然用反引号，但类型依然是字符串                    
console.log(typeof str);   

dom.append(str);
```

显示结果是：（注，这里是源代码）

```html
<div id="test">有一个人叫李雷，他今年20岁，他很高，有几个朋友，分别叫韩梅梅，Lily，Lucy<br>韩梅梅,Lily,Lucy</div>
```

#####**换行**

    1. 反引号内的换行情况，会被完全应用到html里面。
    2. 但我们有时候会发现，我明明在反引号里面分段写的，实际体现效果却不是分段，而是空白符（表现像是一个空格符）。原因是css属性white-space的原因。浏览器使用默认值时，通常换行、tab、空格会被合并为一个空格。
    3. 解决办法是可以将其css属性值设置为pre；

示例代码：

```javascript
    var dom = $("#test");
    dom.css("white-space", "pre");
    var str = `第一行
第二行`;
    dom.html(str);
```

#####**this**

    1. 变量的嵌入可以使用this，this的指向的对象和通常情况下是相同的，即该this所在作用域；
    2. 更本质的来说，是作用域的问题；
    3. 解析变量时，变量的取值是根据该变量声明时所在作用域里而决定的。

如示例代码：

```javascript
var dom = $("#test");
var name = "外层作用域";
function test() {
    var name = "test函数";
    var str = `${name}`;
    return str;
}
dom.html(test() + `</br>${name}`);
```

例如在以上示例中，test函数返回的是字符串 ``${name}``，而在之后，又拼接了一个 ``${name}``

第一个的取值和第二个的取值是不同的，原因就在于作用域。前者的作用域在test函数之内，而后者的作用域是更外层的作用域。


####**trim方法**

    1. 这个方法是字符串的方法，效果是去除字符串开头和结尾的所有空白符（包括开头和结尾，包括空格、tab、换行符等）；
    2. 对源字符串无影响，是返回一个新的字符串；
    3. 主要作用是格式直观，方便写模板。

示例（若不加trim方法）：
```javascript
    var dom = $("#test");
    dom.css("white-space", "pre");
    var str = `今天
    明天
后天`;
    dom.html(str);
```

示例（添加trim方法）：
```javascript
    var dom = $("#test");
    dom.css("white-space", "pre");
    var str = `
今天
    明天
后天`;
    dom.html(str.trim());
```

####**模板的嵌套**

    1. 模板的本质是字符串，字符串是可以互相拼接的，因此模板显然也是可以拼接的。
    2. 模板拼接后显然还是字符串，而字符串是可以作为变量的值，作为值后可以嵌套到模板里，因此模板可以被嵌套到模板里。
    3. 比较典型的嵌套示例是表格。表格的<table>标签作为根模板，每一行是一个子模板，每个子模板内嵌变量，拼接后就是一个表格。
    4. 因此只要有数据、就可以用简单的几行代码，就可以展现出表格。

如示例代码：

```javascript
    var dom = $("#test");
    dom.css("white-space", "pre");
    var arr = [1, 2, 3, 4, 5];
    var fun = function (num) {
        return `<tr><td>当前数字是${num}</td></tr>`;
    }
    var str = `
这是模板套模板：
<table>
${arr.map(function (item) {
        return fun(item)
    }).join("")}
</table>`;
    dom.html(str.trim());
```

输出结果（源代码）：

```
<div id="test" style="white-space: pre;">这是模板套模板：
<table>
<tbody><tr><td>当前数字是1</td></tr><tr><td>当前数字是2</td></tr><tr><td>当前数字是3</td></tr><tr><td>当前数字是4</td></tr><tr><td>当前数字是5</td></tr>
</tbody></table></div>
```

####**模板的简单应用**

    1. 我们使用模板的目的，就是为了生成一个符合我们要求的字符串，然后将这个字符串内嵌到页面中；
    2. 模板内的变量的值，取决于作用域里对应的变量；
    3. 因此，我们可以通过生成一个函数作用域，然后将模板内需要的值，作为参数传递给函数内，然后生成的模板字符串作为结果返回，这样就可以获得一个符合我们期望的模板了；
    4. 我们甚至可以通过判断是否传参，然后决定模板里的某段内容是否显示，这样生成的模板会更加符合要求；

如代码：

```
<div id="test"></div>
<script>
    var dom = $("#test");
    dom.css("white-space", "pre");
    var fun = function (obj) {
        var template = `<table>`;
        if (typeof obj.name !== "undefined") {
            template += `<tr><td>名字</td><td>${obj.name}</td></tr>`;
        }
        if (typeof obj.age !== "undefined") {
            template += `<tr><td>年龄</td><td>${obj.age}</td></tr>`;
        }
        if (typeof obj.sex !== "undefined") {
            template += `<tr><td>性别</td><td>${obj.sex}</td></tr>`;
        }
        if (typeof obj.isSingle !== "undefined") {
            if (obj.isSingle) {
                template += `<tr><td>单身</td><td>是</td></tr>`;
            } else {
                template += `<tr><td>单身</td><td>否</td></tr>`;
            }
        }
        return template;
    }
    var msg = fun({
        name: "张三",
        sex: "男",
        isSingle: true
    })
    dom.append(msg);
</script>
```

显示结果是：（其中因为没有age属性，所以年龄那一行没有出现）

```
名字	张三
性别	男
单身	是
```

####**标签模板**

作用：

    1. 过滤HTML字符串，防止用户输入恶意内容。
    2. JSX语法

生效方式：

    1. 具体来说：
        有模板（注意该模板不能被赋值为变量后使用）：
        `<p>变量1${a}，变量2${b}</p>`
        

        有函数:
        var fun = function (arr, arg1, arg2) {
            console.log(arr);
            console.log(arg1);
            console.log(arg2);
        }
        
    2. 当调用函数fun处理模板时，根据使用方式不同，结果可能不同，具体而言：
        ——————————————————————————————————————————————————
        //情况1：（注意，模板没有被括号包含起来）
        var a = 10;
        var b = "b";
        fun`<p>变量1${a}，变量2${b}</p>`
        
        输出结果是：
        ["<p>变量1", "，变量2", "</p>", raw: Array[3]]
        10
        b
        ——————————————————————————————————————————————————
        //情况2：（模板被括号包含起来）
        var a = 10;
        var b = "b";
        fun(`<p>变量1${a}，变量2${b}</p>`)

        输出结果是：
        <p>变量110，变量2b</p>
        undefined
        undefined
        ——————————————————————————————————————————————————
        
    3. 解释：
        情况二是常规情况，就不解释了。
        情况一中，当模板直接跟在函数名之后，被调用处理时，其并非是直接把模板解释为字符串后再被函数处理，而是将模板分拆成几部分
        具体来说：
        fun`<p>变量1${a}，变量2${b}</p>`
        相当于
        fun(["<p>变量1", "，变量2", "</p>"], 10, "b");
        
        也就是说，
        ①将模板里内嵌的变量从模板中依次提取出来，作为函数的第2、3、4……个参数；
        ②而模板本身被内嵌的变量分拆为（变量数 + 1）个部分，这些部分被依次放到一个数组中，并且将这个数组作为函数的第一个参数；
        
    4. 通俗的总结：
        当模板直接跟在函数名后，模板被拆分为（变量数*2+1）个部分，其中非变量部分被放置在数组中，作为函数的第一个参数来处理，变量部分被依次放在函数的第2、3、4……个参数的位置。
        
    5. 这种函数的处理方式被称为【标签模板】

如何使用标签模板：

    1. 由于标签模板的特性，因此我们不能将标签模板以模板字符串的方式使用；
    2. 然而又因为模板的特性，我们需要的只是变量值，标签可以预先写好；
    3. 因此在使用标签模板时，我们需要提前在js代码里写好模板，然后将用户输入的变量作为标签模板的变量传入，然后进行处理；

关于JSX语法：

    1. 由于标签模板的特性，因此我们可以分为几部分：模板字符串（无变量部分），以及变量；
    2. 而在JSX语法中，遇到HTML标签（以<开头）就用HTML规则解析，遇到代码块（以{开头）就用JavaScript规则解析；
    3. 因此，可以利用标签模板的特性，实现JSX语法的功能（因为自动拆分为了变量和html标签）；
    4. 更多关于JSX语法的知识，建议自行谷歌或者百度；

