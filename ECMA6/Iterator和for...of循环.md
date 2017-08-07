<h3>1、Iterator</h3>

**是什么？**

1、是遍历器，是一种接口。用于在自定义数据结构后，为其设置遍历顺序，就像数组那样。

2、某些原声类型自带Iterator接口的，包括：Array、Map、Set、String、TypedArray、函数的arguments

3、自定义类型（比如构造函数）显然是没有的，对象也没有，但是我们可以自行配置Iterator接口，这样我们就可以按照Iterator的标准来遍历该数据结构了

**为什么？**

1、配置了Iterator后，我们可以使用其的一些特性

如代码：

```
function Test() {
    let arr = [3, 2, 1]

    function Iterator() {
        let index = 0
        // 该对象有next方法，调用后返回一个当前索引下的值
        this.next = function () {
            let obj = {}
            if (index < 3) {
                obj.value = arr[index]
                obj.done = false
                index++
            } else {
                obj.value = undefined
                obj.done = true
            }
            return obj
        }
        // 返回他自己
        return this
    }

    // 遍历器接口
    this[Symbol.iterator] = function () {
        // 创建一个遍历器对象（Iterator不是关键词）
        let temp = new Iterator()
        // 返回他
        return temp
    }
}
let foo = new Test()
let bar = foo[Symbol.iterator]()
bar.next()  // {value: 3, done: false}
bar.next()  // {value: 2, done: false}
bar.next()  // {value: 1, done: false}
bar.next()  // {value: undefined, done: true}
// 有Iterator接口的对象的特性之一
[...foo]	// [3, 2, 1]
```

2、实现比较复杂的情况，例如常见数据结构之一的链表

```

function Test(array) {
    function Iterator() {
        let index = 0
        this.next = function () {
            let obj = {}
            // 如果接下来没有指向目标了，则返回done
            if (array[index] === undefined) {
                obj.value = undefined
                obj.done = true
            } else {
                obj.value = 'this index is ' + index + '， ' + array[index].value
                obj.done = false
                index = array[index].nextIndex
            }

            return obj
        }
        return this
    }

    this[Symbol.iterator] = function () {
        let temp = new Iterator()
        return temp
    }
}
let testArray = [
    {nextIndex: 2, value: 'next is 2'},
    {nextIndex: 4, value: 'next is nothing'},
    {nextIndex: 3, value: 'next is 3'},
    {nextIndex: 1, value: 'next is 1'}
]
let foo = new Test(testArray)
let bar = foo[Symbol.iterator]()
bar.next()  // {value: "this index is 0， next is 2", done: false}
bar.next()  // {value: "this index is 2， next is 3", done: false}
bar.next()  // {value: "this index is 3， next is 1", done: false}
bar.next()  // {value: "this index is 1， next is nothing", done: false}
bar.next()  // {value: undefined, done: true}
```

如果愿意，还可以玩的更复杂一点，即实现树形结构的遍历（例如要求树的每个节点存放其每个子节点所在的索引，然后就可以实现遍历整个树了），具体代码比较麻烦，简单讲下原理（大约是这样，不完全准确）。

1、父节点A有B、C两个子节点，因此有属性存放B、C的索引；

2、从0开始，下个索引指向A；

3、调用next，遍历到A，设置A为已遍历；

4、查看A存放有B、C两个子节点的索引，给A添加一个临时数组属性，将B、C的索引放置进去；

5、从临时数组取出B的索引，设置下个索引为B的索引；

6、给B设置一个临时属性，指向父节点A的索引；

7、返回A；

8、调用next，遍历到B，设置B为已遍历；

9、查看发现B没有子节点；设置下个索引为A，并删除B的临时属性，返回B；

10、调用next，再次遍历到A，发现A已遍历了，查看A的临时数组属性，发现有C的索引，取出C的索引，遍历到C，设置C为已遍历；

11、给C设置一个临时属性，指向父节点A的索引；

12、查看发现C没有子节点，设置下个索引为A，并删除C的临时属性，返回C；

13、调用next，再次遍历到A，然后发现A已遍历了，查看发现A有临时数组属性，但值为空，所以是遍历完所有A的子节点，因此删除临时属性；

14、查看发现A没有指向父节点索引的临时属性，因此认定为遍历完毕，返回对象``{value: undefined, done: true}``

<h3>2、Iterator的使用场合</h3>

<h4>2.1、常见使用场合</h4>

由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了遍历器接口。

例如

```
for...of
Array.from()
Map(), Set(), WeakMap(), WeakSet()（比如new Map([['a',1],['b',2]])）
Promise.all()
Promise.race()
```

又或者是字符串之类