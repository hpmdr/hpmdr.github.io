/**
 * 文档夹在完成事件
 * @param fn
 */
var ready = function f(fn) {
    if (document.addEventListener) {
        document.addEventListener("DOMContentLoaded", function () {
            document.removeEventListener("DOMContentLoaded", arguments.callee, false);
            fn();
        }, false)
    } else {
    }
}