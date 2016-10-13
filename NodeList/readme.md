##NodeList
①首先，NodeList不是数组，因此，在某些版本浏览器里，是没有forEach方法的（具体而言，我在chrome50版本里遇见过这个问题）；

NodeList可以通过querySelectorAll来获得。

但注意，通过document.getElementsByClassName获得的并不是NodeList

    console.log(document.getElementsByClassName("test") instanceof NodeList)

返回值是false

②NodeList是获取时决定的，而不是需要他时，实时生成，这点和数组类似，执行代码时确认

    具体见代码

③也就是①中所说，在某些低版本浏览器里，比如我发现在chrome 50这个版本的浏览器中，有querySelectorAll这个方法，但是这个方法获取的NodeList不存在forEach方法，如果使用则会报错，但是chrome51可以正常运行。

解决办法是查看NodeList是否有forEach方法，如果没有的话，则将Array数组的forEach方法提供给他。

    if (!("forEach" in NodeList)) {
        NodeList.prototype.forEach = Array.prototype.forEach;
    }

但我查看某些文章说不推荐这个方法，至于原因我并不是很明白

也可以使用for循环，将其放入一个数组中来替代这个方法，然后使用数组的forEach方法来替代这个方法