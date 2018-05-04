function f(fun) {
    if (fun instanceof Function) {
        fun();
    }
}

let promise = new Promise((resolve, reject) => {
    try {
        let s = "askkaklajsljaljjlsfajflsajl";
        let obj = {};
        [...s].forEach((v) => {
            obj[v] = obj[v] === undefined ? 1 : (obj[v] + 1);
        });
        s = "";
        let maxCount = 0;
        let maxChar = "";
        for (let p in obj) {
            s = s + p
            if (obj[p] > maxCount) {
                maxCount = obj[p];
                maxChar = p
            }
        }
        console.log("去重后的字符串：" + s + ";出现最多的字符：" + maxChar + "出现次数" + maxCount)
        resolve("处理成功");
    } catch (e) {
        reject("处理失败")
    }
});

f(() => {
    promise.then((msg) => {
        console.log("then:" + msg)
    }).catch((msg) => {
        console.log("catch:" + msg)
    })
});
var test = function () {
    console.log("---------------");
    console.log(true+undefined)
}
test()