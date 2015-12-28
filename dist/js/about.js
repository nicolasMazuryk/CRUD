var about =
webpackJsonp_name_([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _interopRequireDefault = __webpack_require__(1)['default'];

	var _test = __webpack_require__(3);

	var _test2 = _interopRequireDefault(_test);

	var moduleName = location.pathname.slice(1);

	var context = __webpack_require__(8).context('./routes', false, '.js');

	var route = undefined;

	try {
	    route = context('./' + moduleName);
	} catch (e) {
	    alert(e);
	}

	if (route) {
	    route();
	}

	var _module = (0, _test2['default'])('The About Page');

	_module.setElem(_module.header);

	_module.content.on('mouseover', function () {
	    _module.changeBg(_module.content);
	});

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */,
/* 5 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
	  console.log('The Login.JS has been required');
	};

/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	module.exports = function () {
	    alert('The Logout.JS has been dynamically required');
	};

/***/ },
/* 7 */,
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./common": 7,
		"./common.js": 7,
		"./routes/login": 5,
		"./routes/login.js": 5,
		"./routes/logout": 6,
		"./routes/logout.js": 6,
		"./test": 3,
		"./test.js": 3
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 8;


/***/ }
]);