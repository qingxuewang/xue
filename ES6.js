// 作用域：全局作用域，函数作用域
(function () {
    for (var i = 0; i < 3; i++) {
        console.log(i);
    }
})();
console.log(i);
console.log(window.i);
for(var i = 0; i<3;i++){
  (function (i) {
    setTimeout(function () {
      console.log(i);
    }, 1000);
  })(i);
}
for (let i = 0; i < 3; i++) {
    setTimeout(function () {
      console.log(i);
    }, 1000);
}
console.log(i)