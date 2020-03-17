import './style/app.css';
/*
* webpack ./src/app.js -o ./build/bundler.js --mode=development
*
* */

const fun = (s) => {
    console.log('fun执行', s);
};


const s = 'sssss';
fun(s);
