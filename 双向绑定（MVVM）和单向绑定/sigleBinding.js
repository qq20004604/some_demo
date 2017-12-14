/**
 * Created by 王冬 on 2017/12/14.
 * QQ: 20004604
 * weChat: qq20004604
 */

// 这是一个简陋的单向绑定
// DOM需要是jQuery的DOM（为了省事）
const sigleBinding = {
    // 绑定文本框
    DOM(obj, key, $DOM) {
        let state = Object.getOwnPropertyDescriptor(obj, key)
        Object.defineProperty(obj, key, {
            configurable: true,
            set(newVal) {
                $DOM.text(newVal)
                if (state && typeof state.get === 'function') {
                    state.get.call(null, newVal)
                }
            },
            get() {
                return $DOM.text()
            }
        })
    },
    // 绑定输入框
    input(obj, key, $input) {
        let state = Object.getOwnPropertyDescriptor(obj, key)
        Object.defineProperty(obj, key, {
            configurable: true,
            set(newVal) {
                $input.val(newVal)
                if (state && typeof state.get === 'function') {
                    state.get.call(null, newVal)
                }
            },
            get() {
                return $input.val()
            }
        })
    }
}

export default sigleBinding