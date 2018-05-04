var i = 0;
var countUp = function () {
    i++;
    postMessage(i);
    console.log("发射了：" + i);
    setTimeout("countUp()", 500);
}
countUp();