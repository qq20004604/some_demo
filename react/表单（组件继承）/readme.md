<h3>19、继承（事实上还是组合，但展现的效果像是继承）</h3>

我们有时候会面临这样一个情况：

1. 有一个表单；
2. 表单里有单行输入框（input）、多行输入框（textarea），也许还有其他的比如单选框，或多选框；
3. 输入框的样式是统一的，所以希望统一管理；
4. 但每个输入框的验证逻辑不同；
5. 每个输入框都有自己的错误提示；

在往常情况下，我们是这么解决的：

1. 将每个输入框单独拆分成组件，然后表单里依次引入这些组件；
2. 对于 css，因为样式相同，所以采用的是统一的 class，因此可能需要将这些样式单独写入某个css文件，然后在这些样式组件里引入并使用这些类；
3. 在每个组件里写样式，逻辑等；
4. 如果多个样式他们有相同的逻辑，可能需要复制粘贴（优化方式是将这些验证逻辑单独抽象到一个js文件，然后在这些组件里引用这个js文件，并使用这些逻辑）；

示例略。

这种写法，讲道理说，对于一般项目来说，也足够了，优化程度也不差；

但毕竟还有更好的写法，先提思路：

1. 组件分为基础组件和扩展组件；
2. 基础组件是输入框，有样式、HTML 元素、基本的验证逻辑、一些通用的逻辑等（比如通用错误提示）；
3. 扩展组件里内置基础组件，负责 控制值（传到基础组件，但是在这一层控制）、验证逻辑（显然姓名、电话、日期输入框，他们的验证逻辑是不同的）、提示信息（比如 HTML 标签的 title 属性）等；
4. 表单里引入扩展组件；
5. 这意味着，我们在使用的时候，只需要从扩展组件里引入基础组件即可；
6. 在写扩展组件时，只需要专心于逻辑，不需要关心样式等通用性问题；
7. 而写基础组件的时候，只需要关心共性，而不需要关心逻辑，有逻辑则使用逻辑，没有逻辑则执行空函数即可；

附代码（结尾见解释）：

```
// 基础组件
class BaseInput extends React.Component {
    render() {
        let left = {display: 'inline-block', width: '100px'}
        let right = {display: 'inline-block', width: '200px', boxSizing: 'border-box'}
        let DOM
        let changeFn
        if (this.props.onChange) {
            changeFn = e => {
                this.props.onChange(e)
            }
        } else {
            changeFn = () => {
            }
        }
        // 首先，根据类型选择需要的输入框
        if (this.props.type === 'input' | !this.props.type) {
            DOM = <span>
                <span style={left}>{this.props.label}</span>
                <input style={right} type="text"
                       onChange={changeFn}
                       value={this.props.value}/>
            </span>
        } else if (this.props.type === 'textarea') {
            DOM = <span>
                <span style={left}>{this.props.label}</span>
                <textarea style={right} type="text" onChange={changeFn}
                          value={this.props.value}/>
            </span>
        }
        return <div style={{height: '50px'}}>
            {DOM}
            {/* 其次，允许将额外补充内容添加到这里 */}
            {this.props.children}
        </div>
    }
}

class ChineseName extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: ''
        }
        this.verification = this.verification.bind(this)
    }

    verification(e) {
        let v = e.target.value
        // 必须是中文字符
        if (/[\u4e00-\u9fa5]/.test(v)) {
            this.setState({
                value: v
            })
        }
    }

    render() {
        return <BaseInput label={'名字'}
                          type={'input'}
                          value={this.state.value}
                          onChange={this.verification}>
            <span style={{color: 'red'}}>只允许输入中文字符</span>
        </BaseInput>
    }
}

class EnglishName extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            value: ''
        }
        this.verification = this.verification.bind(this)
    }

    verification(e) {
        let v = e.target.value
        // 只能是英文字母和空白符
        if (!/[^a-zA-Z\s]/.test(v)) {
            this.setState({
                value: v
            })
        }
    }

    render() {
        return <BaseInput label={'英文名'}
                          type={'input'}
                          value={this.state.value}
                          onChange={this.verification}>
            <span style={{color: 'red'}}>只允许输入a~z，或者A~Z，或者空白字符</span>
        </BaseInput>
    }
}

class TextareaInput extends React.Component {
    render() {
        return <BaseInput label={'个人情况'} type={'textarea'}>
            <span style={{color: 'red'}}>请务必填写</span>
        </BaseInput>
    }
}


ReactDOM.render(
    <div>
        <ChineseName/>
        <EnglishName/>
        <TextareaInput/>
    </div>,
    document.getElementById('root')
)
```

说明：

1. BaseInput 是基础组件，他负责开放接口。其他扩展组件只需要关心他开放了哪些接口，然后使用即可；
2. ChineseName 是扩展组件之一（是基础组件的特殊实例）；
3. 通过 props.type 告诉基础组件，基础组件负责选择使用哪一个类型的 HTML 元素（input 或者 textarea）；
4. 通过 props.value 传值给基础组件，基础组件负责将这个指放到指定的位置；
4. 传递验证函数 ``verification`` 给基础组件，基础组件负责管理什么时候调用他；
5. 通过 props.children 告诉基础组件，需要将一些来源于扩展组件的 HTML 元素插入，而基础组件负责决定插入到哪里；

更好的优化方法：

1. 假如这个基础组件更加复杂，可以将基础组件再拆分；
2. 比如拆分为 MyInput 组件和 MyTextArea 组件；
3. 基础组件专心于基础组件本身的样式，以及一些通用逻辑，以及 props.children 放置在哪里等；
4. 细分后的 MyInput 组件，可以专心于搞定 input 输入框的样式，通用逻辑等；
