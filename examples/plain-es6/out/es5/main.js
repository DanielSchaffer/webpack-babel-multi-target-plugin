webpackJsonp([0],[
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__some_es6_js__ = __webpack_require__(1);

console.log('entry!', Object(__WEBPACK_IMPORTED_MODULE_0__some_es6_js__["a" /* someEs6 */])('hey!'));

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return someEs6; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dependency__ = __webpack_require__(2);

var foo = 'bar';
var someEs6 = function someEs6(thing) {
  Object(__WEBPACK_IMPORTED_MODULE_0__dependency__["a" /* default */])();
  return "".concat(foo).concat(thing);
};

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (function () {
  return console.log('dependency!');
});

/***/ })
],[0]);
//# sourceMappingURL=main.js.map