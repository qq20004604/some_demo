#**事件广播**

三个阶段：

1. 创建事件
2. 绑定事件
3. 触发事件

##**创建事件**

**在非IE情况下：**

通过以下方法来创建：

    var ev = document.createEvent("HTMLEvents");
    
    //注意，不能使用event作为变量名，会出错，但我没搞清楚为什么。也许是新增的保留字？

括号内是事件类型，除了HTMLEvents还有一些其他的。

具体请参考：

https://developer.mozilla.org/en-US/docs/Web/API/Document/createEvent

**在IE情况下（主要指低版本IE）：**

暂缺

##**绑定事件**

**在非IE情况下：**

以上面的HTMLEvents为例

    ev.initEvent("test", false, false);
    
1. 首先，这个方法是针对HTMLEvents的，如果是其他事件，则是其他方法（具体查看上面的链接）;
2. 参数一：事件类型（我觉得也可以叫事件名），自定义，类型是字符串；
3. 参数二：是否冒泡；
4. 参数三：是否阻止浏览器默认行为;

关于第三点，我还不太理解，比如说，事件绑定给一个a标签，值设为false，并不能阻止打开a标签的行为
    
**在IE情况下（主要指低版本IE）：**

暂缺

##**触发事件**

**在非IE情况下：**

同样以上面为例：

    DOM结点.dispatchEvent(ev);
    
1. DOM结点指的是触发这个事件的dom，可以是document，也可以是某个子节点;
2. 触发以冒泡形式，从触发子节点向上冒泡（如果在initEvents这一步设置第二个参数为true的话）；

**在IE情况下（主要指低版本IE）：**

暂缺