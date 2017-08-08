<h3>1、Iterator</h3>

**<h4>1.1、是什么？</h4>**

0、这个对于没接触过相关概念的人来理解，可能比较复杂，建议直接跳过本章，或者耐心查看理解；

1、**Iterator**，翻译成中文是【迭代器】。在[维基百科关于迭代器的说明中](https://zh.wikipedia.org/wiki/%E8%BF%AD%E4%BB%A3%E5%99%A8)，说明了迭代器是一种设计模式。附一篇[关于迭代器模式的说明博文](http://wiki.jikexueyuan.com/project/java-design-pattern/iterator-pattern.html)。

2、在javascript中，他就是一个接口，用于访问有其接口的数据类型；

**<h4>1.2、有什么用？</h4>**

1、简单来说，假设有一种数据结构，我不想关心如何去遍历他（如何内部实现），我只想去遍历他（如何应用），那么迭代器可能就是有用的；

2、例如，现在我需要遍历一个链表，虽然他以数组的形式来存储，但遍历的时候我并不希望按数组的形式来遍历，而是以链表本身的方式来遍历，那么该怎么办呢？使用迭代器即可，简单阐述做法如下：

1. 链表每个成员应有属性指向下一个目标索引的属性（nextIndex），和该成员的值（val），调用构造函数（假设为Foo），并在创建Foo的实例时将该链表作为初始化参数传入；
2. 构造函数Foo中，应有一个makeIterator函数，用于创造一个迭代器（例如设为iter），iter有2个属性，分别是指向下一个目标的索引（例如设为nextIndex），以及next方法（该方法会通过nextIndex获取到下个元素）；
3. 找到该链表的第一个元素的位置，通常是下标为0的元素，将0赋值给iter.nextIndex，然后返回iter，他就是迭代器对象（注意这个时候还没有开始遍历链表）；
4. 每次调用iter.next()，根据iter.nextIndex，找到下一个元素（例如设为bar）；
5. 如果找到了，设置 ``iter.nextIndex = bar.nextIndex`` ，创建一个新对象 ``{value: bar.val, done: false}``，返回这个新对象；
6. 如果没找到或者iter.nextIndex的值为undefined，设置 ``iter.nextIndex = undefined`` ，返回一个新对象 ``{value: undefined, done: true}``
7. 构造函数Foo，应有一个属性``[Symbol.iterator]``，他是一个函数，函数内部会调用makeIterator来生成迭代器并返回。可以通过Foo函数的实例来直接调用[Symbol.iterator]用于生成迭代器。

<br>
如果看不明白，请参照【标题1.5、实战实现链表结构】的代码

**<h4>1.3、怎么有？</h4>**

5、某些原生类型自带Iterator接口的，包括：Array、Map、Set、String、TypedArray、函数的arguments

6、自定义类型（比如构造函数）显然是没有的，对象也没有，但是我们可以自行按照标准配置Iterator接口，这样我们就可以按照Iterator的标准来遍历该数据结构了

**<h4>1.4、实战配置Iterator接口，以及使用其特性</h4>**

1、配置了Iterator后，我们可以使用其的一些特性（比如数组的扩展运算符）

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

另外提一句，如果这个循环是无终止的（即到最后一个后又跳到第一个这种无限循环），会导致内存溢出，就是这样。

**<h4>1.5、实战实现链表结构</h4>**

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

**1、扩展运算符**

之前提了一个数组的扩展运算符，可以将其转为数组，这个比较好理解（就是按遍历次序依次放在数组里即可）

由于数组的遍历会调用遍历器接口，所以任何接受数组作为参数的场合，其实都调用了遍历器接口。

例如

```
for...of
Array.from()
Map(), Set(), WeakMap(), WeakSet()（比如new Map([['a',1],['b',2]])）
Promise.all()
Promise.race()
```

**2、对象的**

对象也有一个解构赋值，这个比较麻烦。

