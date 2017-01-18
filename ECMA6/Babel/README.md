##Babel

参考[阮一峰的文章](http://es6.ruanyifeng.com/#docs/intro)所写

解释：

    1. 简单来说，就是可以把ES6的代码转换成ES5的代码，这样你就可以在ES5的环境中运行ES6而不必担心兼容性了；
    2. ES7的转换也可以靠这个来完成；
    3. 其是放置在node_modules文件夹下的插件，就像使用其他通过npm install安装的插件一样使用；
    4. 默认只转换语法，不转换API。比如Iterator、Generator、Set、Maps、Proxy、Reflect、Symbol、Promise等全局对象，以及一些定义在全局对象上的方法（比如Object.assign）都不会转码。

---
####【使用方法】

    1. 在项目的根目录下创建一个文件，文件名是.babelrc，记得放在项目根目录（一般是和package.json还有readme.md同一个目录下）；
    2. 注意1：上面那个文件，在windows下不能直接创建（会提示说必须输入文件名），  
       解决方法1：用linux、mac或者用IDE（比如webstorm）来创建；
       解决方法2：从我的github中直接下载文件
    3. 注意2：那个文件的babelrc就是后缀名，而不是txt格式的（所以会提示没有文件名）；
    4. 用编译器打开（或者用记事本打开也行，注意编码格式是UTF8），文件内基本格式如下：

        {
          "presets": [],
          "plugins": []
        }
        
    5. 这个文件用于设置转码规则和插件；
    6. presets是转码规则，值的数组里面，填写规则。
    7. plugins是插件，有需要就写，不需要的话这个可以省略。
    8. 按需安装转码规则（见下面）；
    9. 将对应的字符串添加到.babelrc中（千万别忘了，我试了半天总转失败，结果发现我没加）
    10. 运行转码命令/内嵌到package.json里在项目运行时转码；

---
####转码规则和转码安装：

    1. 首先应该安装对应的转码规则集（他的规则像安装npm插件一样安装）；
    2. 然后在"presets"这个数组中填写对应的值；
    3. 官方提供的规则集如下（转自[阮一峰的博客](http://es6.ruanyifeng.com/#docs/intro)）：
    
            注：
            $表示命令行，实际输入的时候从npm开始输入（应该不会有人不知道吧）；
            #表示注释，不要输这个后面的文字啊
            
            # ES2015转码规则
            $ npm install --save-dev babel-preset-es2015
            # 添加的字符串为："es2015"（""表示这是个字符串），下同
            
            # react转码规则
            $ npm install --save-dev babel-preset-react
            # 添加的字符串为："react"
            
            # ES7不同阶段语法提案的转码规则（共有4个阶段），选装一个
            $ npm install --save-dev babel-preset-stage-0
            $ npm install --save-dev babel-preset-stage-1
            $ npm install --save-dev babel-preset-stage-2
            $ npm install --save-dev babel-preset-stage-3
            # 添加的字符串为："stage-0"至"stage-3"中的一个（显然后面包含前面）
            
    4. 安装完转码规则之后（根据实际需要安装，不用全部装），在.babelrc文件的"presets"的值中添加对应的字符串作为数组元素，参考上面；

---

###方法一：全局使用babel-cli转码（命令行、单文件、所有文件夹输出结果）

优点：

    1.简单直接暴力，全局安装，哪里都能用；
    
缺点：

    1.项目要求有环境依赖，换了环境不能用（比如说换台电脑，但他没装babel-cli就尴尬了）；

前置准备：

    1. 先配置好，参考【使用方法】
    2. 命令行输入以下代码，来全局安装babel-cli工具
           npm install --global babel-cli
           
**步骤：**

1.控制台输出转换结果（控制台输出）：

    1. 命令行输入以下代码：（下同，都是控制台输入）
           babel input.js
    2. 然后控制台会输出以下内容（转换结果，下同，结果内容都是以下的内容）：
           "use strict";
           
           var input = [];
           input.map(function (item) {
             return item + 1;
           });
           
2.将转换结果输出到指定文件内（单文件转换）：

    1. 输入：
           babel input.js -o output.js
    2. 输出：
           同目录下自动生成output.js，文件内容是上面的转换结果
    3. -o表示--out-file，即输出为文件
           
3.将一个目录下的所有文件（递归执行）全部转码输出到某个文件夹下（同名转换）：

    1. 先建立一个input文件夹，把之前的input.js复制一份进去；
    2. 输入：
           babel input -d output
    3. -d表示--out-dir，即输出到文件夹，前面的input表示输入文件夹名，后面的output表示的是输出的文件夹名；
    4. 输出：output目录被创建，里面有input文件夹下的同名input.js，但内容是转换后的
    5. input文件下所有文件都会被转换，转换过程是递归的（即子文件夹下的子文件，甚至更深层也会被转换）；

---

###非全局使用babel-cli转码（作为项目的依赖转码）

优点：

    1.非全局，不要求PC环境全局安装babel-cli；
    2.方便版本管理
    
缺点：

    1.需要配置package.json，比较麻烦一些；
    
前置准备：

    1. 先配置好，参考【使用方法】
    2. 修改package.json，添加相应的脚本代码；
    3. 具体来说，根目录下创建一个package.json，然后文件内容如下：
           {
             "devDependencies": {
               "babel-cli": "^6.0.0"
             },
             "scripts": {
               "build": "babel input -d output"
             }
           }
           
**转换方法：**

```
1. 先建立一个input文件夹，把之前的input.js复制一份进去；
2. 然后在根目录（即package.json以及.babelrc所在目录的控制台输入：
       npm run build
3. 效果和全局使用的【转换方法3】是一样的；
```

注1：

    npm run build里的build，指的是package.json里面，scripts里的build属性的属性名，如果把属性名改为test，那么就是npm run test

注2：

    npm run build相当于执行了babel input -d output这个指令。只不过这里的babel来源于node_modules文件夹下的babel-cli，而不是之前通过控制台运行的全局的babel-cli

---

###其他转码

如：

1. 提供一个可以直接运行ES6的REPL环境，无需转码直接运行ES6脚本，[点击直达](http://es6.ruanyifeng.com/#docs/intro#babel-node)
2. 加钩子，每当使用require加载.js、.jsx、.es和.es6后缀名的文件，自动转码[点击直达](http://es6.ruanyifeng.com/#docs/intro#babel-register)
3. 对某些代码进行转码（按需转码）[点击直达](http://es6.ruanyifeng.com/#docs/intro#babel-core)
4. 对API进行转码 [点击直达](http://es6.ruanyifeng.com/#docs/intro#babel-polyfill)
5. 在浏览器环境中实时转码（会影响性能，而以上是直接转完后发给浏览器） [点击直达](http://es6.ruanyifeng.com/#docs/intro#http://es6.ruanyifeng.com/#docs/intro#浏览器环境)
6. 还有在线转换（输入ES6代码，输出ES5代码，然后复制拿走使用） [点击直达](https://babeljs.io/repl/#?babili=false&evaluate=true&lineWrap=false&presets=es2015%2Creact%2Cstage-2&code=let%20input%20%3D%20%5B%5D%3B%0D%0Ainput.map(item%20%3D%3E%20item%20%2B%201)%3B)
7. 还有关于Google公司的Traceur转码器，或者是babel和其他框架的配合等，请点击右方链接直达[阮一峰的博客](http://es6.ruanyifeng.com/#docs/intro#与其他工具的配合)来查阅

