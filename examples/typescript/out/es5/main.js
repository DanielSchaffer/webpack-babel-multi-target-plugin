webpackJsonp([0],[
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dependency__ = __webpack_require__(1);

let dep = new __WEBPACK_IMPORTED_MODULE_0__dependency__["a" /* Dependency */]();
dep.log();


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Dependency; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Dependency =
/*#__PURE__*/
function () {
  function Dependency() {
    _classCallCheck(this, Dependency);
  }

  _createClass(Dependency, [{
    key: "log",
    value: function log() {
      console.log('hello!');
    }
  }]);

  return Dependency;
}(); //# sourceMappingURL=dependency.js.map

/***/ })
],[0]);
//# sourceMappingURL=main.js.map