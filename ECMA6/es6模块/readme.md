由于浏览器还不支持import和export，因此需要转码。

先全局安装转码模块

>npm install -g es6-module-transpiler

然后入口文件为：foo.js

html里引入的文件是转码完毕后的文件，命名为test.js，并在test.html里引入

转码命令为：

> compile-modules convert foo.js -o test.js

但全额下载下来本文件夹后，可以通过运行

> npm run test

来实现和上面转码命令相同的效果。

总结一下：

1. 根据需要修改foo.js，以及他导入的其他文件；
2. 运行npm run test转码；
3. 刷新test.html的页面，查看修改后的效果；