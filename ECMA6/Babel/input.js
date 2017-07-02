import "babel-polyfill"

let target = {
    isTarget(){
        if (this === target) {
            console.log("true");
        } else {
            console.log("false");
        }
    }
}
const proxy = new Proxy(target, {});
target.isTarget();  //true
proxy.isTarget();   //false