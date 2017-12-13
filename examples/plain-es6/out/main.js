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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dependency__ = __webpack_require__(2);

const foo = 'bar';
const someEs6 = thing => {
  Object(__WEBPACK_IMPORTED_MODULE_0__dependency__["a" /* default */])();
  return `${foo}${thing}`;
};
/* harmony export (immutable) */ __webpack_exports__["a"] = someEs6;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = (() => console.log('dependency!'));

/***/ })
],[0]);
//# sourceMappingURL=main.js.map