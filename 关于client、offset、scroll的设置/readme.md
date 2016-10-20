##关于dom的client、scroll、offset/Width、Height、Left、Top属性的说明

####引自：

http://www.cnblogs.com/dolphinX/archive/2012/11/19/2777756.html

####前缀：

offset、client、scroll

####后缀：

Width、Height、Left、Top

####说明：

1. **clientWidth** 和 **clientHeight** 指盒模型内部的宽高，包含 **padding** ，不包含 **border** （IE下包括，但可能看版本？）和 **margin**，不包含滚动条；

2. **clientTop** 和 **clientLeft** ，指 **border** 的左边和上面高度；

3. **offsetLeft** 和 **offsetTop** 指 **border** 区域以外，距离页面左边和上面的距离（具体的说，假如窗口实际高度1000px，该元素的margin-top是150px，其父元素的margin-top是2225px，那么，**offsetTop** 的值是2225，注意，2225覆盖了150的区域，所以150没有起效）

4. **offsetWidth** 和 **offsetHeight** 指包含border区域的盒模型大小（包含滚动条）；

5. **scrollWidth** 和 **scrollHeight** 是dom可滚动区域的宽和高（不包含border，包含滚动条）；最小值是dom的宽和高（带滚动条）；

6. **scrollTop** 和 **scrollLeft** 是dom当前滚动情况下，页面顶部距离实际顶部的高度和宽度。
