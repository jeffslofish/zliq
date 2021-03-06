/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 44);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = __webpack_require__(4);

Object.keys(_utils).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _utils[key];
    }
  });
});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function () {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for (var i = 0; i < this.length; i++) {
			var item = this[i];
			if (item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function (modules, mediaQuery) {
		if (typeof modules === "string") modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for (var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if (typeof id === "number") alreadyImportedModules[id] = true;
		}
		for (i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if (mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if (mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

/***/ }),
/* 2 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Subheader = undefined;

var _src = __webpack_require__(0);

var Subheader = exports.Subheader = function Subheader(_ref) {
    var title = _ref.title,
        subtitle = _ref.subtitle,
        id = _ref.id;
    return (0, _src.h)(
        "div",
        { "class": "row center" },
        [(0, _src.h)(
            "div",
            { "class": "anchor", id: id },
            []
        ), (0, _src.h)(
            "h3",
            { "class": "light header highlight" },
            [title]
        ), (0, _src.h)(
            "p",
            { "class": "col s12 m8 offset-m2 caption" },
            [subtitle]
        )]
    );
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fetchy = __webpack_require__(23);

Object.keys(_fetchy).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _fetchy[key];
    }
  });
});

var _streamy = __webpack_require__(5);

Object.keys(_streamy).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _streamy[key];
    }
  });
});

var _streamyDom = __webpack_require__(7);

Object.keys(_streamyDom).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _streamyDom[key];
    }
  });
});

var _streamyHyperscript = __webpack_require__(25);

Object.keys(_streamyHyperscript).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _streamyHyperscript[key];
    }
  });
});

var _router = __webpack_require__(24);

Object.keys(_router).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _router[key];
    }
  });
});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.stream = undefined;
exports.merge$ = merge$;
exports.isStream = isStream;

var _deepEqual = __webpack_require__(15);

var _deepEqual2 = _interopRequireDefault(_deepEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*
* stream constructor
* constructor returns a stream
* get the current value of stream like: stream()
*/
var stream = exports.stream = function stream(init_value) {
	function s(value) {
		if (arguments.length === 0) return s.value;
		update(s, value);
		return s;
	}

	s.IS_STREAM = true;
	s.value = init_value !== null ? init_value : null;
	s.listeners = [];

	s.map = function (fn) {
		return map(s, fn);
	};
	s.flatMap = function (fn) {
		return flatMap(s, fn);
	};
	s.filter = function (fn) {
		return filter(s, fn);
	};
	s.deepSelect = function (fn) {
		return deepSelect(s, fn);
	};
	s.distinct = function (fn) {
		return distinct(s, fn);
	};
	s.$ = function (selectorArr) {
		return query(s, selectorArr);
	};
	s.patch = function (partialChange) {
		return patch(s, partialChange);
	};
	s.reduce = function (fn, startValue) {
		return reduce(s, fn, startValue);
	};

	return s;
};

/*
* wrapper for the diffing of stream values
*/
function valuesChanged(oldValue, newValue) {
	return !(0, _deepEqual2.default)(oldValue, newValue);
}

/*
* update the stream value and notify listeners on the stream
*/
function update(parent$, newValue) {
	if (newValue === undefined) {
		return parent$.value;
	}
	parent$.value = newValue;
	notifyListeners(parent$.listeners, newValue);
};

/*
* provide a new value to all listeners registered for a stream
*/
function notifyListeners(listeners, value) {
	listeners.forEach(function notifyListener(listener) {
		listener(value);
	});
}

/*
* provides a new stream applying a transformation function to the value of a parent stream
*/
function map(parent$, fn) {
	var newStream = stream(fn(parent$.value));
	parent$.listeners.push(function mapValue(value) {
		newStream(fn(value));
	});
	return newStream;
}

/*
* provides a new stream applying a transformation function to the value of a parent stream
*/
function flatMap(parent$, fn) {
	var newStream = stream(fn(parent$.value)());
	parent$.listeners.push(function mapValue(value) {
		fn(value).map(function updateOuterStream(result) {
			newStream(result);
		});
	});
	return newStream;
}

/*
* provides a new stream that only serves the values that a filter function returns true for
* still a stream ALWAYS has a value -> so it starts at least with NULL
*/
function filter(parent$, fn) {
	var newStream = stream(fn(parent$.value) ? parent$.value : null);
	parent$.listeners.push(function filterValue(value) {
		if (fn(value)) {
			newStream(value);
		}
	});
	return newStream;
}

/*
* provides a new stream that has a selected sub property of the object value of the parent stream
* the selector has the format [{propertyName}.]*
*/
function deepSelect(parent$, selector) {
	var selectors = selector.split('.');

	function select(parent, selectors) {
		return selectors.reduce(function (input, selector) {
			return input[selector];
		}, parent);
	}

	var newStream = stream(select(parent$.value, selectors));
	parent$.listeners.push(function deepSelectValue(newValue) {
		newStream(select(newValue, selectors), newStream.value);
	});
	return newStream;
};

function query(parent$, selectorArr) {
	if (!Array.isArray(selectorArr)) {
		return deepSelect(parent$, selectorArr);
	}
	return merge$.apply(undefined, _toConsumableArray(selectorArr.map(function (selector) {
		return deepSelect(parent$, selector);
	})));
}

// TODO: maybe refactor with filter
/*
* provide a new stream that only notifys its children if the containing value actualy changes
*/
function distinct(parent$) {
	var fn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (a, b) {
		return valuesChanged(a, b);
	};

	var newStream = stream(parent$.value);
	parent$.listeners.push(function deepSelectValue(value) {
		if (fn(newStream.value, value)) {
			newStream(value, newStream.value);
		}
	});
	return newStream;
}

/*
* update only the properties of an object passed
* i.e. {name: 'Fabian', lastname: 'Weber} patched with {name: 'Fabo'} produces {name: 'Fabo', lastname: 'Weber}
*/
function patch(parent$, partialChange) {
	if (parent$.value == null) {
		parent$(partialChange);
		return;
	}
	parent$(Object.assign({}, parent$.value, partialChange));
}

/*
* reduce a stream over time
* this will pass the last output value to the calculation function
*/
function reduce(parent$, fn, startValue) {
	var aggregate = fn(startValue, parent$.value);
	var newStream = stream(aggregate);
	parent$.listeners.push(function reduceValue(value) {
		aggregate = fn(aggregate, parent$.value);
		newStream(aggregate);
	});
	return newStream;
}

/*
* merge several streams into one stream providing the values of all streams as an array
*/
function merge$() {
	for (var _len = arguments.length, streams = Array(_len), _key = 0; _key < _len; _key++) {
		streams[_key] = arguments[_key];
	}

	var values = streams.map(function (parent$) {
		return parent$.value;
	});
	var newStream = stream(values);
	streams.forEach(function triggerMergedStreamUpdate(parent$, index) {
		parent$.listeners.push(function updateMergedStream(value) {
			newStream(streams.map(function (parent$) {
				return parent$.value;
			}));
		});
	});
	return newStream;
}

function isStream(parent$) {
	return parent$ != null && !!parent$.IS_STREAM;
}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var g;

// This works in non-strict mode
g = function () {
	return this;
}();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1, eval)("this");
} catch (e) {
	// This works if the window reference is available
	if ((typeof window === "undefined" ? "undefined" : _typeof(window)) === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.UPDATE_DONE = undefined;
exports.createElement = createElement;

var _streamy = __webpack_require__(5);

var UPDATE_DONE = exports.UPDATE_DONE = 'update_done';

// js DOM events. add which ones you need
var DOM_EVENT_LISTENERS = ['onchange', 'onclick', 'onmouseover', 'onmouseout', 'onkeydown', 'onload', 'ondblclick'];

var BATCH_CHILD_CHANGE_TRASHHOLD = 5;

/*
* Entry point for the streamy-dom
* creates a DOM element attaches handler for property changes and child changes and returns it immediatly
* this way we already pass around the actual dom element
*/
function createElement(tagName, properties$, children$Arr) {
	var elem = document.createElement(tagName);
	manageProperties(elem, properties$);
	manageChildren(elem, children$Arr);
	return elem;
}

// reacts to property changes and applies these changes to the dom element
function manageProperties(elem, properties$) {
	properties$.map(function (properties) {
		if (!properties) return;
		Object.getOwnPropertyNames(properties).map(function (property) {
			var value = properties[property];
			// check if event
			if (DOM_EVENT_LISTENERS.indexOf(property) !== -1) {
				// we can't pass the function as a property
				// so we bind to the event

				// property event binder start with 'on' but events not so we need to strip that
				var eventName = property.substr(2);
				elem.removeEventListener(eventName, value);
				elem.addEventListener(eventName, value);
			} else if (property === 'class' || property.toLowerCase() === 'classname') {
				elem.className = value;
				// we leave the possibility to define styles as strings
				// but we allow styles to be defined as an object
			} else if (property === 'style' && typeof value !== "string") {
				Object.assign(elem.style, value);
				// other propertys are just added as is to the DOM
			} else {
				elem.setAttribute(property, value);
			}
		});
	});
}

// manage changes in the childrens (not deep changes, those are handled by the children)
function manageChildren(parentElem, children$Arr) {
	// hook into every child stream for changes
	// children can be arrays and are always treated like such
	// changes are then performed on the parent
	children$Arr.map(function (child$, index) {
		child$.reduce(function (oldChildArr, childArr) {
			// the default childArr will be [null]
			var changes = calcChanges(childArr, oldChildArr);

			if (changes.length === 0) {
				return childArr;
			}

			var elementsBefore = getElementsBefore(children$Arr, index);
			// apply the changes
			Promise.all(changes.map(function (_ref) {
				var subIndexes = _ref.indexes,
				    type = _ref.type,
				    num = _ref.num,
				    elems = _ref.elems;

				return updateDOMforChild(elems, elementsBefore, subIndexes, type, num, parentElem);
			}))
			// after changes are done notify listeners
			.then(function () {
				notifyParent(parentElem, UPDATE_DONE);
			});

			return childArr;
		}, []);
	});
}

// when we insert into the DOM we need to know where
// as children can be arrays we need to know how many children are before the one we want to put into the DOM
function getElementsBefore(children$Arr, index) {
	return children$Arr.slice(0, index).reduce(function (sum, cur$) {
		return sum += cur$().length;
	}, 0);
}

// very simple change detection
// if the children objects are not the same, they changed
// if there was an element before and there is no one know it got removed 
function calcChanges(childArr, oldChildArr) {
	var subIndex = 0;
	var changes = [];

	if (oldChildArr.length === 0 && childArr.length === 0) {
		return [];
	}

	for (; subIndex < childArr.length; subIndex++) {
		var oldChild = oldChildArr[subIndex];
		var newChild = childArr[subIndex];
		if (oldChild === newChild) {
			continue;
		};
		var type = oldChild != null && newChild == null ? 'rm' : oldChild == null && newChild != null ? 'add' : 'set';

		// aggregate consecutive changes of the similar type to perform batch operations
		var lastChange = changes.length > 0 ? changes[changes.length - 1] : null;
		// if there was a similiar change we add this change to the last change
		if (lastChange && lastChange.type === type) {
			if (type == 'rm') {
				// we just count the positions
				lastChange.num++;
			} else {
				// for add and set operations we need the exact index of the child and the child element to insert
				lastChange.indexes.push(subIndex);
				lastChange.elems.push(newChild);
			}
		} else {
			// if we couldn't aggregate we push a new change
			changes.push({
				indexes: [subIndex],
				elems: [newChild],
				num: 1,
				type: type
			});
		}
	}
	// all elements that are not in the new list got deleted
	if (subIndex < oldChildArr.length) {
		changes.push({
			indexes: [subIndex],
			num: oldChildArr.length - subIndex,
			type: 'rm'
		});
	}

	return changes;
}

// list of operations
// remove all the elements starting from a certain index
function removeElements(index, subIndexes, countOfElementsToRemove, parentElem, resolve) {
	for (var times = 0; times < countOfElementsToRemove; times++) {
		var node = parentElem.childNodes[index];
		if (node != null) {
			parentElem.removeChild(node);
		}
	}
	resolve();
}
// replace elements with new ones
function setElements(index, subIndexes, children, parentElem, resolve) {
	children.forEach(function (child, childIndex) {
		var actualIndex = index + subIndexes[childIndex];
		var elementAtPosition = parentElem.childNodes[actualIndex];
		parentElem.replaceChild(child, elementAtPosition);
	});
	resolve();
};
// add elements at a certain index
function addElements(index, subIndexes, children, parentElem, resolve) {
	// get right neighbor element and insert one after another before this element
	// index is now on position of insertion as we removed the element from this position before
	var elementAtPosition = parentElem.childNodes[index + subIndexes[0]];
	children.forEach(function (child) {
		if (elementAtPosition == null) {
			parentElem.appendChild(child);
		} else {
			parentElem.insertBefore(child, elementAtPosition);
		}
	});
	resolve();
}

// perform the actual manipulation on the parentElem
function updateDOMforChild(children, index, subIndexes, type, num, parentElem) {
	var _this = this;

	// make sure children are document nodes as we insert them into the DOM
	var nodeChildren = makeChildrenNodes(children);

	// choose witch change to perform
	var operation = void 0;
	switch (type) {
		case 'add':
			operation = addElements;
			break;
		case 'set':
			operation = setElements;
			break;
		case 'rm':
			operation = removeElements;
			break;
		default:
			return Promise.reject('Trying to perform a change with unknown change-type:', type);
	}

	// to minor changes directly but bundle long langes with many elements into one animationFrame to speed things update_done
	// if we do this for every change, this slows things down as we have to wait for the animationframe
	return new Promise(function (resolve, reject) {
		if (nodeChildren && nodeChildren.length > BATCH_CHILD_CHANGE_TRASHHOLD) {
			requestAnimationFrame(operation.bind(_this, index, subIndexes, type === 'rm' ? num : nodeChildren, parentElem, resolve));
		} else {
			operation(index, subIndexes, type === 'rm' ? num : nodeChildren, parentElem, resolve);
		}
	});
}

// transforms children into elements
// children can be calculated child elements or strings and numbers
function makeChildrenNodes(children) {
	return children == null ? [] : children.map(function (child) {
		if (child == null || typeof child === 'string' || typeof child === 'number') {
			return document.createTextNode(child);
		} else {
			return child;
		}
	});
}

// emit an event on the handled parent element
// this helps to test asynchronous rendered elements
function notifyParent(parentElem, event_name) {
	var event = new CustomEvent(event_name, {
		bubbles: false
	});
	parentElem.dispatchEvent(event);
}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Header = undefined;

var _src = __webpack_require__(0);

__webpack_require__(41);

var Header = exports.Header = function Header() {
    var scroll$ = (0, _src.stream)();
    window.addEventListener('scroll', scroll$);

    var headerHidden$ = scroll$.map(function () {
        var scrollTop = window.scrollY;
        return scrollTop > 100;
    });

    return (0, _src.h)(
        'div',
        {
            'class': headerHidden$.map(function (hidden) {
                return "row big-header highlight-background " + (hidden ? 'hidden' : '');
            }),
            onclick: function onclick(e) {
                return e.target.tagName != "A" && scrollUp();
            }
        },
        [(0, _src.h)(
            'div',
            { 'class': 'container' },
            [(0, _src.h)(
                'div',
                { 'class': 'row' },
                [(0, _src.h)(
                    'div',
                    { 'class': 'col s12 center' },
                    [(0, _src.h)(
                        'img',
                        { src: './icon.png' },
                        []
                    )]
                ), (0, _src.h)(
                    'h1',
                    { 'class': 'col s12 center highlight' },
                    ['ZLIQ']
                )]
            ), (0, _src.h)(
                'h3',
                { 'class': 'center highlight-less' },
                ['The web-framework-force you want your Padawan to learn.']
            )]
        ), (0, _src.h)(
            'div',
            { 'class': 'link-list center' },
            [(0, _src.h)(
                'a',
                { href: '#motivation' },
                ['Motivation']
            ), (0, _src.h)(
                'a',
                { href: '#tutorial' },
                ['Tutorial']
            ), (0, _src.h)(
                'a',
                { href: '#streams' },
                ['Streams']
            ), (0, _src.h)(
                'a',
                { href: '#state' },
                ['State']
            ), (0, _src.h)(
                'a',
                { href: '#fetch' },
                ['Fetch']
            ), (0, _src.h)(
                'a',
                { href: '#routing' },
                ['Routing']
            ), (0, _src.h)(
                'a',
                { href: '#testing' },
                ['Testing']
            )]
        )]
    );
};

function scrollUp() {
    scrollTo(document.body, 0, 0.5);
}

function scrollTo(element, to, duration) {
    if (duration <= 0) return;
    var difference = to - element.scrollTop;
    var perTick = difference / duration * 10;

    setTimeout(function () {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollTo(element, to, duration - 10);
    }, 10);
}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Infos = undefined;

var _src = __webpack_require__(0);

var Infos = exports.Infos = function Infos() {
    return [(0, _src.h)(
        "div",
        { "class": "section" },
        [(0, _src.h)(
            "div",
            { "class": "row" },
            [(0, _src.h)(
                "div",
                { "class": "col s12 m4" },
                [(0, _src.h)(
                    "div",
                    { "class": "center promo" },
                    [(0, _src.h)(
                        "i",
                        { "class": "material-icons highlight" },
                        ["fast_forward"]
                    ), (0, _src.h)(
                        "p",
                        { "class": "promo-caption highlight-less" },
                        ["Few concepts"]
                    ), (0, _src.h)(
                        "p",
                        { "class": "light center" },
                        ["ZLIQ is mainly based on functions and streams. If you know React you already understand it. But it doesn't force you into how to build your components.", (0, _src.h)(
                            "br",
                            null,
                            []
                        ), "Bend it to your will."]
                    )]
                )]
            ), (0, _src.h)(
                "div",
                { "class": "col s12 m4" },
                [(0, _src.h)(
                    "div",
                    { "class": "center promo" },
                    [(0, _src.h)(
                        "i",
                        { "class": "material-icons highlight" },
                        ["merge_type"]
                    ), (0, _src.h)(
                        "p",
                        { "class": "promo-caption highlight-less" },
                        ["Based on streams"]
                    ), (0, _src.h)(
                        "p",
                        { "class": "light center" },
                        ["ZLIQ uses streams to apply changes to the DOM. You can provide these streams per component. Or you can provide a state stream and pass it through to your component.", (0, _src.h)(
                            "br",
                            null,
                            []
                        ), "Feel the flow."]
                    )]
                )]
            ), (0, _src.h)(
                "div",
                { "class": "col s12 m4" },
                [(0, _src.h)(
                    "div",
                    { "class": "center promo" },
                    [(0, _src.h)(
                        "i",
                        { "class": "material-icons highlight" },
                        ["short_text"]
                    ), (0, _src.h)(
                        "p",
                        { "class": "promo-caption highlight-less" },
                        ["An evenings read"]
                    ), (0, _src.h)(
                        "p",
                        { "class": "light center" },
                        ["ZLIQ has only a few lines of code (~720 May 2017 incl. comments). ZLIQ will be the first framework you actually understand E2E.", (0, _src.h)(
                            "br",
                            null,
                            []
                        ), "Own your code."]
                    )]
                )]
            )]
        )]
    )];
};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Playground = undefined;

var _src = __webpack_require__(0);

var _subheader = __webpack_require__(3);

__webpack_require__(42);

var Playground = exports.Playground = function Playground() {
    return (0, _src.h)(
        'div',
        { 'class': 'section' },
        [(0, _src.h)(
            _subheader.Subheader,
            { title: 'Experiment', subtitle: 'Fork and get your hands dirty' },
            []
        ), (0, _src.h)(
            'script',
            { async: true, src: '//jsfiddle.net/faboweb/hvbee8m9/embed/js,html,result/' },
            []
        )]
    );
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
        value: true
});
exports.Tutorial = undefined;

var _src = __webpack_require__(0);

var _subheader = __webpack_require__(3);

var _utils = __webpack_require__(14);

var Tutorial = exports.Tutorial = function Tutorial() {
        return (0, _src.h)(
                'div',
                { 'class': 'section' },
                [(0, _src.h)(
                        _subheader.Subheader,
                        { title: 'Writing Components', subtitle: 'Hello World here we come', id: 'tutorial' },
                        []
                ), (0, _src.h)(
                        'p',
                        null,
                        ['ZLIQ is leveraging ES2015 to read easier and to be readable by everybody. ZLIQ is using ', (0, _src.h)(
                                'a',
                                { href: 'https://facebook.github.io/jsx/' },
                                ['JSX']
                        ), ' as a DOM abstraction in JS. This allows templating of the components and allows ZLIQ to define how properties and children are rendered.']
                ), (0, _src.h)(
                        'p',
                        null,
                        ['A component in ZLIQ can look like this:']
                ), (0, _src.h)(
                        _utils.Markup,
                        null,
                        ['\n            |import {h} from \'zliq\';\n            |\n            |// insert values in the markup with {x}\n            |export const Highlight = (props, children) => \n            |    <span class=\'highlight\'>{props.text}</span>;\n            ']
                ), (0, _src.h)(
                        'p',
                        null,
                        ['You need to always provide the ', (0, _src.h)(
                                'code',
                                null,
                                ['h']
                        ), ' function. JSX gets transformed to Hyperscript and the ', (0, _src.h)(
                                'code',
                                null,
                                ['h']
                        ), ' is what gets evaluated by ZLIQ.']
                ), (0, _src.h)(
                        _utils.Markup,
                        null,
                        ['\n            |// before\n            |export const Highlight = ({text}) => \n            |    <span class="highlight">{text}</span>;\n            |\n            |// after\n            |export const Highlight = ({text}) => \n            |    h(\'span\', {\'class\': \'highlight\'}, [text]);\n            ']
                ), (0, _src.h)(
                        'p',
                        null,
                        ['ZLIQ is a reactive view rendering framework. Much like React. Reactivity enables the developer to define how the rendering performs without needing to know when or where the data is coming from. Separating the concerns. ZLIQ will rerender the above component every time the input changes. Displaying it with the new content.']
                ), (0, _src.h)(
                        'p',
                        null,
                        ['To use components in other components just import the function and use the function name as a tag name:']
                ), (0, _src.h)(
                        _utils.Markup,
                        null,
                        ['\n            |import {h} from \'zliq\';\n            |import {Highlight} from \'./highlight.js\';\n            |\n            |let app = <div>\n            |        <Highlight text="Hello World!!!"></Highlight>\n            |    </div>;\n            |...\n            ']
                ), (0, _src.h)(
                        'p',
                        null,
                        ['Insert the generated element into the DOM where you please:']
                ), (0, _src.h)(
                        _utils.Markup,
                        null,
                        ['|document.querySelector(\'#app\').appendChild(app);']
                ), (0, _src.h)(
                        'p',
                        null,
                        ['ZLIQ doesn\'t enforce the parent element rule known from React. Do whatever you like with an element array.']
                ), (0, _src.h)(
                        _utils.Markup,
                        null,
                        ['\n            |import {h} from \'zliq\';\n            |\n            |export const ListItems = () => {\n            |    return [\n            |        <li>I am 1</li>,\n            |        <li>I am 2</li>\n            |    ]\n            |}\n            |\n            |let list = <ul><ListItems /></ul>;\n            ']
                ), (0, _src.h)(
                        'p',
                        null,
                        ['ZLIQ allows HTML style event binding to elements:']
                ), (0, _src.h)(
                        _utils.Markup,
                        null,
                        ['|let button = <button onclick={() => console.log(\'got clicked\')}>Click me</button>;']
                ), (0, _src.h)(
                        _subheader.Subheader,
                        { title: 'Streams', subtitle: 'Feel the flow', id: 'streams' },
                        []
                ), (0, _src.h)(
                        'p',
                        null,
                        ['To render static content, we don\'t need to framework... Actual user interaction with our application will change the state at several occasions over time. Stream-librarys like ', (0, _src.h)(
                                'a',
                                { href: 'https://github.com/Reactive-Extensions/RxJS' },
                                ['RXJS']
                        ), ' are there explicitly for that scenario. ZLIQ includes a very lite implementation of streams inspired by RXJS and ', (0, _src.h)(
                                'a',
                                { href: 'https://github.com/paldepind/flyd' },
                                ['Flyd']
                        ), '.']
                ), (0, _src.h)(
                        _utils.Markup,
                        null,
                        ['\n            |import {stream} from \'zliq\';\n            |\n            |// streams are objects with changing values\n            |let newStream = stream(5);\n            |console.log(newStream()); // 5\n            |newStream(6);\n            |console.log(newStream()); // 6\n            |\n            |// the map function is the easy way to manipulate or interact with values of the stream\n            |newStream.map(value => console.log(value)); \n            |// 6\n            |newStream(7);\n            |// 7\n            ']
                ), (0, _src.h)(
                        'p',
                        null,
                        ['Available stream manipulation functions are ', (0, _src.h)(
                                'code',
                                null,
                                ['.map']
                        ), ', ', (0, _src.h)(
                                'code',
                                null,
                                ['.flatMap']
                        ), ', ', (0, _src.h)(
                                'code',
                                null,
                                ['.filter']
                        ), ', ', (0, _src.h)(
                                'code',
                                null,
                                ['.deepSelect']
                        ), ', ', (0, _src.h)(
                                'code',
                                null,
                                ['.distinct']
                        ), ', ', (0, _src.h)(
                                'code',
                                null,
                                ['.$']
                        ), ', ', (0, _src.h)(
                                'code',
                                null,
                                ['.patch']
                        ), ' and ', (0, _src.h)(
                                'code',
                                null,
                                ['.reduce']
                        ), '. Checkout ', (0, _src.h)(
                                'code',
                                null,
                                ['src/utils/streamy.js']
                        ), ' for descriptions.']
                ), (0, _src.h)(
                        'p',
                        null,
                        ['A special manipulation is the ', (0, _src.h)(
                                'code',
                                null,
                                ['.$()']
                        ), ' query selector. As a developer I often want to react to changes on a specific nested property. The query selector takes one or more property paths and will return a new stream with the current selected properties:']
                ), (0, _src.h)(
                        _utils.Markup,
                        null,
                        ['\n            |let newStream = stream({\n            |    propA: 1,\n            |    propB: {\n            |        propBA: 2\n            |    }\n            |});\n            |console.log(newStream.$(\'propA\')()); // 1\n            |console.log(newStream.$([\'propA\', \'propB.propBA\')()); // [1,2]\n            ']
                ), (0, _src.h)(
                        'p',
                        null,
                        ['The counterpart is the ', (0, _src.h)(
                                'code',
                                null,
                                ['.patch']
                        ), ' functions. It will update just parts of the object:']
                ), (0, _src.h)(
                        _utils.Markup,
                        null,
                        ['\n            |let newStream = stream({\n            |    propA: 1\n            |});\n            |console.log(JSON.stringify(newStream())); // { propA: 1 }\n            |newStream.patch({ propB: 2});\n            |console.log(JSON.stringify(newStream())); // { propA: 1, propB: 2 }\n            ']
                ), (0, _src.h)(
                        'p',
                        null,
                        ['ZLIQ recognizes passed streams in the Hyperscript and updates the DOM on new stream values:']
                ), (0, _src.h)(
                        _utils.Markup,
                        null,
                        ['\n            |let newStream = stream(\'Hello World\');\n            |let app <span>{newStream}</span>;\n            |assert(app.outerHTML === \'<span>Hello World</span>\');\n            |newStream(\'Bye World\');\n            |assert(app.outerHTML === \'<span>Bye World</span>\');\n            ']
                ), (0, _src.h)(
                        'p',
                        null,
                        ['An important difference to RXJS is that streams in ZLIQ always have a value. This actually simplifies the way we think about streams as we always have to expect null values instead of guessing when to expect null values and when not.']
                ), (0, _src.h)(
                        _utils.Markup,
                        null,
                        ['\n            |let newStream = stream();\n            |assert(newStream() == null);\n            |let filteredStream = newStream.filter(x => x != null);\n            |assert(filteredStream() == null);\n            ']
                ), (0, _src.h)(
                        _subheader.Subheader,
                        { title: 'State Management', subtitle: 'F*** Redux. ZLIQ \u2665 streams', id: 'state' },
                        []
                ), (0, _src.h)(
                        'p',
                        null,
                        ['A core reason for web UI frameworks is the automatic updating of the UI according to some state. This is handled very different in the known frameworks. ZLIQ has no dedicated state management. We already saw that ZLIQ reacts to streams in the Hyperscript. This way you are free to decide if you want to put the state locally or globally or where ever.']
                ), (0, _src.h)(
                        'p',
                        null,
                        ['For a component based state like in used in the most MV* frameworks just define a state stream locally.']
                ), (0, _src.h)(
                        _utils.Markup,
                        null,
                        ['\n            |let state$ = stream({ clicks: 0 });\n            |let Component = () => <div>\n            |  Clicks: {state$.$(\'clicks\')}\n            |</div>;\n            ']
                ), (0, _src.h)(
                        'p',
                        null,
                        ['For a centralized state like in [Redux](http://redux.js.org/) define a state for the application and then pass it on to each component.']
                ), (0, _src.h)(
                        _utils.Markup,
                        null,
                        ['\n            |let state$ = stream({ clicks: 0 });\n            |\n            |let Component = ({state$}) => <div>\n            |  Clicks: {state$.$(\'clicks\')}\n            |</div>;\n            |\n            |let app = <Component state$={state$} />;\n            ']
                ), (0, _src.h)(
                        'p',
                        null,
                        ['To manipulate the local or global state you can emit a completely new state to the state stream. Or use the `.patch` function to update only parts of the state:']
                ), (0, _src.h)(
                        _utils.Markup,
                        null,
                        ['\n            |// Redux like action\n            |let increment = (state$) => () => {\n            |    state$.patch({ clicks: state$.$(\'clicks\')() + 1 })\n            |};\n            |\n            |let app = <div>\n            |    <button onclick={increment(state$)}>Click + 1</button>\n            |</div>;\n            ']
                ), (0, _src.h)(
                        _subheader.Subheader,
                        { title: 'Fetching Data', subtitle: 'For all the asynchronous content you need', id: 'fetch' },
                        []
                ), (0, _src.h)(
                        'p',
                        null,
                        ['Modern single page sites are so much better as the old server generated pages as only the content of the page is updated that needs updating. This results in the user getting faster to where he wants to go and therefor a better UX.']
                ), (0, _src.h)(
                        'p',
                        null,
                        ['ZLIQ provides a little wrapper around the native `fetch` function so you can use requests as streams in the Hyperscript:']
                ), (0, _src.h)(
                        _utils.Markup,
                        null,
                        ['\n            |import { fetchy } from \'../src\';\n            |\n            |function fetchQuote(into$) {\n            |\tfetchy({\n            |\t\tmethod: \'GET\',\n            |\t\turl: \'http://quotes.rest/qod.json?category=inspire\'\n            |\t}, (data) => {\n            |\t\treturn {\n            |\t\t\tquote: data.contents.quotes["0"].quote,\n            |\t\t\tauthor: data.contents.quotes["0"].author\n            |\t\t};\n            |\t}).map(into$);\n            |}\n            |let quoteRequest$ = stream({});\n            |\n            |let app = <div>\n            |    <button onclick={() => fetchQuote(quoteRequest$)}>Get Quote of the Day</button>\n            |    <p>\n            |        {\n            |            quoteRequest$.map(({data, loading}) => {\n            |                if (loading) {\n            |                    return \'Loading...\';\n            |                } \n            |                // request was successful\n            |                else if (data != null) {\n            |                    return <p>{data.quote} - {data.author}</p>;\n            |                }\n            |                // not yet requested any data\n            |                return null;\n            |            })\n            |        }\n            |    </p>\n            |</div>;\n            ']
                ), (0, _src.h)(
                        _subheader.Subheader,
                        { title: 'Routing', subtitle: 'To allow deeplinks and browser history', id: 'routing' },
                        []
                ), (0, _src.h)(
                        'p',
                        null,
                        ['ZLIQ currently has a basic router. The router prevents page reloading for local links and gives you a stream for the current routing information:']
                ), (0, _src.h)(
                        _utils.Markup,
                        null,
                        ['\n            |import { initRouter } from \'../src\';\n            |let router$ = initRouter();\n            ']
                ), (0, _src.h)(
                        'p',
                        null,
                        ['The router element is the counterpart in the Hyperscript. It registers a provided route in the global router so we can decide on routes where we need them, in the view:']
                ), (0, _src.h)(
                        _utils.Markup,
                        null,
                        ['\n            |import { Router } from \'../src\';\n            |let routes = [\n            |    <Router router$={router$} route={\'/\'}>\n            |        <a href=\'/place?foo=bar\'>Go to place bar</a>\n            |    </Router>,\n            |    <Router router$={router$} route={\'/place\'}>\n            |        You are at place {router$.$(\'params.foo\')}.\n            |        <a href=\'/\'>Go home</a>\n            |    </Router>\n            |];\n            ']
                ), (0, _src.h)(
                        'p',
                        null,
                        ['The router is currently not allowing for some kind of child-routes.']
                ), (0, _src.h)(
                        'p',
                        null,
                        ['Test the router on this page: ', (0, _src.h)(
                                'a',
                                { href: '/subpage?foo=bar' },
                                ['Go to Subpage']
                        )]
                ), (0, _src.h)(
                        _subheader.Subheader,
                        { title: 'Testing', subtitle: 'A good framework is easy to test', id: 'testing' },
                        []
                ), (0, _src.h)(
                        'p',
                        null,
                        ['ZLIQ returns the actual DOM element. This enables you to easily test the components:']
                ), (0, _src.h)(
                        _utils.Markup,
                        null,
                        ['\n            |import {Highlight} from \'./highlight.js\';\n            |let element = <Highlight text="Hello World!!!"></Highlight>;\n            |assert.equal(element.outerHTML, \'<p>Hello World!!!</p>\');\n            ']
                ), (0, _src.h)(
                        'p',
                        null,
                        ['ZLIQ batches changes that exceed a certain threshold together. This batch then is the rendered in a browser ', (0, _src.h)(
                                'a',
                                { href: 'https://developer.mozilla.org/de/docs/Web/API/window/requestAnimationFrame' },
                                ['animationframe']
                        ), '. Those changes are not immediately applied to the returned element. In those cases we can wait for a ZLIQ generated "UPDATED" event. ']
                ), (0, _src.h)(
                        _utils.Markup,
                        null,
                        ['\n            |let listElems = // has many li-elements.\n            |let listElem = <ul>\n            |    { listElems }\n            |</ul>;\n            |// list items are not rendered yet as they are bundled into one animation frame\n            |assert.equal(listElem.querySelectorAll(\'li\').length, 0);\n            |// we wait for the updates on the parent to have happened\n            |listElem.addEventListener(UPDATE_DONE, () => {\n            |    assert.equal(listElem.querySelectorAll(\'li\').length, length);\n            |    done();\n            |});\n            ']
                ), (0, _src.h)(
                        'p',
                        null,
                        ['If you need an easy test setup checkout how the ZLIQ project uses ', (0, _src.h)(
                                'a',
                                { href: 'https://karma-runner.github.io' },
                                ['Karma']
                        ), '.']
                )]
        );
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(28);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(2)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./styles.scss", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./styles.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(29);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(2)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../css-loader/index.js!../../sass-loader/lib/loader.js!./ghpages-materialize.css", function() {
			var newContent = require("!!../../css-loader/index.js!../../sass-loader/lib/loader.js!./ghpages-materialize.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Output = exports.Markup = undefined;

var _prismjs = __webpack_require__(19);

var _prismjs2 = _interopRequireDefault(_prismjs);

__webpack_require__(18);

__webpack_require__(43);

var _src = __webpack_require__(0);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Markup = exports.Markup = function Markup(props, children) {
    var code = children[0];
    var strippedMarginCode = code.split('\n').filter(function (line) {
        return line.trim() !== '';
    }).map(function (line) {
        return line.trim().substr(1);
    }).join('\n');
    var html = _prismjs2.default.highlight(strippedMarginCode, _prismjs2.default.languages.jsx);
    var elem = document.createElement('code');
    elem.classList.add('language-jsx');
    elem.innerHTML = html;
    return (0, _src.h)(
        'pre',
        { 'class': 'language-jsx' },
        [elem]
    );
};

var Output = exports.Output = function Output(props, children) {
    return (0, _src.h)(
        'pre',
        { 'class': 'example-output' },
        [children]
    );
};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var pSlice = Array.prototype.slice;
var objectKeys = __webpack_require__(17);
var isArguments = __webpack_require__(16);

var deepEqual = module.exports = function (actual, expected, opts) {
  if (!opts) opts = {};
  // 7.1. All identical values are equivalent, as determined by ===.
  if (actual === expected) {
    return true;
  } else if (actual instanceof Date && expected instanceof Date) {
    return actual.getTime() === expected.getTime();

    // 7.3. Other pairs that do not both pass typeof value == 'object',
    // equivalence is determined by ==.
  } else if (!actual || !expected || (typeof actual === 'undefined' ? 'undefined' : _typeof(actual)) != 'object' && (typeof expected === 'undefined' ? 'undefined' : _typeof(expected)) != 'object') {
    return opts.strict ? actual === expected : actual == expected;

    // 7.4. For all other Object pairs, including Array objects, equivalence is
    // determined by having the same number of owned properties (as verified
    // with Object.prototype.hasOwnProperty.call), the same set of keys
    // (although not necessarily the same order), equivalent values for every
    // corresponding key, and an identical 'prototype' property. Note: this
    // accounts for both named and indexed properties on Arrays.
  } else {
    return objEquiv(actual, expected, opts);
  }
};

function isUndefinedOrNull(value) {
  return value === null || value === undefined;
}

function isBuffer(x) {
  if (!x || (typeof x === 'undefined' ? 'undefined' : _typeof(x)) !== 'object' || typeof x.length !== 'number') return false;
  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
    return false;
  }
  if (x.length > 0 && typeof x[0] !== 'number') return false;
  return true;
}

function objEquiv(a, b, opts) {
  var i, key;
  if (isUndefinedOrNull(a) || isUndefinedOrNull(b)) return false;
  // an identical 'prototype' property.
  if (a.prototype !== b.prototype) return false;
  //~~~I've managed to break Object.keys through screwy arguments passing.
  //   Converting to array solves the problem.
  if (isArguments(a)) {
    if (!isArguments(b)) {
      return false;
    }
    a = pSlice.call(a);
    b = pSlice.call(b);
    return deepEqual(a, b, opts);
  }
  if (isBuffer(a)) {
    if (!isBuffer(b)) {
      return false;
    }
    if (a.length !== b.length) return false;
    for (i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  try {
    var ka = objectKeys(a),
        kb = objectKeys(b);
  } catch (e) {
    //happens when one is a string literal and the other isn't
    return false;
  }
  // having the same number of owned properties (keys incorporates
  // hasOwnProperty)
  if (ka.length != kb.length) return false;
  //the same set of keys (although not necessarily the same order),
  ka.sort();
  kb.sort();
  //~~~cheap key test
  for (i = ka.length - 1; i >= 0; i--) {
    if (ka[i] != kb[i]) return false;
  }
  //equivalent values for every corresponding key, and
  //~~~possibly expensive deep test
  for (i = ka.length - 1; i >= 0; i--) {
    key = ka[i];
    if (!deepEqual(a[key], b[key], opts)) return false;
  }
  return (typeof a === 'undefined' ? 'undefined' : _typeof(a)) === (typeof b === 'undefined' ? 'undefined' : _typeof(b));
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var supportsArgumentsClass = function () {
  return Object.prototype.toString.call(arguments);
}() == '[object Arguments]';

exports = module.exports = supportsArgumentsClass ? supported : unsupported;

exports.supported = supported;
function supported(object) {
  return Object.prototype.toString.call(object) == '[object Arguments]';
};

exports.unsupported = unsupported;
function unsupported(object) {
  return object && (typeof object === 'undefined' ? 'undefined' : _typeof(object)) == 'object' && typeof object.length == 'number' && Object.prototype.hasOwnProperty.call(object, 'callee') && !Object.prototype.propertyIsEnumerable.call(object, 'callee') || false;
};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports = module.exports = typeof Object.keys === 'function' ? Object.keys : shim;

exports.shim = shim;
function shim(obj) {
  var keys = [];
  for (var key in obj) {
    keys.push(key);
  }return keys;
}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function (Prism) {

	var javascript = Prism.util.clone(Prism.languages.javascript);

	Prism.languages.jsx = Prism.languages.extend('markup', javascript);
	Prism.languages.jsx.tag.pattern = /<\/?[\w\.:-]+\s*(?:\s+[\w\.:-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+|(\{[\w\W]*?\})))?\s*)*\/?>/i;

	Prism.languages.jsx.tag.inside['attr-value'].pattern = /=[^\{](?:('|")[\w\W]*?(\1)|[^\s>]+)/i;

	var jsxExpression = Prism.util.clone(Prism.languages.jsx);

	delete jsxExpression.punctuation;

	jsxExpression = Prism.languages.insertBefore('jsx', 'operator', {
		'punctuation': /=(?={)|[{}[\];(),.:]/
	}, { jsx: jsxExpression });

	Prism.languages.insertBefore('inside', 'attr-value', {
		'script': {
			// Allow for one level of nesting
			pattern: /=(\{(?:\{[^}]*\}|[^}])+\})/i,
			inside: jsxExpression,
			'alias': 'language-javascript'
		}
	}, Prism.languages.jsx.tag);
})(Prism);

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

/* **********************************************
     Begin prism-core.js
********************************************** */

var _self = typeof window !== 'undefined' ? window // if in browser
: typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope ? self // if in worker
: {} // if in node js
;

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = function () {

	// Private helper vars
	var lang = /\blang(?:uage)?-(\w+)\b/i;
	var uniqueId = 0;

	var _ = _self.Prism = {
		util: {
			encode: function encode(tokens) {
				if (tokens instanceof Token) {
					return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
				} else if (_.util.type(tokens) === 'Array') {
					return tokens.map(_.util.encode);
				} else {
					return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
				}
			},

			type: function type(o) {
				return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
			},

			objId: function objId(obj) {
				if (!obj['__id']) {
					Object.defineProperty(obj, '__id', { value: ++uniqueId });
				}
				return obj['__id'];
			},

			// Deep clone a language definition (e.g. to extend it)
			clone: function clone(o) {
				var type = _.util.type(o);

				switch (type) {
					case 'Object':
						var clone = {};

						for (var key in o) {
							if (o.hasOwnProperty(key)) {
								clone[key] = _.util.clone(o[key]);
							}
						}

						return clone;

					case 'Array':
						// Check for existence for IE8
						return o.map && o.map(function (v) {
							return _.util.clone(v);
						});
				}

				return o;
			}
		},

		languages: {
			extend: function extend(id, redef) {
				var lang = _.util.clone(_.languages[id]);

				for (var key in redef) {
					lang[key] = redef[key];
				}

				return lang;
			},

			/**
    * Insert a token before another token in a language literal
    * As this needs to recreate the object (we cannot actually insert before keys in object literals),
    * we cannot just provide an object, we need anobject and a key.
    * @param inside The key (or language id) of the parent
    * @param before The key to insert before. If not provided, the function appends instead.
    * @param insert Object with the key/value pairs to insert
    * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
    */
			insertBefore: function insertBefore(inside, before, insert, root) {
				root = root || _.languages;
				var grammar = root[inside];

				if (arguments.length == 2) {
					insert = arguments[1];

					for (var newToken in insert) {
						if (insert.hasOwnProperty(newToken)) {
							grammar[newToken] = insert[newToken];
						}
					}

					return grammar;
				}

				var ret = {};

				for (var token in grammar) {

					if (grammar.hasOwnProperty(token)) {

						if (token == before) {

							for (var newToken in insert) {

								if (insert.hasOwnProperty(newToken)) {
									ret[newToken] = insert[newToken];
								}
							}
						}

						ret[token] = grammar[token];
					}
				}

				// Update references in other language definitions
				_.languages.DFS(_.languages, function (key, value) {
					if (value === root[inside] && key != inside) {
						this[key] = ret;
					}
				});

				return root[inside] = ret;
			},

			// Traverse a language definition with Depth First Search
			DFS: function DFS(o, callback, type, visited) {
				visited = visited || {};
				for (var i in o) {
					if (o.hasOwnProperty(i)) {
						callback.call(o, i, o[i], type || i);

						if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
							visited[_.util.objId(o[i])] = true;
							_.languages.DFS(o[i], callback, null, visited);
						} else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
							visited[_.util.objId(o[i])] = true;
							_.languages.DFS(o[i], callback, i, visited);
						}
					}
				}
			}
		},
		plugins: {},

		highlightAll: function highlightAll(async, callback) {
			var env = {
				callback: callback,
				selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
			};

			_.hooks.run("before-highlightall", env);

			var elements = env.elements || document.querySelectorAll(env.selector);

			for (var i = 0, element; element = elements[i++];) {
				_.highlightElement(element, async === true, env.callback);
			}
		},

		highlightElement: function highlightElement(element, async, callback) {
			// Find language
			var language,
			    grammar,
			    parent = element;

			while (parent && !lang.test(parent.className)) {
				parent = parent.parentNode;
			}

			if (parent) {
				language = (parent.className.match(lang) || [, ''])[1].toLowerCase();
				grammar = _.languages[language];
			}

			// Set language on the element, if not present
			element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

			// Set language on the parent, for styling
			parent = element.parentNode;

			if (/pre/i.test(parent.nodeName)) {
				parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
			}

			var code = element.textContent;

			var env = {
				element: element,
				language: language,
				grammar: grammar,
				code: code
			};

			_.hooks.run('before-sanity-check', env);

			if (!env.code || !env.grammar) {
				if (env.code) {
					env.element.textContent = env.code;
				}
				_.hooks.run('complete', env);
				return;
			}

			_.hooks.run('before-highlight', env);

			if (async && _self.Worker) {
				var worker = new Worker(_.filename);

				worker.onmessage = function (evt) {
					env.highlightedCode = evt.data;

					_.hooks.run('before-insert', env);

					env.element.innerHTML = env.highlightedCode;

					callback && callback.call(env.element);
					_.hooks.run('after-highlight', env);
					_.hooks.run('complete', env);
				};

				worker.postMessage(JSON.stringify({
					language: env.language,
					code: env.code,
					immediateClose: true
				}));
			} else {
				env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;

				callback && callback.call(element);

				_.hooks.run('after-highlight', env);
				_.hooks.run('complete', env);
			}
		},

		highlight: function highlight(text, grammar, language) {
			var tokens = _.tokenize(text, grammar);
			return Token.stringify(_.util.encode(tokens), language);
		},

		tokenize: function tokenize(text, grammar, language) {
			var Token = _.Token;

			var strarr = [text];

			var rest = grammar.rest;

			if (rest) {
				for (var token in rest) {
					grammar[token] = rest[token];
				}

				delete grammar.rest;
			}

			tokenloop: for (var token in grammar) {
				if (!grammar.hasOwnProperty(token) || !grammar[token]) {
					continue;
				}

				var patterns = grammar[token];
				patterns = _.util.type(patterns) === "Array" ? patterns : [patterns];

				for (var j = 0; j < patterns.length; ++j) {
					var pattern = patterns[j],
					    inside = pattern.inside,
					    lookbehind = !!pattern.lookbehind,
					    greedy = !!pattern.greedy,
					    lookbehindLength = 0,
					    alias = pattern.alias;

					if (greedy && !pattern.pattern.global) {
						// Without the global flag, lastIndex won't work
						var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
						pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
					}

					pattern = pattern.pattern || pattern;

					// Don’t cache length as it changes during the loop
					for (var i = 0, pos = 0; i < strarr.length; pos += strarr[i].length, ++i) {

						var str = strarr[i];

						if (strarr.length > text.length) {
							// Something went terribly wrong, ABORT, ABORT!
							break tokenloop;
						}

						if (str instanceof Token) {
							continue;
						}

						pattern.lastIndex = 0;

						var match = pattern.exec(str),
						    delNum = 1;

						// Greedy patterns can override/remove up to two previously matched tokens
						if (!match && greedy && i != strarr.length - 1) {
							pattern.lastIndex = pos;
							match = pattern.exec(text);
							if (!match) {
								break;
							}

							var from = match.index + (lookbehind ? match[1].length : 0),
							    to = match.index + match[0].length,
							    k = i,
							    p = pos;

							for (var len = strarr.length; k < len && p < to; ++k) {
								p += strarr[k].length;
								// Move the index i to the element in strarr that is closest to from
								if (from >= p) {
									++i;
									pos = p;
								}
							}

							/*
        * If strarr[i] is a Token, then the match starts inside another Token, which is invalid
        * If strarr[k - 1] is greedy we are in conflict with another greedy pattern
        */
							if (strarr[i] instanceof Token || strarr[k - 1].greedy) {
								continue;
							}

							// Number of tokens to delete and replace with the new match
							delNum = k - i;
							str = text.slice(pos, p);
							match.index -= pos;
						}

						if (!match) {
							continue;
						}

						if (lookbehind) {
							lookbehindLength = match[1].length;
						}

						var from = match.index + lookbehindLength,
						    match = match[0].slice(lookbehindLength),
						    to = from + match.length,
						    before = str.slice(0, from),
						    after = str.slice(to);

						var args = [i, delNum];

						if (before) {
							args.push(before);
						}

						var wrapped = new Token(token, inside ? _.tokenize(match, inside) : match, alias, match, greedy);

						args.push(wrapped);

						if (after) {
							args.push(after);
						}

						Array.prototype.splice.apply(strarr, args);
					}
				}
			}

			return strarr;
		},

		hooks: {
			all: {},

			add: function add(name, callback) {
				var hooks = _.hooks.all;

				hooks[name] = hooks[name] || [];

				hooks[name].push(callback);
			},

			run: function run(name, env) {
				var callbacks = _.hooks.all[name];

				if (!callbacks || !callbacks.length) {
					return;
				}

				for (var i = 0, callback; callback = callbacks[i++];) {
					callback(env);
				}
			}
		}
	};

	var Token = _.Token = function (type, content, alias, matchedStr, greedy) {
		this.type = type;
		this.content = content;
		this.alias = alias;
		// Copy of the full string this token was created from
		this.length = (matchedStr || "").length | 0;
		this.greedy = !!greedy;
	};

	Token.stringify = function (o, language, parent) {
		if (typeof o == 'string') {
			return o;
		}

		if (_.util.type(o) === 'Array') {
			return o.map(function (element) {
				return Token.stringify(element, language, o);
			}).join('');
		}

		var env = {
			type: o.type,
			content: Token.stringify(o.content, language, parent),
			tag: 'span',
			classes: ['token', o.type],
			attributes: {},
			language: language,
			parent: parent
		};

		if (env.type == 'comment') {
			env.attributes['spellcheck'] = 'true';
		}

		if (o.alias) {
			var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
			Array.prototype.push.apply(env.classes, aliases);
		}

		_.hooks.run('wrap', env);

		var attributes = Object.keys(env.attributes).map(function (name) {
			return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
		}).join(' ');

		return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';
	};

	if (!_self.document) {
		if (!_self.addEventListener) {
			// in Node.js
			return _self.Prism;
		}
		// In worker
		_self.addEventListener('message', function (evt) {
			var message = JSON.parse(evt.data),
			    lang = message.language,
			    code = message.code,
			    immediateClose = message.immediateClose;

			_self.postMessage(_.highlight(code, _.languages[lang], lang));
			if (immediateClose) {
				_self.close();
			}
		}, false);

		return _self.Prism;
	}

	//Get current script and highlight
	var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();

	if (script) {
		_.filename = script.src;

		if (document.addEventListener && !script.hasAttribute('data-manual')) {
			if (document.readyState !== "loading") {
				if (window.requestAnimationFrame) {
					window.requestAnimationFrame(_.highlightAll);
				} else {
					window.setTimeout(_.highlightAll, 16);
				}
			} else {
				document.addEventListener('DOMContentLoaded', _.highlightAll);
			}
		}
	}

	return _self.Prism;
}();

if (typeof module !== 'undefined' && module.exports) {
	module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof global !== 'undefined') {
	global.Prism = Prism;
}

/* **********************************************
     Begin prism-markup.js
********************************************** */

Prism.languages.markup = {
	'comment': /<!--[\w\W]*?-->/,
	'prolog': /<\?[\w\W]+?\?>/,
	'doctype': /<!DOCTYPE[\w\W]+?>/i,
	'cdata': /<!\[CDATA\[[\w\W]*?]]>/i,
	'tag': {
		pattern: /<\/?(?!\d)[^\s>\/=$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\\1|\\?(?!\1)[\w\W])*\1|[^\s'">=]+))?)*\s*\/?>/i,
		inside: {
			'tag': {
				pattern: /^<\/?[^\s>\/]+/i,
				inside: {
					'punctuation': /^<\/?/,
					'namespace': /^[^\s>\/:]+:/
				}
			},
			'attr-value': {
				pattern: /=(?:('|")[\w\W]*?(\1)|[^\s>]+)/i,
				inside: {
					'punctuation': /[=>"']/
				}
			},
			'punctuation': /\/?>/,
			'attr-name': {
				pattern: /[^\s>\/]+/,
				inside: {
					'namespace': /^[^\s>\/:]+:/
				}
			}

		}
	},
	'entity': /&#?[\da-z]{1,8};/i
};

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function (env) {

	if (env.type === 'entity') {
		env.attributes['title'] = env.content.replace(/&amp;/, '&');
	}
});

Prism.languages.xml = Prism.languages.markup;
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;

/* **********************************************
     Begin prism-css.js
********************************************** */

Prism.languages.css = {
	'comment': /\/\*[\w\W]*?\*\//,
	'atrule': {
		pattern: /@[\w-]+?.*?(;|(?=\s*\{))/i,
		inside: {
			'rule': /@[\w-]+/
			// See rest below
		}
	},
	'url': /url\((?:(["'])(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
	'selector': /[^\{\}\s][^\{\};]*?(?=\s*\{)/,
	'string': {
		pattern: /("|')(\\(?:\r\n|[\w\W])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'property': /(\b|\B)[\w-]+(?=\s*:)/i,
	'important': /\B!important\b/i,
	'function': /[-a-z0-9]+(?=\()/i,
	'punctuation': /[(){};:]/
};

Prism.languages.css['atrule'].inside.rest = Prism.util.clone(Prism.languages.css);

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'style': {
			pattern: /(<style[\w\W]*?>)[\w\W]*?(?=<\/style>)/i,
			lookbehind: true,
			inside: Prism.languages.css,
			alias: 'language-css'
		}
	});

	Prism.languages.insertBefore('inside', 'attr-value', {
		'style-attr': {
			pattern: /\s*style=("|').*?\1/i,
			inside: {
				'attr-name': {
					pattern: /^\s*style/i,
					inside: Prism.languages.markup.tag.inside
				},
				'punctuation': /^\s*=\s*['"]|['"]\s*$/,
				'attr-value': {
					pattern: /.+/i,
					inside: Prism.languages.css
				}
			},
			alias: 'language-css'
		}
	}, Prism.languages.markup.tag);
}

/* **********************************************
     Begin prism-clike.js
********************************************** */

Prism.languages.clike = {
	'comment': [{
		pattern: /(^|[^\\])\/\*[\w\W]*?\*\//,
		lookbehind: true
	}, {
		pattern: /(^|[^\\:])\/\/.*/,
		lookbehind: true
	}],
	'string': {
		pattern: /(["'])(\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'class-name': {
		pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[a-z0-9_\.\\]+/i,
		lookbehind: true,
		inside: {
			punctuation: /(\.|\\)/
		}
	},
	'keyword': /\b(if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
	'boolean': /\b(true|false)\b/,
	'function': /[a-z0-9_]+(?=\()/i,
	'number': /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	'punctuation': /[{}[\];(),.:]/
};

/* **********************************************
     Begin prism-javascript.js
********************************************** */

Prism.languages.javascript = Prism.languages.extend('clike', {
	'keyword': /\b(as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
	'number': /\b-?(0x[\dA-Fa-f]+|0b[01]+|0o[0-7]+|\d*\.?\d+([Ee][+-]?\d+)?|NaN|Infinity)\b/,
	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
	'function': /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\()/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*\*?|\/|~|\^|%|\.{3}/
});

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
		lookbehind: true,
		greedy: true
	}
});

Prism.languages.insertBefore('javascript', 'string', {
	'template-string': {
		pattern: /`(?:\\\\|\\?[^\\])*?`/,
		greedy: true,
		inside: {
			'interpolation': {
				pattern: /\$\{[^}]+\}/,
				inside: {
					'interpolation-punctuation': {
						pattern: /^\$\{|\}$/,
						alias: 'punctuation'
					},
					rest: Prism.languages.javascript
				}
			},
			'string': /[\s\S]+/
		}
	}
});

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'script': {
			pattern: /(<script[\w\W]*?>)[\w\W]*?(?=<\/script>)/i,
			lookbehind: true,
			inside: Prism.languages.javascript,
			alias: 'language-javascript'
		}
	});
}

Prism.languages.js = Prism.languages.javascript;

/* **********************************************
     Begin prism-file-highlight.js
********************************************** */

(function () {
	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
		return;
	}

	self.Prism.fileHighlight = function () {

		var Extensions = {
			'js': 'javascript',
			'py': 'python',
			'rb': 'ruby',
			'ps1': 'powershell',
			'psm1': 'powershell',
			'sh': 'bash',
			'bat': 'batch',
			'h': 'c',
			'tex': 'latex'
		};

		if (Array.prototype.forEach) {
			// Check to prevent error in IE8
			Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function (pre) {
				var src = pre.getAttribute('data-src');

				var language,
				    parent = pre;
				var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;
				while (parent && !lang.test(parent.className)) {
					parent = parent.parentNode;
				}

				if (parent) {
					language = (pre.className.match(lang) || [, ''])[1];
				}

				if (!language) {
					var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
					language = Extensions[extension] || extension;
				}

				var code = document.createElement('code');
				code.className = 'language-' + language;

				pre.textContent = '';

				code.textContent = 'Loading…';

				pre.appendChild(code);

				var xhr = new XMLHttpRequest();

				xhr.open('GET', src, true);

				xhr.onreadystatechange = function () {
					if (xhr.readyState == 4) {

						if (xhr.status < 400 && xhr.responseText) {
							code.textContent = xhr.responseText;

							Prism.highlightElement(code);
						} else if (xhr.status >= 400) {
							code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
						} else {
							code.textContent = '✖ Error: File does not exist or is empty';
						}
					}
				};

				xhr.send(null);
			});
		}
	};

	document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight);
})();
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout() {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
})();
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }
}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e) {
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e) {
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }
}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while (len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () {
    return '/';
};
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function () {
    return 0;
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global, process) {

(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
        // Callback can either be a function or a string
        if (typeof callback !== "function") {
            callback = new Function("" + callback);
        }
        // Copy function arguments
        var args = new Array(arguments.length - 1);
        for (var i = 0; i < args.length; i++) {
            args[i] = arguments[i + 1];
        }
        // Store and register the task
        var task = { callback: callback, args: args };
        tasksByHandle[nextHandle] = task;
        registerImmediate(nextHandle);
        return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
            case 0:
                callback();
                break;
            case 1:
                callback(args[0]);
                break;
            case 2:
                callback(args[0], args[1]);
                break;
            case 3:
                callback(args[0], args[1], args[2]);
                break;
            default:
                callback.apply(undefined, args);
                break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function registerImmediate(handle) {
            process.nextTick(function () {
                runIfPresent(handle);
            });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function () {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function onGlobalMessage(event) {
            if (event.source === global && typeof event.data === "string" && event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function registerImmediate(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function (event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function registerImmediate(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function registerImmediate(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function registerImmediate(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();
    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();
    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();
    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();
    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
})(typeof self === "undefined" ? typeof global === "undefined" ? undefined : global : self);
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6), __webpack_require__(20)))

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function () {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function () {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout = exports.clearInterval = function (timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function () {};
Timeout.prototype.close = function () {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function (item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function (item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function (item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout) item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(21);
exports.setImmediate = setImmediate;
exports.clearImmediate = clearImmediate;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.fetchy = undefined;

var _ = __webpack_require__(4);

/*
* middleware to log the user out if not authorized
* returns a middleware that sets the token stream value to null if the request is not authenticated
*/
function isAuthenticated(auth$) {
	return function (res) {
		if (res.status === 401) {
			auth$ && auth$(null);
		}
		return res;
	};
}

/*
* TODO
* wrapper for LOADING -> SUCCESS / FAILED actions
* also adds oauth header for a provided oauth-token stream
*/
var fetchy = exports.fetchy = function fetchy(request, extractData, auth$) {
	extractData = extractData || function (a) {
		return a;
	};
	var output$ = (0, _.stream)({
		loading: true,
		error: null,
		data: null
	});

	var options = {
		method: request.method || 'GET',
		headers: Object.assign(auth$ && auth$() ? {
			'Authentication': auth$()
		} : {}, request.headers),
		mode: 'cors',
		cache: request.cache || 'default'
	};

	fetch(request.url, options).then(isAuthenticated(auth$)).then(function (res) {
		return res.json();
	}).then(function (body) {
		output$.patch({
			loading: false,
			data: extractData(body)
		});
	}).catch(function (error) {
		output$.patch({
			loading: false,
			error: error
		});
	});

	return output$;
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(setImmediate) {

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Router = Router;
exports.initRouter = initRouter;

var _ = __webpack_require__(4);

function interceptLinks(routerState$) {
    // intercepts clicks on links
    // if the link is local '/...' we change the location hash instead
    function interceptClickEvent(e) {
        var href;
        var target = e.target || e.srcElement;
        if (target.tagName === 'A') {
            href = target.getAttribute('href');
            var isLocal = href != null && href.startsWith('/');

            //put your logic here...
            if (isLocal) {
                location.hash = href;

                var anchorSearch = RegExp(/[\/\w]+(\?\w+=\w*(&\w+=\w*))?#(\w+)/g).exec(href);
                if (anchorSearch != null && anchorSearch[3] != null) {
                    setImmediate(function () {
                        var anchorElem = document.getElementById(anchorSearch[3]);
                        anchorElem && anchorElem.scrollIntoView();
                    });
                }

                //tell the browser not to respond to the link click
                e.preventDefault();
            }
        }
    }

    // callback for HTML5 navigation events
    // save the routing info in the routerState
    function dispatchRouteChange() {
        // remove hash
        var href = location.hash.substr(1, location.hash.length - 1);

        routerState$.patch({
            route: href === '' ? '/' : href.split('?')[0],
            params: getUrlParams(href)
        });
    }

    // react to HTML5 go back and forward events
    window.onpopstate = function () {
        dispatchRouteChange();
    };

    // listen for link click events at the document level
    document.addEventListener('click', interceptClickEvent);

    // react to initial routing info
    if (location.hash != '') {
        dispatchRouteChange();
    }
}

// src: http://stackoverflow.com/questions/979975/how-to-get-the-value-from-the-get-parameters
function getUrlParams(href) {
    var urlRegex = /\/\w*(\?\w+=.+(&\w+=.+)*)/g;
    if (!urlRegex.test(href)) {
        return {};
    }
    var params = {};
    if (href === '') {
        return params;
    };
    var splitHref = href.split('?');
    if (splitHref.length == 0) {
        return params;
    }
    var query = splitHref[1];
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof params[pair[0]] === "undefined") {
            params[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof params[pair[0]] === "string") {
            var arr = [params[pair[0]], decodeURIComponent(pair[1])];
            params[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            params[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return params;
}

// this is an element that shows it's content only if the expected route is met
function Router(_ref, children) {
    var router$ = _ref.router$,
        route = _ref.route;

    if (router$ == null) {
        console.log('The Router component needs the routerState$ as attribute.');
        return null;
    }
    if (route == null) {
        console.log('The Router component needs the route as attribute.');
        return null;
    }
    // Register the route
    // this is necessary to decide on a default route
    router$.patch({ routes: router$().routes.concat(route) });

    // check if no registered route was hit and set default if so
    var sanitizedRoute$ = router$.map(function (_ref2) {
        var route = _ref2.route,
            routes = _ref2.routes;

        if (routes.indexOf(route) === -1) {
            return '/';
        }
        return route;
    });

    var routeWasHit$ = sanitizedRoute$.map(function (curRoute) {
        return curRoute === route;
    });
    return routeWasHit$.map(function (hitRoute) {
        return hitRoute ? children : [];
    });
}

function initRouter() {
    var routerState$ = (0, _.stream)({
        route: '',
        params: {},
        routes: ['/']
    });

    interceptLinks(routerState$);

    return routerState$;
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(22).setImmediate))

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.h = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _streamy = __webpack_require__(5);

var _streamyDom = __webpack_require__(7);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

/*
* wrap hyperscript elements in reactive streams dependent on their children streams
*/
var h = exports.h = function h(tag, props, children) {
	// jsx usally resolves known tags as strings and unknown tags as functions
	// if it is a sub component, resolve that component
	if (typeof tag === 'function') {
		return tag(props, children);
	}
	return (0, _streamyDom.createElement)(tag, wrapProps$(props), makeChildrenStreams$(children));
};

/*
* wrap all children in streams and merge those
* we make sure that all children streams are flat arrays to make processing uniform 
*/
function makeChildrenStreams$(children) {
	// make sure children is an array
	var childrenArr = !Array.isArray(children) ? [children] : children;
	// wrap all children in streams
	var children$Arr = makeStreams(childrenArr);

	return children$Arr
	// make sure children are arrays and not nest
	.map(function (child$) {
		return flatten(makeArray(child$));
	})
	// make sure subchildren are all streams
	.map(function (child$) {
		return child$.map(function (children) {
			return makeStreams(children);
		});
	})
	// so we can easily merge them
	.map(function (child$) {
		return child$.flatMap(function (children) {
			return _streamy.merge$.apply(undefined, _toConsumableArray(children));
		});
	});
}

// make sure all children are handled as streams
// so we can later easily merge them 
function makeStreams(childrenArr) {
	return childrenArr.map(function (child) {
		if (child === null || !(0, _streamy.isStream)(child)) {
			return (0, _streamy.stream)(child);
		}
		return child;
	});
}

// converts an input into an array
function makeArray(stream) {
	return stream.map(function (value) {
		if (value == null) {
			return [];
		}
		if (!Array.isArray(value)) {
			return [value];
		}
		return value;
	});
}

// flattens an array
function flatten(stream) {
	return stream.map(function (arr) {
		while (arr.some(function (value) {
			return Array.isArray(value);
		})) {
			var _ref;

			arr = (_ref = []).concat.apply(_ref, _toConsumableArray(arr));
		}
		return arr;
	});
}

/*
* Wrap props into one stream
*/
function wrapProps$(props) {
	if (props === null) return (0, _streamy.stream)();
	if ((0, _streamy.isStream)(props)) {
		return props;
	}

	// go through all the props and make them a stream
	// if they are objects, traverse them to check if they include streams	
	var props$Arr = Object.keys(props).map(function (propName, index) {
		var value = props[propName];
		if ((0, _streamy.isStream)(value)) {
			return value.map(function (value) {
				return {
					key: propName,
					value: value
				};
			});
		} else {
			// if it's an object, traverse the sub-object making it a stream
			if (value !== null && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
				return wrapProps$(value).map(function (value) {
					return {
						key: propName,
						value: value
					};
				});
			}
			// if it's a plain value wrap it in a stream
			return (0, _streamy.stream)({
				key: propName,
				value: value
			});
		}
	});
	// merge streams of all properties
	// on changes, reconstruct the properties object from the properties
	return _streamy.merge$.apply(undefined, _toConsumableArray(props$Arr)).map(function (props) {
		return props.reduce(function (obj, _ref2) {
			var key = _ref2.key,
			    value = _ref2.value;

			obj[key] = value;
			return obj;
		}, {});
	});
}

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, ".big-header, img, h3 {\n  transition: all 0.5s; }\n\n.big-header {\n  padding-top: 2rem;\n  cursor: pointer; }\n  .big-header h1 {\n    font-family: 'Rubik Mono One', sans-serif;\n    font-size: 10rem; }\n  .big-header img {\n    height: 17rem; }\n  @media all and (max-width: 569px) {\n    .big-header h1 {\n      font-size: 6rem; }\n    .big-header img {\n      height: 10rem; }\n    .big-header h3 {\n      font-size: 1.8rem; } }\n\n.link-list {\n  padding-top: 2rem;\n  padding-bottom: 1rem; }\n  .link-list a {\n    color: #188C71;\n    padding: 0 1rem;\n    line-height: 2rem;\n    font-weight: bold;\n    display: inline-block; }\n  @media all and (max-width: 569px) {\n    .link-list {\n      display: none; } }\n\n.hidden {\n  position: fixed;\n  z-index: 100;\n  padding: 0;\n  width: 100%; }\n  .hidden * {\n    margin-top: 0;\n    margin-bottom: 0; }\n  .hidden h3, .hidden img {\n    height: 0;\n    overflow: hidden; }\n  .hidden + .container {\n    padding-top: 37rem; }\n    @media all and (max-width: 569px) {\n      .hidden + .container {\n        padding-top: 30rem; } }\n  .hidden.big-header h1 {\n    font-size: 4rem; }\n  .hidden .link-list {\n    padding-top: 0.5rem;\n    padding-bottom: 0.5rem; }\n", ""]);

// exports


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "iframe {\n  height: 270px; }\n", ""]);

// exports


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "body {\n  margin-bottom: 4rem; }\n\n.anchor {\n  visibility: hidden;\n  position: relative;\n  top: -8rem; }\n\n.highlight {\n  color: #07684F !important; }\n\n.highlight-less {\n  color: #188C71 !important; }\n\n.highlight-background {\n  background-color: #FBD9BC !important; }\n\n.caption {\n  margin-bottom: 10px; }\n\npre {\n  padding-top: 2rem !important;\n  background-color: initial !important;\n  border-color: #FBD9BC; }\n  pre:before {\n    background: #FBD9BC !important;\n    color: #07684F !important; }\n", ""]);

// exports


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, ".materialize-red {\n  background-color: #e51c23 !important; }\n\n.materialize-red-text {\n  color: #e51c23 !important; }\n\n.materialize-red.lighten-5 {\n  background-color: #fdeaeb !important; }\n\n.materialize-red-text.text-lighten-5 {\n  color: #fdeaeb !important; }\n\n.materialize-red.lighten-4 {\n  background-color: #f8c1c3 !important; }\n\n.materialize-red-text.text-lighten-4 {\n  color: #f8c1c3 !important; }\n\n.materialize-red.lighten-3 {\n  background-color: #f3989b !important; }\n\n.materialize-red-text.text-lighten-3 {\n  color: #f3989b !important; }\n\n.materialize-red.lighten-2 {\n  background-color: #ee6e73 !important; }\n\n.materialize-red-text.text-lighten-2 {\n  color: #ee6e73 !important; }\n\n.materialize-red.lighten-1 {\n  background-color: #ea454b !important; }\n\n.materialize-red-text.text-lighten-1 {\n  color: #ea454b !important; }\n\n.materialize-red.darken-1 {\n  background-color: #d0181e !important; }\n\n.materialize-red-text.text-darken-1 {\n  color: #d0181e !important; }\n\n.materialize-red.darken-2 {\n  background-color: #b9151b !important; }\n\n.materialize-red-text.text-darken-2 {\n  color: #b9151b !important; }\n\n.materialize-red.darken-3 {\n  background-color: #a21318 !important; }\n\n.materialize-red-text.text-darken-3 {\n  color: #a21318 !important; }\n\n.materialize-red.darken-4 {\n  background-color: #8b1014 !important; }\n\n.materialize-red-text.text-darken-4 {\n  color: #8b1014 !important; }\n\n.red {\n  background-color: #F44336 !important; }\n\n.red-text {\n  color: #F44336 !important; }\n\n.red.lighten-5 {\n  background-color: #FFEBEE !important; }\n\n.red-text.text-lighten-5 {\n  color: #FFEBEE !important; }\n\n.red.lighten-4 {\n  background-color: #FFCDD2 !important; }\n\n.red-text.text-lighten-4 {\n  color: #FFCDD2 !important; }\n\n.red.lighten-3 {\n  background-color: #EF9A9A !important; }\n\n.red-text.text-lighten-3 {\n  color: #EF9A9A !important; }\n\n.red.lighten-2 {\n  background-color: #E57373 !important; }\n\n.red-text.text-lighten-2 {\n  color: #E57373 !important; }\n\n.red.lighten-1 {\n  background-color: #EF5350 !important; }\n\n.red-text.text-lighten-1 {\n  color: #EF5350 !important; }\n\n.red.darken-1 {\n  background-color: #E53935 !important; }\n\n.red-text.text-darken-1 {\n  color: #E53935 !important; }\n\n.red.darken-2 {\n  background-color: #D32F2F !important; }\n\n.red-text.text-darken-2 {\n  color: #D32F2F !important; }\n\n.red.darken-3 {\n  background-color: #C62828 !important; }\n\n.red-text.text-darken-3 {\n  color: #C62828 !important; }\n\n.red.darken-4 {\n  background-color: #B71C1C !important; }\n\n.red-text.text-darken-4 {\n  color: #B71C1C !important; }\n\n.red.accent-1 {\n  background-color: #FF8A80 !important; }\n\n.red-text.text-accent-1 {\n  color: #FF8A80 !important; }\n\n.red.accent-2 {\n  background-color: #FF5252 !important; }\n\n.red-text.text-accent-2 {\n  color: #FF5252 !important; }\n\n.red.accent-3 {\n  background-color: #FF1744 !important; }\n\n.red-text.text-accent-3 {\n  color: #FF1744 !important; }\n\n.red.accent-4 {\n  background-color: #D50000 !important; }\n\n.red-text.text-accent-4 {\n  color: #D50000 !important; }\n\n.pink {\n  background-color: #e91e63 !important; }\n\n.pink-text {\n  color: #e91e63 !important; }\n\n.pink.lighten-5 {\n  background-color: #fce4ec !important; }\n\n.pink-text.text-lighten-5 {\n  color: #fce4ec !important; }\n\n.pink.lighten-4 {\n  background-color: #f8bbd0 !important; }\n\n.pink-text.text-lighten-4 {\n  color: #f8bbd0 !important; }\n\n.pink.lighten-3 {\n  background-color: #f48fb1 !important; }\n\n.pink-text.text-lighten-3 {\n  color: #f48fb1 !important; }\n\n.pink.lighten-2 {\n  background-color: #f06292 !important; }\n\n.pink-text.text-lighten-2 {\n  color: #f06292 !important; }\n\n.pink.lighten-1 {\n  background-color: #ec407a !important; }\n\n.pink-text.text-lighten-1 {\n  color: #ec407a !important; }\n\n.pink.darken-1 {\n  background-color: #d81b60 !important; }\n\n.pink-text.text-darken-1 {\n  color: #d81b60 !important; }\n\n.pink.darken-2 {\n  background-color: #c2185b !important; }\n\n.pink-text.text-darken-2 {\n  color: #c2185b !important; }\n\n.pink.darken-3 {\n  background-color: #ad1457 !important; }\n\n.pink-text.text-darken-3 {\n  color: #ad1457 !important; }\n\n.pink.darken-4 {\n  background-color: #880e4f !important; }\n\n.pink-text.text-darken-4 {\n  color: #880e4f !important; }\n\n.pink.accent-1 {\n  background-color: #ff80ab !important; }\n\n.pink-text.text-accent-1 {\n  color: #ff80ab !important; }\n\n.pink.accent-2 {\n  background-color: #ff4081 !important; }\n\n.pink-text.text-accent-2 {\n  color: #ff4081 !important; }\n\n.pink.accent-3 {\n  background-color: #f50057 !important; }\n\n.pink-text.text-accent-3 {\n  color: #f50057 !important; }\n\n.pink.accent-4 {\n  background-color: #c51162 !important; }\n\n.pink-text.text-accent-4 {\n  color: #c51162 !important; }\n\n.purple {\n  background-color: #9c27b0 !important; }\n\n.purple-text {\n  color: #9c27b0 !important; }\n\n.purple.lighten-5 {\n  background-color: #f3e5f5 !important; }\n\n.purple-text.text-lighten-5 {\n  color: #f3e5f5 !important; }\n\n.purple.lighten-4 {\n  background-color: #e1bee7 !important; }\n\n.purple-text.text-lighten-4 {\n  color: #e1bee7 !important; }\n\n.purple.lighten-3 {\n  background-color: #ce93d8 !important; }\n\n.purple-text.text-lighten-3 {\n  color: #ce93d8 !important; }\n\n.purple.lighten-2 {\n  background-color: #ba68c8 !important; }\n\n.purple-text.text-lighten-2 {\n  color: #ba68c8 !important; }\n\n.purple.lighten-1 {\n  background-color: #ab47bc !important; }\n\n.purple-text.text-lighten-1 {\n  color: #ab47bc !important; }\n\n.purple.darken-1 {\n  background-color: #8e24aa !important; }\n\n.purple-text.text-darken-1 {\n  color: #8e24aa !important; }\n\n.purple.darken-2 {\n  background-color: #7b1fa2 !important; }\n\n.purple-text.text-darken-2 {\n  color: #7b1fa2 !important; }\n\n.purple.darken-3 {\n  background-color: #6a1b9a !important; }\n\n.purple-text.text-darken-3 {\n  color: #6a1b9a !important; }\n\n.purple.darken-4 {\n  background-color: #4a148c !important; }\n\n.purple-text.text-darken-4 {\n  color: #4a148c !important; }\n\n.purple.accent-1 {\n  background-color: #ea80fc !important; }\n\n.purple-text.text-accent-1 {\n  color: #ea80fc !important; }\n\n.purple.accent-2 {\n  background-color: #e040fb !important; }\n\n.purple-text.text-accent-2 {\n  color: #e040fb !important; }\n\n.purple.accent-3 {\n  background-color: #d500f9 !important; }\n\n.purple-text.text-accent-3 {\n  color: #d500f9 !important; }\n\n.purple.accent-4 {\n  background-color: #a0f !important; }\n\n.purple-text.text-accent-4 {\n  color: #a0f !important; }\n\n.deep-purple {\n  background-color: #673ab7 !important; }\n\n.deep-purple-text {\n  color: #673ab7 !important; }\n\n.deep-purple.lighten-5 {\n  background-color: #ede7f6 !important; }\n\n.deep-purple-text.text-lighten-5 {\n  color: #ede7f6 !important; }\n\n.deep-purple.lighten-4 {\n  background-color: #d1c4e9 !important; }\n\n.deep-purple-text.text-lighten-4 {\n  color: #d1c4e9 !important; }\n\n.deep-purple.lighten-3 {\n  background-color: #b39ddb !important; }\n\n.deep-purple-text.text-lighten-3 {\n  color: #b39ddb !important; }\n\n.deep-purple.lighten-2 {\n  background-color: #9575cd !important; }\n\n.deep-purple-text.text-lighten-2 {\n  color: #9575cd !important; }\n\n.deep-purple.lighten-1 {\n  background-color: #7e57c2 !important; }\n\n.deep-purple-text.text-lighten-1 {\n  color: #7e57c2 !important; }\n\n.deep-purple.darken-1 {\n  background-color: #5e35b1 !important; }\n\n.deep-purple-text.text-darken-1 {\n  color: #5e35b1 !important; }\n\n.deep-purple.darken-2 {\n  background-color: #512da8 !important; }\n\n.deep-purple-text.text-darken-2 {\n  color: #512da8 !important; }\n\n.deep-purple.darken-3 {\n  background-color: #4527a0 !important; }\n\n.deep-purple-text.text-darken-3 {\n  color: #4527a0 !important; }\n\n.deep-purple.darken-4 {\n  background-color: #311b92 !important; }\n\n.deep-purple-text.text-darken-4 {\n  color: #311b92 !important; }\n\n.deep-purple.accent-1 {\n  background-color: #b388ff !important; }\n\n.deep-purple-text.text-accent-1 {\n  color: #b388ff !important; }\n\n.deep-purple.accent-2 {\n  background-color: #7c4dff !important; }\n\n.deep-purple-text.text-accent-2 {\n  color: #7c4dff !important; }\n\n.deep-purple.accent-3 {\n  background-color: #651fff !important; }\n\n.deep-purple-text.text-accent-3 {\n  color: #651fff !important; }\n\n.deep-purple.accent-4 {\n  background-color: #6200ea !important; }\n\n.deep-purple-text.text-accent-4 {\n  color: #6200ea !important; }\n\n.indigo {\n  background-color: #3f51b5 !important; }\n\n.indigo-text {\n  color: #3f51b5 !important; }\n\n.indigo.lighten-5 {\n  background-color: #e8eaf6 !important; }\n\n.indigo-text.text-lighten-5 {\n  color: #e8eaf6 !important; }\n\n.indigo.lighten-4 {\n  background-color: #c5cae9 !important; }\n\n.indigo-text.text-lighten-4 {\n  color: #c5cae9 !important; }\n\n.indigo.lighten-3 {\n  background-color: #9fa8da !important; }\n\n.indigo-text.text-lighten-3 {\n  color: #9fa8da !important; }\n\n.indigo.lighten-2 {\n  background-color: #7986cb !important; }\n\n.indigo-text.text-lighten-2 {\n  color: #7986cb !important; }\n\n.indigo.lighten-1 {\n  background-color: #5c6bc0 !important; }\n\n.indigo-text.text-lighten-1 {\n  color: #5c6bc0 !important; }\n\n.indigo.darken-1 {\n  background-color: #3949ab !important; }\n\n.indigo-text.text-darken-1 {\n  color: #3949ab !important; }\n\n.indigo.darken-2 {\n  background-color: #303f9f !important; }\n\n.indigo-text.text-darken-2 {\n  color: #303f9f !important; }\n\n.indigo.darken-3 {\n  background-color: #283593 !important; }\n\n.indigo-text.text-darken-3 {\n  color: #283593 !important; }\n\n.indigo.darken-4 {\n  background-color: #1a237e !important; }\n\n.indigo-text.text-darken-4 {\n  color: #1a237e !important; }\n\n.indigo.accent-1 {\n  background-color: #8c9eff !important; }\n\n.indigo-text.text-accent-1 {\n  color: #8c9eff !important; }\n\n.indigo.accent-2 {\n  background-color: #536dfe !important; }\n\n.indigo-text.text-accent-2 {\n  color: #536dfe !important; }\n\n.indigo.accent-3 {\n  background-color: #3d5afe !important; }\n\n.indigo-text.text-accent-3 {\n  color: #3d5afe !important; }\n\n.indigo.accent-4 {\n  background-color: #304ffe !important; }\n\n.indigo-text.text-accent-4 {\n  color: #304ffe !important; }\n\n.blue {\n  background-color: #2196F3 !important; }\n\n.blue-text {\n  color: #2196F3 !important; }\n\n.blue.lighten-5 {\n  background-color: #E3F2FD !important; }\n\n.blue-text.text-lighten-5 {\n  color: #E3F2FD !important; }\n\n.blue.lighten-4 {\n  background-color: #BBDEFB !important; }\n\n.blue-text.text-lighten-4 {\n  color: #BBDEFB !important; }\n\n.blue.lighten-3 {\n  background-color: #90CAF9 !important; }\n\n.blue-text.text-lighten-3 {\n  color: #90CAF9 !important; }\n\n.blue.lighten-2 {\n  background-color: #64B5F6 !important; }\n\n.blue-text.text-lighten-2 {\n  color: #64B5F6 !important; }\n\n.blue.lighten-1 {\n  background-color: #42A5F5 !important; }\n\n.blue-text.text-lighten-1 {\n  color: #42A5F5 !important; }\n\n.blue.darken-1 {\n  background-color: #1E88E5 !important; }\n\n.blue-text.text-darken-1 {\n  color: #1E88E5 !important; }\n\n.blue.darken-2 {\n  background-color: #1976D2 !important; }\n\n.blue-text.text-darken-2 {\n  color: #1976D2 !important; }\n\n.blue.darken-3 {\n  background-color: #1565C0 !important; }\n\n.blue-text.text-darken-3 {\n  color: #1565C0 !important; }\n\n.blue.darken-4 {\n  background-color: #0D47A1 !important; }\n\n.blue-text.text-darken-4 {\n  color: #0D47A1 !important; }\n\n.blue.accent-1 {\n  background-color: #82B1FF !important; }\n\n.blue-text.text-accent-1 {\n  color: #82B1FF !important; }\n\n.blue.accent-2 {\n  background-color: #448AFF !important; }\n\n.blue-text.text-accent-2 {\n  color: #448AFF !important; }\n\n.blue.accent-3 {\n  background-color: #2979FF !important; }\n\n.blue-text.text-accent-3 {\n  color: #2979FF !important; }\n\n.blue.accent-4 {\n  background-color: #2962FF !important; }\n\n.blue-text.text-accent-4 {\n  color: #2962FF !important; }\n\n.light-blue {\n  background-color: #03a9f4 !important; }\n\n.light-blue-text {\n  color: #03a9f4 !important; }\n\n.light-blue.lighten-5 {\n  background-color: #e1f5fe !important; }\n\n.light-blue-text.text-lighten-5 {\n  color: #e1f5fe !important; }\n\n.light-blue.lighten-4 {\n  background-color: #b3e5fc !important; }\n\n.light-blue-text.text-lighten-4 {\n  color: #b3e5fc !important; }\n\n.light-blue.lighten-3 {\n  background-color: #81d4fa !important; }\n\n.light-blue-text.text-lighten-3 {\n  color: #81d4fa !important; }\n\n.light-blue.lighten-2 {\n  background-color: #4fc3f7 !important; }\n\n.light-blue-text.text-lighten-2 {\n  color: #4fc3f7 !important; }\n\n.light-blue.lighten-1 {\n  background-color: #29b6f6 !important; }\n\n.light-blue-text.text-lighten-1 {\n  color: #29b6f6 !important; }\n\n.light-blue.darken-1 {\n  background-color: #039be5 !important; }\n\n.light-blue-text.text-darken-1 {\n  color: #039be5 !important; }\n\n.light-blue.darken-2 {\n  background-color: #0288d1 !important; }\n\n.light-blue-text.text-darken-2 {\n  color: #0288d1 !important; }\n\n.light-blue.darken-3 {\n  background-color: #0277bd !important; }\n\n.light-blue-text.text-darken-3 {\n  color: #0277bd !important; }\n\n.light-blue.darken-4 {\n  background-color: #01579b !important; }\n\n.light-blue-text.text-darken-4 {\n  color: #01579b !important; }\n\n.light-blue.accent-1 {\n  background-color: #80d8ff !important; }\n\n.light-blue-text.text-accent-1 {\n  color: #80d8ff !important; }\n\n.light-blue.accent-2 {\n  background-color: #40c4ff !important; }\n\n.light-blue-text.text-accent-2 {\n  color: #40c4ff !important; }\n\n.light-blue.accent-3 {\n  background-color: #00b0ff !important; }\n\n.light-blue-text.text-accent-3 {\n  color: #00b0ff !important; }\n\n.light-blue.accent-4 {\n  background-color: #0091ea !important; }\n\n.light-blue-text.text-accent-4 {\n  color: #0091ea !important; }\n\n.cyan {\n  background-color: #00bcd4 !important; }\n\n.cyan-text {\n  color: #00bcd4 !important; }\n\n.cyan.lighten-5 {\n  background-color: #e0f7fa !important; }\n\n.cyan-text.text-lighten-5 {\n  color: #e0f7fa !important; }\n\n.cyan.lighten-4 {\n  background-color: #b2ebf2 !important; }\n\n.cyan-text.text-lighten-4 {\n  color: #b2ebf2 !important; }\n\n.cyan.lighten-3 {\n  background-color: #80deea !important; }\n\n.cyan-text.text-lighten-3 {\n  color: #80deea !important; }\n\n.cyan.lighten-2 {\n  background-color: #4dd0e1 !important; }\n\n.cyan-text.text-lighten-2 {\n  color: #4dd0e1 !important; }\n\n.cyan.lighten-1 {\n  background-color: #26c6da !important; }\n\n.cyan-text.text-lighten-1 {\n  color: #26c6da !important; }\n\n.cyan.darken-1 {\n  background-color: #00acc1 !important; }\n\n.cyan-text.text-darken-1 {\n  color: #00acc1 !important; }\n\n.cyan.darken-2 {\n  background-color: #0097a7 !important; }\n\n.cyan-text.text-darken-2 {\n  color: #0097a7 !important; }\n\n.cyan.darken-3 {\n  background-color: #00838f !important; }\n\n.cyan-text.text-darken-3 {\n  color: #00838f !important; }\n\n.cyan.darken-4 {\n  background-color: #006064 !important; }\n\n.cyan-text.text-darken-4 {\n  color: #006064 !important; }\n\n.cyan.accent-1 {\n  background-color: #84ffff !important; }\n\n.cyan-text.text-accent-1 {\n  color: #84ffff !important; }\n\n.cyan.accent-2 {\n  background-color: #18ffff !important; }\n\n.cyan-text.text-accent-2 {\n  color: #18ffff !important; }\n\n.cyan.accent-3 {\n  background-color: #00e5ff !important; }\n\n.cyan-text.text-accent-3 {\n  color: #00e5ff !important; }\n\n.cyan.accent-4 {\n  background-color: #00b8d4 !important; }\n\n.cyan-text.text-accent-4 {\n  color: #00b8d4 !important; }\n\n.teal {\n  background-color: #009688 !important; }\n\n.teal-text {\n  color: #009688 !important; }\n\n.teal.lighten-5 {\n  background-color: #e0f2f1 !important; }\n\n.teal-text.text-lighten-5 {\n  color: #e0f2f1 !important; }\n\n.teal.lighten-4 {\n  background-color: #b2dfdb !important; }\n\n.teal-text.text-lighten-4 {\n  color: #b2dfdb !important; }\n\n.teal.lighten-3 {\n  background-color: #80cbc4 !important; }\n\n.teal-text.text-lighten-3 {\n  color: #80cbc4 !important; }\n\n.teal.lighten-2 {\n  background-color: #4db6ac !important; }\n\n.teal-text.text-lighten-2 {\n  color: #4db6ac !important; }\n\n.teal.lighten-1 {\n  background-color: #26a69a !important; }\n\n.teal-text.text-lighten-1 {\n  color: #26a69a !important; }\n\n.teal.darken-1 {\n  background-color: #00897b !important; }\n\n.teal-text.text-darken-1 {\n  color: #00897b !important; }\n\n.teal.darken-2 {\n  background-color: #00796b !important; }\n\n.teal-text.text-darken-2 {\n  color: #00796b !important; }\n\n.teal.darken-3 {\n  background-color: #00695c !important; }\n\n.teal-text.text-darken-3 {\n  color: #00695c !important; }\n\n.teal.darken-4 {\n  background-color: #004d40 !important; }\n\n.teal-text.text-darken-4 {\n  color: #004d40 !important; }\n\n.teal.accent-1 {\n  background-color: #a7ffeb !important; }\n\n.teal-text.text-accent-1 {\n  color: #a7ffeb !important; }\n\n.teal.accent-2 {\n  background-color: #64ffda !important; }\n\n.teal-text.text-accent-2 {\n  color: #64ffda !important; }\n\n.teal.accent-3 {\n  background-color: #1de9b6 !important; }\n\n.teal-text.text-accent-3 {\n  color: #1de9b6 !important; }\n\n.teal.accent-4 {\n  background-color: #00bfa5 !important; }\n\n.teal-text.text-accent-4 {\n  color: #00bfa5 !important; }\n\n.green {\n  background-color: #4CAF50 !important; }\n\n.green-text {\n  color: #4CAF50 !important; }\n\n.green.lighten-5 {\n  background-color: #E8F5E9 !important; }\n\n.green-text.text-lighten-5 {\n  color: #E8F5E9 !important; }\n\n.green.lighten-4 {\n  background-color: #C8E6C9 !important; }\n\n.green-text.text-lighten-4 {\n  color: #C8E6C9 !important; }\n\n.green.lighten-3 {\n  background-color: #A5D6A7 !important; }\n\n.green-text.text-lighten-3 {\n  color: #A5D6A7 !important; }\n\n.green.lighten-2 {\n  background-color: #81C784 !important; }\n\n.green-text.text-lighten-2 {\n  color: #81C784 !important; }\n\n.green.lighten-1 {\n  background-color: #66BB6A !important; }\n\n.green-text.text-lighten-1 {\n  color: #66BB6A !important; }\n\n.green.darken-1 {\n  background-color: #43A047 !important; }\n\n.green-text.text-darken-1 {\n  color: #43A047 !important; }\n\n.green.darken-2 {\n  background-color: #388E3C !important; }\n\n.green-text.text-darken-2 {\n  color: #388E3C !important; }\n\n.green.darken-3 {\n  background-color: #2E7D32 !important; }\n\n.green-text.text-darken-3 {\n  color: #2E7D32 !important; }\n\n.green.darken-4 {\n  background-color: #1B5E20 !important; }\n\n.green-text.text-darken-4 {\n  color: #1B5E20 !important; }\n\n.green.accent-1 {\n  background-color: #B9F6CA !important; }\n\n.green-text.text-accent-1 {\n  color: #B9F6CA !important; }\n\n.green.accent-2 {\n  background-color: #69F0AE !important; }\n\n.green-text.text-accent-2 {\n  color: #69F0AE !important; }\n\n.green.accent-3 {\n  background-color: #00E676 !important; }\n\n.green-text.text-accent-3 {\n  color: #00E676 !important; }\n\n.green.accent-4 {\n  background-color: #00C853 !important; }\n\n.green-text.text-accent-4 {\n  color: #00C853 !important; }\n\n.light-green {\n  background-color: #8bc34a !important; }\n\n.light-green-text {\n  color: #8bc34a !important; }\n\n.light-green.lighten-5 {\n  background-color: #f1f8e9 !important; }\n\n.light-green-text.text-lighten-5 {\n  color: #f1f8e9 !important; }\n\n.light-green.lighten-4 {\n  background-color: #dcedc8 !important; }\n\n.light-green-text.text-lighten-4 {\n  color: #dcedc8 !important; }\n\n.light-green.lighten-3 {\n  background-color: #c5e1a5 !important; }\n\n.light-green-text.text-lighten-3 {\n  color: #c5e1a5 !important; }\n\n.light-green.lighten-2 {\n  background-color: #aed581 !important; }\n\n.light-green-text.text-lighten-2 {\n  color: #aed581 !important; }\n\n.light-green.lighten-1 {\n  background-color: #9ccc65 !important; }\n\n.light-green-text.text-lighten-1 {\n  color: #9ccc65 !important; }\n\n.light-green.darken-1 {\n  background-color: #7cb342 !important; }\n\n.light-green-text.text-darken-1 {\n  color: #7cb342 !important; }\n\n.light-green.darken-2 {\n  background-color: #689f38 !important; }\n\n.light-green-text.text-darken-2 {\n  color: #689f38 !important; }\n\n.light-green.darken-3 {\n  background-color: #558b2f !important; }\n\n.light-green-text.text-darken-3 {\n  color: #558b2f !important; }\n\n.light-green.darken-4 {\n  background-color: #33691e !important; }\n\n.light-green-text.text-darken-4 {\n  color: #33691e !important; }\n\n.light-green.accent-1 {\n  background-color: #ccff90 !important; }\n\n.light-green-text.text-accent-1 {\n  color: #ccff90 !important; }\n\n.light-green.accent-2 {\n  background-color: #b2ff59 !important; }\n\n.light-green-text.text-accent-2 {\n  color: #b2ff59 !important; }\n\n.light-green.accent-3 {\n  background-color: #76ff03 !important; }\n\n.light-green-text.text-accent-3 {\n  color: #76ff03 !important; }\n\n.light-green.accent-4 {\n  background-color: #64dd17 !important; }\n\n.light-green-text.text-accent-4 {\n  color: #64dd17 !important; }\n\n.lime {\n  background-color: #cddc39 !important; }\n\n.lime-text {\n  color: #cddc39 !important; }\n\n.lime.lighten-5 {\n  background-color: #f9fbe7 !important; }\n\n.lime-text.text-lighten-5 {\n  color: #f9fbe7 !important; }\n\n.lime.lighten-4 {\n  background-color: #f0f4c3 !important; }\n\n.lime-text.text-lighten-4 {\n  color: #f0f4c3 !important; }\n\n.lime.lighten-3 {\n  background-color: #e6ee9c !important; }\n\n.lime-text.text-lighten-3 {\n  color: #e6ee9c !important; }\n\n.lime.lighten-2 {\n  background-color: #dce775 !important; }\n\n.lime-text.text-lighten-2 {\n  color: #dce775 !important; }\n\n.lime.lighten-1 {\n  background-color: #d4e157 !important; }\n\n.lime-text.text-lighten-1 {\n  color: #d4e157 !important; }\n\n.lime.darken-1 {\n  background-color: #c0ca33 !important; }\n\n.lime-text.text-darken-1 {\n  color: #c0ca33 !important; }\n\n.lime.darken-2 {\n  background-color: #afb42b !important; }\n\n.lime-text.text-darken-2 {\n  color: #afb42b !important; }\n\n.lime.darken-3 {\n  background-color: #9e9d24 !important; }\n\n.lime-text.text-darken-3 {\n  color: #9e9d24 !important; }\n\n.lime.darken-4 {\n  background-color: #827717 !important; }\n\n.lime-text.text-darken-4 {\n  color: #827717 !important; }\n\n.lime.accent-1 {\n  background-color: #f4ff81 !important; }\n\n.lime-text.text-accent-1 {\n  color: #f4ff81 !important; }\n\n.lime.accent-2 {\n  background-color: #eeff41 !important; }\n\n.lime-text.text-accent-2 {\n  color: #eeff41 !important; }\n\n.lime.accent-3 {\n  background-color: #c6ff00 !important; }\n\n.lime-text.text-accent-3 {\n  color: #c6ff00 !important; }\n\n.lime.accent-4 {\n  background-color: #aeea00 !important; }\n\n.lime-text.text-accent-4 {\n  color: #aeea00 !important; }\n\n.yellow {\n  background-color: #ffeb3b !important; }\n\n.yellow-text {\n  color: #ffeb3b !important; }\n\n.yellow.lighten-5 {\n  background-color: #fffde7 !important; }\n\n.yellow-text.text-lighten-5 {\n  color: #fffde7 !important; }\n\n.yellow.lighten-4 {\n  background-color: #fff9c4 !important; }\n\n.yellow-text.text-lighten-4 {\n  color: #fff9c4 !important; }\n\n.yellow.lighten-3 {\n  background-color: #fff59d !important; }\n\n.yellow-text.text-lighten-3 {\n  color: #fff59d !important; }\n\n.yellow.lighten-2 {\n  background-color: #fff176 !important; }\n\n.yellow-text.text-lighten-2 {\n  color: #fff176 !important; }\n\n.yellow.lighten-1 {\n  background-color: #ffee58 !important; }\n\n.yellow-text.text-lighten-1 {\n  color: #ffee58 !important; }\n\n.yellow.darken-1 {\n  background-color: #fdd835 !important; }\n\n.yellow-text.text-darken-1 {\n  color: #fdd835 !important; }\n\n.yellow.darken-2 {\n  background-color: #fbc02d !important; }\n\n.yellow-text.text-darken-2 {\n  color: #fbc02d !important; }\n\n.yellow.darken-3 {\n  background-color: #f9a825 !important; }\n\n.yellow-text.text-darken-3 {\n  color: #f9a825 !important; }\n\n.yellow.darken-4 {\n  background-color: #f57f17 !important; }\n\n.yellow-text.text-darken-4 {\n  color: #f57f17 !important; }\n\n.yellow.accent-1 {\n  background-color: #ffff8d !important; }\n\n.yellow-text.text-accent-1 {\n  color: #ffff8d !important; }\n\n.yellow.accent-2 {\n  background-color: #ff0 !important; }\n\n.yellow-text.text-accent-2 {\n  color: #ff0 !important; }\n\n.yellow.accent-3 {\n  background-color: #ffea00 !important; }\n\n.yellow-text.text-accent-3 {\n  color: #ffea00 !important; }\n\n.yellow.accent-4 {\n  background-color: #ffd600 !important; }\n\n.yellow-text.text-accent-4 {\n  color: #ffd600 !important; }\n\n.amber {\n  background-color: #ffc107 !important; }\n\n.amber-text {\n  color: #ffc107 !important; }\n\n.amber.lighten-5 {\n  background-color: #fff8e1 !important; }\n\n.amber-text.text-lighten-5 {\n  color: #fff8e1 !important; }\n\n.amber.lighten-4 {\n  background-color: #ffecb3 !important; }\n\n.amber-text.text-lighten-4 {\n  color: #ffecb3 !important; }\n\n.amber.lighten-3 {\n  background-color: #ffe082 !important; }\n\n.amber-text.text-lighten-3 {\n  color: #ffe082 !important; }\n\n.amber.lighten-2 {\n  background-color: #ffd54f !important; }\n\n.amber-text.text-lighten-2 {\n  color: #ffd54f !important; }\n\n.amber.lighten-1 {\n  background-color: #ffca28 !important; }\n\n.amber-text.text-lighten-1 {\n  color: #ffca28 !important; }\n\n.amber.darken-1 {\n  background-color: #ffb300 !important; }\n\n.amber-text.text-darken-1 {\n  color: #ffb300 !important; }\n\n.amber.darken-2 {\n  background-color: #ffa000 !important; }\n\n.amber-text.text-darken-2 {\n  color: #ffa000 !important; }\n\n.amber.darken-3 {\n  background-color: #ff8f00 !important; }\n\n.amber-text.text-darken-3 {\n  color: #ff8f00 !important; }\n\n.amber.darken-4 {\n  background-color: #ff6f00 !important; }\n\n.amber-text.text-darken-4 {\n  color: #ff6f00 !important; }\n\n.amber.accent-1 {\n  background-color: #ffe57f !important; }\n\n.amber-text.text-accent-1 {\n  color: #ffe57f !important; }\n\n.amber.accent-2 {\n  background-color: #ffd740 !important; }\n\n.amber-text.text-accent-2 {\n  color: #ffd740 !important; }\n\n.amber.accent-3 {\n  background-color: #ffc400 !important; }\n\n.amber-text.text-accent-3 {\n  color: #ffc400 !important; }\n\n.amber.accent-4 {\n  background-color: #ffab00 !important; }\n\n.amber-text.text-accent-4 {\n  color: #ffab00 !important; }\n\n.orange {\n  background-color: #ff9800 !important; }\n\n.orange-text {\n  color: #ff9800 !important; }\n\n.orange.lighten-5 {\n  background-color: #fff3e0 !important; }\n\n.orange-text.text-lighten-5 {\n  color: #fff3e0 !important; }\n\n.orange.lighten-4 {\n  background-color: #ffe0b2 !important; }\n\n.orange-text.text-lighten-4 {\n  color: #ffe0b2 !important; }\n\n.orange.lighten-3 {\n  background-color: #ffcc80 !important; }\n\n.orange-text.text-lighten-3 {\n  color: #ffcc80 !important; }\n\n.orange.lighten-2 {\n  background-color: #ffb74d !important; }\n\n.orange-text.text-lighten-2 {\n  color: #ffb74d !important; }\n\n.orange.lighten-1 {\n  background-color: #ffa726 !important; }\n\n.orange-text.text-lighten-1 {\n  color: #ffa726 !important; }\n\n.orange.darken-1 {\n  background-color: #fb8c00 !important; }\n\n.orange-text.text-darken-1 {\n  color: #fb8c00 !important; }\n\n.orange.darken-2 {\n  background-color: #f57c00 !important; }\n\n.orange-text.text-darken-2 {\n  color: #f57c00 !important; }\n\n.orange.darken-3 {\n  background-color: #ef6c00 !important; }\n\n.orange-text.text-darken-3 {\n  color: #ef6c00 !important; }\n\n.orange.darken-4 {\n  background-color: #e65100 !important; }\n\n.orange-text.text-darken-4 {\n  color: #e65100 !important; }\n\n.orange.accent-1 {\n  background-color: #ffd180 !important; }\n\n.orange-text.text-accent-1 {\n  color: #ffd180 !important; }\n\n.orange.accent-2 {\n  background-color: #ffab40 !important; }\n\n.orange-text.text-accent-2 {\n  color: #ffab40 !important; }\n\n.orange.accent-3 {\n  background-color: #ff9100 !important; }\n\n.orange-text.text-accent-3 {\n  color: #ff9100 !important; }\n\n.orange.accent-4 {\n  background-color: #ff6d00 !important; }\n\n.orange-text.text-accent-4 {\n  color: #ff6d00 !important; }\n\n.deep-orange {\n  background-color: #ff5722 !important; }\n\n.deep-orange-text {\n  color: #ff5722 !important; }\n\n.deep-orange.lighten-5 {\n  background-color: #fbe9e7 !important; }\n\n.deep-orange-text.text-lighten-5 {\n  color: #fbe9e7 !important; }\n\n.deep-orange.lighten-4 {\n  background-color: #ffccbc !important; }\n\n.deep-orange-text.text-lighten-4 {\n  color: #ffccbc !important; }\n\n.deep-orange.lighten-3 {\n  background-color: #ffab91 !important; }\n\n.deep-orange-text.text-lighten-3 {\n  color: #ffab91 !important; }\n\n.deep-orange.lighten-2 {\n  background-color: #ff8a65 !important; }\n\n.deep-orange-text.text-lighten-2 {\n  color: #ff8a65 !important; }\n\n.deep-orange.lighten-1 {\n  background-color: #ff7043 !important; }\n\n.deep-orange-text.text-lighten-1 {\n  color: #ff7043 !important; }\n\n.deep-orange.darken-1 {\n  background-color: #f4511e !important; }\n\n.deep-orange-text.text-darken-1 {\n  color: #f4511e !important; }\n\n.deep-orange.darken-2 {\n  background-color: #e64a19 !important; }\n\n.deep-orange-text.text-darken-2 {\n  color: #e64a19 !important; }\n\n.deep-orange.darken-3 {\n  background-color: #d84315 !important; }\n\n.deep-orange-text.text-darken-3 {\n  color: #d84315 !important; }\n\n.deep-orange.darken-4 {\n  background-color: #bf360c !important; }\n\n.deep-orange-text.text-darken-4 {\n  color: #bf360c !important; }\n\n.deep-orange.accent-1 {\n  background-color: #ff9e80 !important; }\n\n.deep-orange-text.text-accent-1 {\n  color: #ff9e80 !important; }\n\n.deep-orange.accent-2 {\n  background-color: #ff6e40 !important; }\n\n.deep-orange-text.text-accent-2 {\n  color: #ff6e40 !important; }\n\n.deep-orange.accent-3 {\n  background-color: #ff3d00 !important; }\n\n.deep-orange-text.text-accent-3 {\n  color: #ff3d00 !important; }\n\n.deep-orange.accent-4 {\n  background-color: #dd2c00 !important; }\n\n.deep-orange-text.text-accent-4 {\n  color: #dd2c00 !important; }\n\n.brown {\n  background-color: #795548 !important; }\n\n.brown-text {\n  color: #795548 !important; }\n\n.brown.lighten-5 {\n  background-color: #efebe9 !important; }\n\n.brown-text.text-lighten-5 {\n  color: #efebe9 !important; }\n\n.brown.lighten-4 {\n  background-color: #d7ccc8 !important; }\n\n.brown-text.text-lighten-4 {\n  color: #d7ccc8 !important; }\n\n.brown.lighten-3 {\n  background-color: #bcaaa4 !important; }\n\n.brown-text.text-lighten-3 {\n  color: #bcaaa4 !important; }\n\n.brown.lighten-2 {\n  background-color: #a1887f !important; }\n\n.brown-text.text-lighten-2 {\n  color: #a1887f !important; }\n\n.brown.lighten-1 {\n  background-color: #8d6e63 !important; }\n\n.brown-text.text-lighten-1 {\n  color: #8d6e63 !important; }\n\n.brown.darken-1 {\n  background-color: #6d4c41 !important; }\n\n.brown-text.text-darken-1 {\n  color: #6d4c41 !important; }\n\n.brown.darken-2 {\n  background-color: #5d4037 !important; }\n\n.brown-text.text-darken-2 {\n  color: #5d4037 !important; }\n\n.brown.darken-3 {\n  background-color: #4e342e !important; }\n\n.brown-text.text-darken-3 {\n  color: #4e342e !important; }\n\n.brown.darken-4 {\n  background-color: #3e2723 !important; }\n\n.brown-text.text-darken-4 {\n  color: #3e2723 !important; }\n\n.blue-grey {\n  background-color: #607d8b !important; }\n\n.blue-grey-text {\n  color: #607d8b !important; }\n\n.blue-grey.lighten-5 {\n  background-color: #eceff1 !important; }\n\n.blue-grey-text.text-lighten-5 {\n  color: #eceff1 !important; }\n\n.blue-grey.lighten-4 {\n  background-color: #cfd8dc !important; }\n\n.blue-grey-text.text-lighten-4 {\n  color: #cfd8dc !important; }\n\n.blue-grey.lighten-3 {\n  background-color: #b0bec5 !important; }\n\n.blue-grey-text.text-lighten-3 {\n  color: #b0bec5 !important; }\n\n.blue-grey.lighten-2 {\n  background-color: #90a4ae !important; }\n\n.blue-grey-text.text-lighten-2 {\n  color: #90a4ae !important; }\n\n.blue-grey.lighten-1 {\n  background-color: #78909c !important; }\n\n.blue-grey-text.text-lighten-1 {\n  color: #78909c !important; }\n\n.blue-grey.darken-1 {\n  background-color: #546e7a !important; }\n\n.blue-grey-text.text-darken-1 {\n  color: #546e7a !important; }\n\n.blue-grey.darken-2 {\n  background-color: #455a64 !important; }\n\n.blue-grey-text.text-darken-2 {\n  color: #455a64 !important; }\n\n.blue-grey.darken-3 {\n  background-color: #37474f !important; }\n\n.blue-grey-text.text-darken-3 {\n  color: #37474f !important; }\n\n.blue-grey.darken-4 {\n  background-color: #263238 !important; }\n\n.blue-grey-text.text-darken-4 {\n  color: #263238 !important; }\n\n.grey {\n  background-color: #9e9e9e !important; }\n\n.grey-text {\n  color: #9e9e9e !important; }\n\n.grey.lighten-5 {\n  background-color: #fafafa !important; }\n\n.grey-text.text-lighten-5 {\n  color: #fafafa !important; }\n\n.grey.lighten-4 {\n  background-color: #f5f5f5 !important; }\n\n.grey-text.text-lighten-4 {\n  color: #f5f5f5 !important; }\n\n.grey.lighten-3 {\n  background-color: #eee !important; }\n\n.grey-text.text-lighten-3 {\n  color: #eee !important; }\n\n.grey.lighten-2 {\n  background-color: #e0e0e0 !important; }\n\n.grey-text.text-lighten-2 {\n  color: #e0e0e0 !important; }\n\n.grey.lighten-1 {\n  background-color: #bdbdbd !important; }\n\n.grey-text.text-lighten-1 {\n  color: #bdbdbd !important; }\n\n.grey.darken-1 {\n  background-color: #757575 !important; }\n\n.grey-text.text-darken-1 {\n  color: #757575 !important; }\n\n.grey.darken-2 {\n  background-color: #616161 !important; }\n\n.grey-text.text-darken-2 {\n  color: #616161 !important; }\n\n.grey.darken-3 {\n  background-color: #424242 !important; }\n\n.grey-text.text-darken-3 {\n  color: #424242 !important; }\n\n.grey.darken-4 {\n  background-color: #212121 !important; }\n\n.grey-text.text-darken-4 {\n  color: #212121 !important; }\n\n.black {\n  background-color: #000 !important; }\n\n.black-text {\n  color: #000 !important; }\n\n.white {\n  background-color: #fff !important; }\n\n.white-text {\n  color: #fff !important; }\n\n.transparent {\n  background-color: transparent !important; }\n\n.transparent-text {\n  color: transparent !important; }\n\n/*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */\nhtml {\n  font-family: sans-serif;\n  -ms-text-size-adjust: 100%;\n  -webkit-text-size-adjust: 100%; }\n\nbody {\n  margin: 0; }\n\narticle, aside, details, figcaption, figure, footer, header, hgroup, main, menu, nav, section, summary {\n  display: block; }\n\naudio, canvas, progress, video {\n  display: inline-block;\n  vertical-align: baseline; }\n\naudio:not([controls]) {\n  display: none;\n  height: 0; }\n\n[hidden], template {\n  display: none; }\n\na {\n  background-color: transparent; }\n\na:active, a:hover {\n  outline: 0; }\n\nabbr[title] {\n  border-bottom: 1px dotted; }\n\nb, strong {\n  font-weight: bold; }\n\ndfn {\n  font-style: italic; }\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0; }\n\nmark {\n  background: #ff0;\n  color: #000; }\n\nsmall {\n  font-size: 80%; }\n\nsub, sup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline; }\n\nsup {\n  top: -0.5em; }\n\nsub {\n  bottom: -0.25em; }\n\nimg {\n  border: 0; }\n\nsvg:not(:root) {\n  overflow: hidden; }\n\nfigure {\n  margin: 1em 40px; }\n\nhr {\n  box-sizing: content-box;\n  height: 0; }\n\npre {\n  overflow: auto; }\n\ncode, kbd, pre, samp {\n  font-family: monospace, monospace;\n  font-size: 1em; }\n\nbutton, input, optgroup, select, textarea {\n  color: inherit;\n  font: inherit;\n  margin: 0; }\n\nbutton {\n  overflow: visible; }\n\nbutton, select {\n  text-transform: none; }\n\nbutton, html input[type=\"button\"], input[type=\"reset\"], input[type=\"submit\"] {\n  -webkit-appearance: button;\n  cursor: pointer; }\n\nbutton[disabled], html input[disabled] {\n  cursor: default; }\n\nbutton::-moz-focus-inner, input::-moz-focus-inner {\n  border: 0;\n  padding: 0; }\n\ninput {\n  line-height: normal; }\n\ninput[type=\"checkbox\"], input[type=\"radio\"] {\n  box-sizing: border-box;\n  padding: 0; }\n\ninput[type=\"number\"]::-webkit-inner-spin-button, input[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto; }\n\ninput[type=\"search\"] {\n  -webkit-appearance: textfield;\n  box-sizing: content-box; }\n\ninput[type=\"search\"]::-webkit-search-cancel-button, input[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none; }\n\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em; }\n\nlegend {\n  border: 0;\n  padding: 0; }\n\ntextarea {\n  overflow: auto; }\n\noptgroup {\n  font-weight: bold; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\ntd, th {\n  padding: 0; }\n\nhtml {\n  box-sizing: border-box; }\n\n*, *:before, *:after {\n  box-sizing: inherit; }\n\nul:not(.browser-default) {\n  padding-left: 0;\n  list-style-type: none; }\n\nul:not(.browser-default) li {\n  list-style-type: none; }\n\na {\n  color: #039be5;\n  text-decoration: none;\n  -webkit-tap-highlight-color: transparent; }\n\n.valign-wrapper, body.themes .themes-section {\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-align-items: center;\n  -ms-flex-align: center;\n  align-items: center; }\n\n.clearfix {\n  clear: both; }\n\n.z-depth-0 {\n  box-shadow: none !important; }\n\n.z-depth-1, nav, .card-panel, .card, .toast, .btn, .btn-large, .btn-floating, .dropdown-content, .collapsible, .side-nav {\n  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2); }\n\n.z-depth-1-half, .btn:hover, .btn-large:hover, .btn-floating:hover {\n  box-shadow: 0 3px 3px 0 rgba(0, 0, 0, 0.14), 0 1px 7px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -1px rgba(0, 0, 0, 0.2); }\n\n.z-depth-2 {\n  box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12), 0 2px 4px -1px rgba(0, 0, 0, 0.3); }\n\n.z-depth-3 {\n  box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.3); }\n\n.z-depth-4, .modal {\n  box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.3); }\n\n.z-depth-5 {\n  box-shadow: 0 16px 24px 2px rgba(0, 0, 0, 0.14), 0 6px 30px 5px rgba(0, 0, 0, 0.12), 0 8px 10px -5px rgba(0, 0, 0, 0.3); }\n\n.hoverable {\n  transition: box-shadow .25s;\n  box-shadow: 0; }\n\n.hoverable:hover {\n  transition: box-shadow .25s;\n  box-shadow: 0 8px 17px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); }\n\n.divider {\n  height: 1px;\n  overflow: hidden;\n  background-color: #e0e0e0; }\n\nblockquote {\n  margin: 20px 0;\n  padding-left: 1.5rem;\n  border-left: 5px solid #ee6e73; }\n\ni {\n  line-height: inherit; }\n\ni.left {\n  float: left;\n  margin-right: 15px; }\n\ni.right {\n  float: right;\n  margin-left: 15px; }\n\ni.tiny {\n  font-size: 1rem; }\n\ni.small {\n  font-size: 2rem; }\n\ni.medium {\n  font-size: 4rem; }\n\ni.large {\n  font-size: 6rem; }\n\nimg.responsive-img, video.responsive-video {\n  max-width: 100%;\n  height: auto; }\n\n.pagination li {\n  display: inline-block;\n  border-radius: 2px;\n  text-align: center;\n  vertical-align: top;\n  height: 30px; }\n\n.pagination li a {\n  color: #444;\n  display: inline-block;\n  font-size: 1.2rem;\n  padding: 0 10px;\n  line-height: 30px; }\n\n.pagination li.active a {\n  color: #fff; }\n\n.pagination li.active {\n  background-color: #ee6e73; }\n\n.pagination li.disabled a {\n  cursor: default;\n  color: #999; }\n\n.pagination li i {\n  font-size: 2rem; }\n\n.pagination li.pages ul li {\n  display: inline-block;\n  float: none; }\n\n@media only screen and (max-width: 992px) {\n  .pagination {\n    width: 100%; }\n  .pagination li.prev, .pagination li.next {\n    width: 10%; }\n  .pagination li.pages {\n    width: 80%;\n    overflow: hidden;\n    white-space: nowrap; } }\n\n.breadcrumb {\n  font-size: 18px;\n  color: rgba(255, 255, 255, 0.7); }\n\n.breadcrumb i, .breadcrumb [class^=\"mdi-\"], .breadcrumb [class*=\"mdi-\"], .breadcrumb i.material-icons {\n  display: inline-block;\n  float: left;\n  font-size: 24px; }\n\n.breadcrumb:before {\n  content: '\\E5CC';\n  color: rgba(255, 255, 255, 0.7);\n  vertical-align: top;\n  display: inline-block;\n  font-family: 'Material Icons';\n  font-weight: normal;\n  font-style: normal;\n  font-size: 25px;\n  margin: 0 10px 0 8px;\n  -webkit-font-smoothing: antialiased; }\n\n.breadcrumb:first-child:before {\n  display: none; }\n\n.breadcrumb:last-child {\n  color: #fff; }\n\n.parallax-container {\n  position: relative;\n  overflow: hidden;\n  height: 500px; }\n\n.parallax {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  z-index: -1; }\n\n.parallax img {\n  display: none;\n  position: absolute;\n  left: 50%;\n  bottom: 0;\n  min-width: 100%;\n  min-height: 100%;\n  -webkit-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n  -webkit-transform: translateX(-50%);\n  transform: translateX(-50%); }\n\n.pin-top, .pin-bottom {\n  position: relative; }\n\n.pinned {\n  position: fixed !important; }\n\nul.staggered-list li {\n  opacity: 0; }\n\n.fade-in {\n  opacity: 0;\n  -webkit-transform-origin: 0 50%;\n  transform-origin: 0 50%; }\n\n@media only screen and (max-width: 600px) {\n  .hide-on-small-only, .tabs-wrapper, .hide-on-small-and-down {\n    display: none !important; } }\n\n@media only screen and (max-width: 992px) {\n  .hide-on-med-and-down {\n    display: none !important; } }\n\n@media only screen and (min-width: 601px) {\n  .hide-on-med-and-up {\n    display: none !important; } }\n\n@media only screen and (min-width: 600px) and (max-width: 992px) {\n  .hide-on-med-only {\n    display: none !important; } }\n\n@media only screen and (min-width: 993px) {\n  .hide-on-large-only {\n    display: none !important; } }\n\n@media only screen and (min-width: 993px) {\n  .show-on-large {\n    display: block !important; } }\n\n@media only screen and (min-width: 600px) and (max-width: 992px) {\n  .show-on-medium {\n    display: block !important; } }\n\n@media only screen and (max-width: 600px) {\n  .show-on-small {\n    display: block !important; } }\n\n@media only screen and (min-width: 601px) {\n  .show-on-medium-and-up {\n    display: block !important; } }\n\n@media only screen and (max-width: 992px) {\n  .show-on-medium-and-down {\n    display: block !important; } }\n\n@media only screen and (max-width: 600px) {\n  .center-on-small-only {\n    text-align: center; } }\n\n.page-footer {\n  padding-top: 20px;\n  background-color: #ee6e73; }\n\n.page-footer .footer-copyright {\n  overflow: hidden;\n  min-height: 50px;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-align-items: center;\n  -ms-flex-align: center;\n  align-items: center;\n  padding: 10px 0px;\n  color: rgba(255, 255, 255, 0.8);\n  background-color: rgba(51, 51, 51, 0.08); }\n\ntable, th, td {\n  border: none; }\n\ntable {\n  width: 100%;\n  display: table; }\n\ntable.bordered > thead > tr, table.bordered > tbody > tr {\n  border-bottom: 1px solid #d0d0d0; }\n\ntable.striped > tbody > tr:nth-child(odd) {\n  background-color: #f2f2f2; }\n\ntable.striped > tbody > tr > td {\n  border-radius: 0; }\n\ntable.highlight > tbody > tr {\n  transition: background-color .25s ease; }\n\ntable.highlight > tbody > tr:hover {\n  background-color: #f2f2f2; }\n\ntable.centered thead tr th, table.centered tbody tr td {\n  text-align: center; }\n\nthead {\n  border-bottom: 1px solid #d0d0d0; }\n\ntd, th {\n  padding: 15px 5px;\n  display: table-cell;\n  text-align: left;\n  vertical-align: middle;\n  border-radius: 2px; }\n\n@media only screen and (max-width: 992px) {\n  table.responsive-table {\n    width: 100%;\n    border-collapse: collapse;\n    border-spacing: 0;\n    display: block;\n    position: relative; }\n  table.responsive-table td:empty:before {\n    content: '\\A0'; }\n  table.responsive-table th, table.responsive-table td {\n    margin: 0;\n    vertical-align: top; }\n  table.responsive-table th {\n    text-align: left; }\n  table.responsive-table thead {\n    display: block;\n    float: left; }\n  table.responsive-table thead tr {\n    display: block;\n    padding: 0 10px 0 0; }\n  table.responsive-table thead tr th::before {\n    content: \"\\A0\"; }\n  table.responsive-table tbody {\n    display: block;\n    width: auto;\n    position: relative;\n    overflow-x: auto;\n    white-space: nowrap; }\n  table.responsive-table tbody tr {\n    display: inline-block;\n    vertical-align: top; }\n  table.responsive-table th {\n    display: block;\n    text-align: right; }\n  table.responsive-table td {\n    display: block;\n    min-height: 1.25em;\n    text-align: left; }\n  table.responsive-table tr {\n    padding: 0 10px; }\n  table.responsive-table thead {\n    border: 0;\n    border-right: 1px solid #d0d0d0; }\n  table.responsive-table.bordered th {\n    border-bottom: 0;\n    border-left: 0; }\n  table.responsive-table.bordered td {\n    border-left: 0;\n    border-right: 0;\n    border-bottom: 0; }\n  table.responsive-table.bordered tr {\n    border: 0; }\n  table.responsive-table.bordered tbody tr {\n    border-right: 1px solid #d0d0d0; } }\n\n.collection {\n  margin: .5rem 0 1rem 0;\n  border: 1px solid #e0e0e0;\n  border-radius: 2px;\n  overflow: hidden;\n  position: relative; }\n\n.collection .collection-item {\n  background-color: #fff;\n  line-height: 1.5rem;\n  padding: 10px 20px;\n  margin: 0;\n  border-bottom: 1px solid #e0e0e0; }\n\n.collection .collection-item.avatar {\n  min-height: 84px;\n  padding-left: 72px;\n  position: relative; }\n\n.collection .collection-item.avatar .circle {\n  position: absolute;\n  width: 42px;\n  height: 42px;\n  overflow: hidden;\n  left: 15px;\n  display: inline-block;\n  vertical-align: middle; }\n\n.collection .collection-item.avatar i.circle {\n  font-size: 18px;\n  line-height: 42px;\n  color: #fff;\n  background-color: #999;\n  text-align: center; }\n\n.collection .collection-item.avatar .title {\n  font-size: 16px; }\n\n.collection .collection-item.avatar p {\n  margin: 0; }\n\n.collection .collection-item.avatar .secondary-content {\n  position: absolute;\n  top: 16px;\n  right: 16px; }\n\n.collection .collection-item:last-child {\n  border-bottom: none; }\n\n.collection .collection-item.active {\n  background-color: #26a69a;\n  color: #eafaf9; }\n\n.collection .collection-item.active .secondary-content {\n  color: #fff; }\n\n.collection a.collection-item {\n  display: block;\n  transition: .25s;\n  color: #26a69a; }\n\n.collection a.collection-item:not(.active):hover {\n  background-color: #ddd; }\n\n.collection.with-header .collection-header {\n  background-color: #fff;\n  border-bottom: 1px solid #e0e0e0;\n  padding: 10px 20px; }\n\n.collection.with-header .collection-item {\n  padding-left: 30px; }\n\n.collection.with-header .collection-item.avatar {\n  padding-left: 72px; }\n\n.secondary-content {\n  float: right;\n  color: #26a69a; }\n\n.collapsible .collection {\n  margin: 0;\n  border: none; }\n\n.video-container {\n  position: relative;\n  padding-bottom: 56.25%;\n  height: 0;\n  overflow: hidden; }\n\n.video-container iframe, .video-container object, .video-container embed {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%; }\n\n.progress {\n  position: relative;\n  height: 4px;\n  display: block;\n  width: 100%;\n  background-color: #acece6;\n  border-radius: 2px;\n  margin: .5rem 0 1rem 0;\n  overflow: hidden; }\n\n.progress .determinate {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  background-color: #26a69a;\n  transition: width .3s linear; }\n\n.progress .indeterminate {\n  background-color: #26a69a; }\n\n.progress .indeterminate:before {\n  content: '';\n  position: absolute;\n  background-color: inherit;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  will-change: left, right;\n  -webkit-animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;\n  animation: indeterminate 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite; }\n\n.progress .indeterminate:after {\n  content: '';\n  position: absolute;\n  background-color: inherit;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  will-change: left, right;\n  -webkit-animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;\n  animation: indeterminate-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;\n  -webkit-animation-delay: 1.15s;\n  animation-delay: 1.15s; }\n\n@-webkit-keyframes indeterminate {\n  0% {\n    left: -35%;\n    right: 100%; }\n  60% {\n    left: 100%;\n    right: -90%; }\n  100% {\n    left: 100%;\n    right: -90%; } }\n\n@keyframes indeterminate {\n  0% {\n    left: -35%;\n    right: 100%; }\n  60% {\n    left: 100%;\n    right: -90%; }\n  100% {\n    left: 100%;\n    right: -90%; } }\n\n@-webkit-keyframes indeterminate-short {\n  0% {\n    left: -200%;\n    right: 100%; }\n  60% {\n    left: 107%;\n    right: -8%; }\n  100% {\n    left: 107%;\n    right: -8%; } }\n\n@keyframes indeterminate-short {\n  0% {\n    left: -200%;\n    right: 100%; }\n  60% {\n    left: 107%;\n    right: -8%; }\n  100% {\n    left: 107%;\n    right: -8%; } }\n\n.hide {\n  display: none !important; }\n\n.left-align {\n  text-align: left; }\n\n.right-align {\n  text-align: right; }\n\n.center, .center-align {\n  text-align: center; }\n\n.left {\n  float: left !important; }\n\n.right {\n  float: right !important; }\n\n.no-select, input[type=range], input[type=range] + .thumb {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.circle {\n  border-radius: 50%; }\n\n.center-block {\n  display: block;\n  margin-left: auto;\n  margin-right: auto; }\n\n.truncate {\n  display: block;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis; }\n\n.no-padding {\n  padding: 0 !important; }\n\nspan.badge {\n  min-width: 3rem;\n  padding: 0 6px;\n  margin-left: 14px;\n  text-align: center;\n  font-size: 1rem;\n  line-height: 22px;\n  height: 22px;\n  color: #757575;\n  float: right;\n  box-sizing: border-box; }\n\nspan.badge.new {\n  font-weight: 300;\n  font-size: 0.8rem;\n  color: #fff;\n  background-color: #26a69a;\n  border-radius: 2px; }\n\nspan.badge.new:after {\n  content: \" new\"; }\n\nspan.badge[data-badge-caption]::after {\n  content: \" \" attr(data-badge-caption); }\n\nnav ul a span.badge {\n  display: inline-block;\n  float: none;\n  margin-left: 4px;\n  line-height: 22px;\n  height: 22px; }\n\n.collection-item span.badge {\n  margin-top: calc(.75rem - 11px); }\n\n.collapsible span.badge {\n  margin-top: calc(1.5rem - 11px); }\n\n.side-nav span.badge {\n  margin-top: calc(24px - 11px); }\n\n.material-icons {\n  text-rendering: optimizeLegibility;\n  -webkit-font-feature-settings: 'liga';\n  -moz-font-feature-settings: 'liga';\n  font-feature-settings: 'liga'; }\n\n.container {\n  margin: 0 auto;\n  max-width: 1280px;\n  width: 90%; }\n\n@media only screen and (min-width: 601px) {\n  .container {\n    width: 85%; } }\n\n@media only screen and (min-width: 993px) {\n  .container {\n    width: 70%; } }\n\n.container .row {\n  margin-left: -.75rem;\n  margin-right: -.75rem; }\n\n.section {\n  padding-top: 1rem;\n  padding-bottom: 1rem; }\n\n.section.no-pad {\n  padding: 0; }\n\n.section.no-pad-bot {\n  padding-bottom: 0; }\n\n.section.no-pad-top {\n  padding-top: 0; }\n\n.row {\n  margin-left: auto;\n  margin-right: auto;\n  margin-bottom: 20px; }\n\n.row:after {\n  content: \"\";\n  display: table;\n  clear: both; }\n\n.row .col {\n  float: left;\n  box-sizing: border-box;\n  padding: 0 .75rem;\n  min-height: 1px; }\n\n.row .col[class*=\"push-\"], .row .col[class*=\"pull-\"] {\n  position: relative; }\n\n.row .col.s1 {\n  width: 8.3333333333%;\n  margin-left: auto;\n  left: auto;\n  right: auto; }\n\n.row .col.s2 {\n  width: 16.6666666667%;\n  margin-left: auto;\n  left: auto;\n  right: auto; }\n\n.row .col.s3 {\n  width: 25%;\n  margin-left: auto;\n  left: auto;\n  right: auto; }\n\n.row .col.s4 {\n  width: 33.3333333333%;\n  margin-left: auto;\n  left: auto;\n  right: auto; }\n\n.row .col.s5 {\n  width: 41.6666666667%;\n  margin-left: auto;\n  left: auto;\n  right: auto; }\n\n.row .col.s6 {\n  width: 50%;\n  margin-left: auto;\n  left: auto;\n  right: auto; }\n\n.row .col.s7 {\n  width: 58.3333333333%;\n  margin-left: auto;\n  left: auto;\n  right: auto; }\n\n.row .col.s8 {\n  width: 66.6666666667%;\n  margin-left: auto;\n  left: auto;\n  right: auto; }\n\n.row .col.s9 {\n  width: 75%;\n  margin-left: auto;\n  left: auto;\n  right: auto; }\n\n.row .col.s10 {\n  width: 83.3333333333%;\n  margin-left: auto;\n  left: auto;\n  right: auto; }\n\n.row .col.s11 {\n  width: 91.6666666667%;\n  margin-left: auto;\n  left: auto;\n  right: auto; }\n\n.row .col.s12 {\n  width: 100%;\n  margin-left: auto;\n  left: auto;\n  right: auto; }\n\n.row .col.offset-s1 {\n  margin-left: 8.3333333333%; }\n\n.row .col.pull-s1 {\n  right: 8.3333333333%; }\n\n.row .col.push-s1 {\n  left: 8.3333333333%; }\n\n.row .col.offset-s2 {\n  margin-left: 16.6666666667%; }\n\n.row .col.pull-s2 {\n  right: 16.6666666667%; }\n\n.row .col.push-s2 {\n  left: 16.6666666667%; }\n\n.row .col.offset-s3 {\n  margin-left: 25%; }\n\n.row .col.pull-s3 {\n  right: 25%; }\n\n.row .col.push-s3 {\n  left: 25%; }\n\n.row .col.offset-s4 {\n  margin-left: 33.3333333333%; }\n\n.row .col.pull-s4 {\n  right: 33.3333333333%; }\n\n.row .col.push-s4 {\n  left: 33.3333333333%; }\n\n.row .col.offset-s5 {\n  margin-left: 41.6666666667%; }\n\n.row .col.pull-s5 {\n  right: 41.6666666667%; }\n\n.row .col.push-s5 {\n  left: 41.6666666667%; }\n\n.row .col.offset-s6 {\n  margin-left: 50%; }\n\n.row .col.pull-s6 {\n  right: 50%; }\n\n.row .col.push-s6 {\n  left: 50%; }\n\n.row .col.offset-s7 {\n  margin-left: 58.3333333333%; }\n\n.row .col.pull-s7 {\n  right: 58.3333333333%; }\n\n.row .col.push-s7 {\n  left: 58.3333333333%; }\n\n.row .col.offset-s8 {\n  margin-left: 66.6666666667%; }\n\n.row .col.pull-s8 {\n  right: 66.6666666667%; }\n\n.row .col.push-s8 {\n  left: 66.6666666667%; }\n\n.row .col.offset-s9 {\n  margin-left: 75%; }\n\n.row .col.pull-s9 {\n  right: 75%; }\n\n.row .col.push-s9 {\n  left: 75%; }\n\n.row .col.offset-s10 {\n  margin-left: 83.3333333333%; }\n\n.row .col.pull-s10 {\n  right: 83.3333333333%; }\n\n.row .col.push-s10 {\n  left: 83.3333333333%; }\n\n.row .col.offset-s11 {\n  margin-left: 91.6666666667%; }\n\n.row .col.pull-s11 {\n  right: 91.6666666667%; }\n\n.row .col.push-s11 {\n  left: 91.6666666667%; }\n\n.row .col.offset-s12 {\n  margin-left: 100%; }\n\n.row .col.pull-s12 {\n  right: 100%; }\n\n.row .col.push-s12 {\n  left: 100%; }\n\n@media only screen and (min-width: 601px) {\n  .row .col.m1 {\n    width: 8.3333333333%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.m2 {\n    width: 16.6666666667%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.m3 {\n    width: 25%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.m4 {\n    width: 33.3333333333%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.m5 {\n    width: 41.6666666667%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.m6 {\n    width: 50%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.m7 {\n    width: 58.3333333333%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.m8 {\n    width: 66.6666666667%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.m9 {\n    width: 75%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.m10 {\n    width: 83.3333333333%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.m11 {\n    width: 91.6666666667%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.m12 {\n    width: 100%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.offset-m1 {\n    margin-left: 8.3333333333%; }\n  .row .col.pull-m1 {\n    right: 8.3333333333%; }\n  .row .col.push-m1 {\n    left: 8.3333333333%; }\n  .row .col.offset-m2 {\n    margin-left: 16.6666666667%; }\n  .row .col.pull-m2 {\n    right: 16.6666666667%; }\n  .row .col.push-m2 {\n    left: 16.6666666667%; }\n  .row .col.offset-m3 {\n    margin-left: 25%; }\n  .row .col.pull-m3 {\n    right: 25%; }\n  .row .col.push-m3 {\n    left: 25%; }\n  .row .col.offset-m4 {\n    margin-left: 33.3333333333%; }\n  .row .col.pull-m4 {\n    right: 33.3333333333%; }\n  .row .col.push-m4 {\n    left: 33.3333333333%; }\n  .row .col.offset-m5 {\n    margin-left: 41.6666666667%; }\n  .row .col.pull-m5 {\n    right: 41.6666666667%; }\n  .row .col.push-m5 {\n    left: 41.6666666667%; }\n  .row .col.offset-m6 {\n    margin-left: 50%; }\n  .row .col.pull-m6 {\n    right: 50%; }\n  .row .col.push-m6 {\n    left: 50%; }\n  .row .col.offset-m7 {\n    margin-left: 58.3333333333%; }\n  .row .col.pull-m7 {\n    right: 58.3333333333%; }\n  .row .col.push-m7 {\n    left: 58.3333333333%; }\n  .row .col.offset-m8 {\n    margin-left: 66.6666666667%; }\n  .row .col.pull-m8 {\n    right: 66.6666666667%; }\n  .row .col.push-m8 {\n    left: 66.6666666667%; }\n  .row .col.offset-m9 {\n    margin-left: 75%; }\n  .row .col.pull-m9 {\n    right: 75%; }\n  .row .col.push-m9 {\n    left: 75%; }\n  .row .col.offset-m10 {\n    margin-left: 83.3333333333%; }\n  .row .col.pull-m10 {\n    right: 83.3333333333%; }\n  .row .col.push-m10 {\n    left: 83.3333333333%; }\n  .row .col.offset-m11 {\n    margin-left: 91.6666666667%; }\n  .row .col.pull-m11 {\n    right: 91.6666666667%; }\n  .row .col.push-m11 {\n    left: 91.6666666667%; }\n  .row .col.offset-m12 {\n    margin-left: 100%; }\n  .row .col.pull-m12 {\n    right: 100%; }\n  .row .col.push-m12 {\n    left: 100%; } }\n\n@media only screen and (min-width: 993px) {\n  .row .col.l1 {\n    width: 8.3333333333%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.l2 {\n    width: 16.6666666667%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.l3 {\n    width: 25%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.l4 {\n    width: 33.3333333333%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.l5 {\n    width: 41.6666666667%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.l6 {\n    width: 50%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.l7 {\n    width: 58.3333333333%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.l8 {\n    width: 66.6666666667%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.l9 {\n    width: 75%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.l10 {\n    width: 83.3333333333%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.l11 {\n    width: 91.6666666667%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.l12 {\n    width: 100%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.offset-l1 {\n    margin-left: 8.3333333333%; }\n  .row .col.pull-l1 {\n    right: 8.3333333333%; }\n  .row .col.push-l1 {\n    left: 8.3333333333%; }\n  .row .col.offset-l2 {\n    margin-left: 16.6666666667%; }\n  .row .col.pull-l2 {\n    right: 16.6666666667%; }\n  .row .col.push-l2 {\n    left: 16.6666666667%; }\n  .row .col.offset-l3 {\n    margin-left: 25%; }\n  .row .col.pull-l3 {\n    right: 25%; }\n  .row .col.push-l3 {\n    left: 25%; }\n  .row .col.offset-l4 {\n    margin-left: 33.3333333333%; }\n  .row .col.pull-l4 {\n    right: 33.3333333333%; }\n  .row .col.push-l4 {\n    left: 33.3333333333%; }\n  .row .col.offset-l5 {\n    margin-left: 41.6666666667%; }\n  .row .col.pull-l5 {\n    right: 41.6666666667%; }\n  .row .col.push-l5 {\n    left: 41.6666666667%; }\n  .row .col.offset-l6 {\n    margin-left: 50%; }\n  .row .col.pull-l6 {\n    right: 50%; }\n  .row .col.push-l6 {\n    left: 50%; }\n  .row .col.offset-l7 {\n    margin-left: 58.3333333333%; }\n  .row .col.pull-l7 {\n    right: 58.3333333333%; }\n  .row .col.push-l7 {\n    left: 58.3333333333%; }\n  .row .col.offset-l8 {\n    margin-left: 66.6666666667%; }\n  .row .col.pull-l8 {\n    right: 66.6666666667%; }\n  .row .col.push-l8 {\n    left: 66.6666666667%; }\n  .row .col.offset-l9 {\n    margin-left: 75%; }\n  .row .col.pull-l9 {\n    right: 75%; }\n  .row .col.push-l9 {\n    left: 75%; }\n  .row .col.offset-l10 {\n    margin-left: 83.3333333333%; }\n  .row .col.pull-l10 {\n    right: 83.3333333333%; }\n  .row .col.push-l10 {\n    left: 83.3333333333%; }\n  .row .col.offset-l11 {\n    margin-left: 91.6666666667%; }\n  .row .col.pull-l11 {\n    right: 91.6666666667%; }\n  .row .col.push-l11 {\n    left: 91.6666666667%; }\n  .row .col.offset-l12 {\n    margin-left: 100%; }\n  .row .col.pull-l12 {\n    right: 100%; }\n  .row .col.push-l12 {\n    left: 100%; } }\n\n@media only screen and (min-width: 1201px) {\n  .row .col.xl1 {\n    width: 8.3333333333%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.xl2 {\n    width: 16.6666666667%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.xl3 {\n    width: 25%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.xl4 {\n    width: 33.3333333333%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.xl5 {\n    width: 41.6666666667%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.xl6 {\n    width: 50%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.xl7 {\n    width: 58.3333333333%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.xl8 {\n    width: 66.6666666667%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.xl9 {\n    width: 75%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.xl10 {\n    width: 83.3333333333%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.xl11 {\n    width: 91.6666666667%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.xl12 {\n    width: 100%;\n    margin-left: auto;\n    left: auto;\n    right: auto; }\n  .row .col.offset-xl1 {\n    margin-left: 8.3333333333%; }\n  .row .col.pull-xl1 {\n    right: 8.3333333333%; }\n  .row .col.push-xl1 {\n    left: 8.3333333333%; }\n  .row .col.offset-xl2 {\n    margin-left: 16.6666666667%; }\n  .row .col.pull-xl2 {\n    right: 16.6666666667%; }\n  .row .col.push-xl2 {\n    left: 16.6666666667%; }\n  .row .col.offset-xl3 {\n    margin-left: 25%; }\n  .row .col.pull-xl3 {\n    right: 25%; }\n  .row .col.push-xl3 {\n    left: 25%; }\n  .row .col.offset-xl4 {\n    margin-left: 33.3333333333%; }\n  .row .col.pull-xl4 {\n    right: 33.3333333333%; }\n  .row .col.push-xl4 {\n    left: 33.3333333333%; }\n  .row .col.offset-xl5 {\n    margin-left: 41.6666666667%; }\n  .row .col.pull-xl5 {\n    right: 41.6666666667%; }\n  .row .col.push-xl5 {\n    left: 41.6666666667%; }\n  .row .col.offset-xl6 {\n    margin-left: 50%; }\n  .row .col.pull-xl6 {\n    right: 50%; }\n  .row .col.push-xl6 {\n    left: 50%; }\n  .row .col.offset-xl7 {\n    margin-left: 58.3333333333%; }\n  .row .col.pull-xl7 {\n    right: 58.3333333333%; }\n  .row .col.push-xl7 {\n    left: 58.3333333333%; }\n  .row .col.offset-xl8 {\n    margin-left: 66.6666666667%; }\n  .row .col.pull-xl8 {\n    right: 66.6666666667%; }\n  .row .col.push-xl8 {\n    left: 66.6666666667%; }\n  .row .col.offset-xl9 {\n    margin-left: 75%; }\n  .row .col.pull-xl9 {\n    right: 75%; }\n  .row .col.push-xl9 {\n    left: 75%; }\n  .row .col.offset-xl10 {\n    margin-left: 83.3333333333%; }\n  .row .col.pull-xl10 {\n    right: 83.3333333333%; }\n  .row .col.push-xl10 {\n    left: 83.3333333333%; }\n  .row .col.offset-xl11 {\n    margin-left: 91.6666666667%; }\n  .row .col.pull-xl11 {\n    right: 91.6666666667%; }\n  .row .col.push-xl11 {\n    left: 91.6666666667%; }\n  .row .col.offset-xl12 {\n    margin-left: 100%; }\n  .row .col.pull-xl12 {\n    right: 100%; }\n  .row .col.push-xl12 {\n    left: 100%; } }\n\nnav {\n  color: #fff;\n  background-color: #ee6e73;\n  width: 100%;\n  height: 56px;\n  line-height: 56px; }\n\nnav.nav-extended {\n  height: auto; }\n\nnav.nav-extended .nav-wrapper {\n  min-height: 56px;\n  height: auto; }\n\nnav.nav-extended .nav-content {\n  position: relative;\n  line-height: normal; }\n\nnav a {\n  color: #fff; }\n\nnav i, nav [class^=\"mdi-\"], nav [class*=\"mdi-\"], nav i.material-icons {\n  display: block;\n  font-size: 24px;\n  height: 56px;\n  line-height: 56px; }\n\nnav .nav-wrapper {\n  position: relative;\n  height: 100%; }\n\n@media only screen and (min-width: 993px) {\n  nav a.button-collapse {\n    display: none; } }\n\nnav .button-collapse {\n  float: left;\n  position: relative;\n  z-index: 1;\n  height: 56px;\n  margin: 0 18px; }\n\nnav .button-collapse i {\n  height: 56px;\n  line-height: 56px; }\n\nnav .brand-logo {\n  position: absolute;\n  color: #fff;\n  display: inline-block;\n  font-size: 2.1rem;\n  padding: 0;\n  white-space: nowrap; }\n\nnav .brand-logo.center {\n  left: 50%;\n  -webkit-transform: translateX(-50%);\n  transform: translateX(-50%); }\n\n@media only screen and (max-width: 992px) {\n  nav .brand-logo {\n    left: 50%;\n    -webkit-transform: translateX(-50%);\n    transform: translateX(-50%); }\n  nav .brand-logo.left, nav .brand-logo.right {\n    padding: 0;\n    -webkit-transform: none;\n    transform: none; }\n  nav .brand-logo.left {\n    left: 0.5rem; }\n  nav .brand-logo.right {\n    right: 0.5rem;\n    left: auto; } }\n\nnav .brand-logo.right {\n  right: 0.5rem;\n  padding: 0; }\n\nnav .brand-logo i, nav .brand-logo [class^=\"mdi-\"], nav .brand-logo [class*=\"mdi-\"], nav .brand-logo i.material-icons {\n  float: left;\n  margin-right: 15px; }\n\nnav .nav-title {\n  display: inline-block;\n  font-size: 32px;\n  padding: 28px 0; }\n\nnav ul {\n  margin: 0; }\n\nnav ul li {\n  transition: background-color .3s;\n  float: left;\n  padding: 0; }\n\nnav ul li.active {\n  background-color: rgba(0, 0, 0, 0.1); }\n\nnav ul a {\n  transition: background-color .3s;\n  font-size: 1rem;\n  color: #fff;\n  display: block;\n  padding: 0 15px;\n  cursor: pointer; }\n\nnav ul a.btn, nav ul a.btn-large, nav ul a.btn-large, nav ul a.btn-flat, nav ul a.btn-floating {\n  margin-top: -2px;\n  margin-left: 15px;\n  margin-right: 15px; }\n\nnav ul a.btn > .material-icons, nav ul a.btn-large > .material-icons, nav ul a.btn-large > .material-icons, nav ul a.btn-flat > .material-icons, nav ul a.btn-floating > .material-icons {\n  height: inherit;\n  line-height: inherit; }\n\nnav ul a:hover {\n  background-color: rgba(0, 0, 0, 0.1); }\n\nnav ul.left {\n  float: left; }\n\nnav form {\n  height: 100%; }\n\nnav .input-field {\n  margin: 0;\n  height: 100%; }\n\nnav .input-field input {\n  height: 100%;\n  font-size: 1.2rem;\n  border: none;\n  padding-left: 2rem; }\n\nnav .input-field input:focus, nav .input-field input[type=text]:valid, nav .input-field input[type=password]:valid, nav .input-field input[type=email]:valid, nav .input-field input[type=url]:valid, nav .input-field input[type=date]:valid {\n  border: none;\n  box-shadow: none; }\n\nnav .input-field label {\n  top: 0;\n  left: 0; }\n\nnav .input-field label i {\n  color: rgba(255, 255, 255, 0.7);\n  transition: color .3s; }\n\nnav .input-field label.active i {\n  color: #fff; }\n\n.navbar-fixed {\n  position: relative;\n  height: 56px;\n  z-index: 997; }\n\n.navbar-fixed nav {\n  position: fixed; }\n\n@media only screen and (min-width: 601px) {\n  nav.nav-extended .nav-wrapper {\n    min-height: 64px; }\n  nav, nav .nav-wrapper i, nav a.button-collapse, nav a.button-collapse i {\n    height: 64px;\n    line-height: 64px; }\n  .navbar-fixed {\n    height: 64px; } }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: local(Roboto Thin), url(" + __webpack_require__(40) + ") format(\"woff2\"), url(" + __webpack_require__(39) + ") format(\"woff\");\n  font-weight: 100; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: local(Roboto Light), url(" + __webpack_require__(34) + ") format(\"woff2\"), url(" + __webpack_require__(33) + ") format(\"woff\");\n  font-weight: 300; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: local(Roboto Regular), url(" + __webpack_require__(38) + ") format(\"woff2\"), url(" + __webpack_require__(37) + ") format(\"woff\");\n  font-weight: 400; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: local(Roboto Medium), url(" + __webpack_require__(36) + ") format(\"woff2\"), url(" + __webpack_require__(35) + ") format(\"woff\");\n  font-weight: 500; }\n\n@font-face {\n  font-family: \"Roboto\";\n  src: local(Roboto Bold), url(" + __webpack_require__(32) + ") format(\"woff2\"), url(" + __webpack_require__(31) + ") format(\"woff\");\n  font-weight: 700; }\n\na {\n  text-decoration: none; }\n\nhtml {\n  line-height: 1.5;\n  font-family: \"Roboto\", sans-serif;\n  font-weight: normal;\n  color: rgba(0, 0, 0, 0.87); }\n\n@media only screen and (min-width: 0) {\n  html {\n    font-size: 14px; } }\n\n@media only screen and (min-width: 992px) {\n  html {\n    font-size: 14.5px; } }\n\n@media only screen and (min-width: 1200px) {\n  html {\n    font-size: 15px; } }\n\nh1, h2, h3, h4, h5, h6 {\n  font-weight: 400;\n  line-height: 1.1; }\n\nh1 a, h2 a, h3 a, h4 a, h5 a, h6 a {\n  font-weight: inherit; }\n\nh1 {\n  font-size: 4.2rem;\n  line-height: 110%;\n  margin: 2.1rem 0 1.68rem 0; }\n\nh2 {\n  font-size: 3.56rem;\n  line-height: 110%;\n  margin: 1.78rem 0 1.424rem 0; }\n\nh3 {\n  font-size: 2.92rem;\n  line-height: 110%;\n  margin: 1.46rem 0 1.168rem 0; }\n\nh4 {\n  font-size: 2.28rem;\n  line-height: 110%;\n  margin: 1.14rem 0 .912rem 0; }\n\nh5 {\n  font-size: 1.64rem;\n  line-height: 110%;\n  margin: .82rem 0 .656rem 0; }\n\nh6 {\n  font-size: 1rem;\n  line-height: 110%;\n  margin: .5rem 0 .4rem 0; }\n\nem {\n  font-style: italic; }\n\nstrong {\n  font-weight: 500; }\n\nsmall {\n  font-size: 75%; }\n\n.light, .page-footer .footer-copyright {\n  font-weight: 300; }\n\n.thin {\n  font-weight: 200; }\n\n.flow-text {\n  font-weight: 300; }\n\n@media only screen and (min-width: 360px) {\n  .flow-text {\n    font-size: 1.2rem; } }\n\n@media only screen and (min-width: 390px) {\n  .flow-text {\n    font-size: 1.224rem; } }\n\n@media only screen and (min-width: 420px) {\n  .flow-text {\n    font-size: 1.248rem; } }\n\n@media only screen and (min-width: 450px) {\n  .flow-text {\n    font-size: 1.272rem; } }\n\n@media only screen and (min-width: 480px) {\n  .flow-text {\n    font-size: 1.296rem; } }\n\n@media only screen and (min-width: 510px) {\n  .flow-text {\n    font-size: 1.32rem; } }\n\n@media only screen and (min-width: 540px) {\n  .flow-text {\n    font-size: 1.344rem; } }\n\n@media only screen and (min-width: 570px) {\n  .flow-text {\n    font-size: 1.368rem; } }\n\n@media only screen and (min-width: 600px) {\n  .flow-text {\n    font-size: 1.392rem; } }\n\n@media only screen and (min-width: 630px) {\n  .flow-text {\n    font-size: 1.416rem; } }\n\n@media only screen and (min-width: 660px) {\n  .flow-text {\n    font-size: 1.44rem; } }\n\n@media only screen and (min-width: 690px) {\n  .flow-text {\n    font-size: 1.464rem; } }\n\n@media only screen and (min-width: 720px) {\n  .flow-text {\n    font-size: 1.488rem; } }\n\n@media only screen and (min-width: 750px) {\n  .flow-text {\n    font-size: 1.512rem; } }\n\n@media only screen and (min-width: 780px) {\n  .flow-text {\n    font-size: 1.536rem; } }\n\n@media only screen and (min-width: 810px) {\n  .flow-text {\n    font-size: 1.56rem; } }\n\n@media only screen and (min-width: 840px) {\n  .flow-text {\n    font-size: 1.584rem; } }\n\n@media only screen and (min-width: 870px) {\n  .flow-text {\n    font-size: 1.608rem; } }\n\n@media only screen and (min-width: 900px) {\n  .flow-text {\n    font-size: 1.632rem; } }\n\n@media only screen and (min-width: 930px) {\n  .flow-text {\n    font-size: 1.656rem; } }\n\n@media only screen and (min-width: 960px) {\n  .flow-text {\n    font-size: 1.68rem; } }\n\n@media only screen and (max-width: 360px) {\n  .flow-text {\n    font-size: 1.2rem; } }\n\n.scale-transition {\n  transition: -webkit-transform 0.3s cubic-bezier(0.53, 0.01, 0.36, 1.63) !important;\n  transition: transform 0.3s cubic-bezier(0.53, 0.01, 0.36, 1.63) !important;\n  transition: transform 0.3s cubic-bezier(0.53, 0.01, 0.36, 1.63), -webkit-transform 0.3s cubic-bezier(0.53, 0.01, 0.36, 1.63) !important; }\n\n.scale-transition.scale-out {\n  -webkit-transform: scale(0);\n  transform: scale(0);\n  transition: -webkit-transform .2s !important;\n  transition: transform .2s !important;\n  transition: transform .2s, -webkit-transform .2s !important; }\n\n.scale-transition.scale-in {\n  -webkit-transform: scale(1);\n  transform: scale(1); }\n\n.card-panel {\n  transition: box-shadow .25s;\n  padding: 24px;\n  margin: .5rem 0 1rem 0;\n  border-radius: 2px;\n  background-color: #fff; }\n\n.card {\n  position: relative;\n  margin: .5rem 0 1rem 0;\n  background-color: #fff;\n  transition: box-shadow .25s;\n  border-radius: 2px; }\n\n.card .card-title {\n  font-size: 24px;\n  font-weight: 300; }\n\n.card .card-title.activator {\n  cursor: pointer; }\n\n.card.small, .card.medium, .card.large {\n  position: relative; }\n\n.card.small .card-image, .card.medium .card-image, .card.large .card-image {\n  max-height: 60%;\n  overflow: hidden; }\n\n.card.small .card-image + .card-content, .card.medium .card-image + .card-content, .card.large .card-image + .card-content {\n  max-height: 40%; }\n\n.card.small .card-content, .card.medium .card-content, .card.large .card-content {\n  max-height: 100%;\n  overflow: hidden; }\n\n.card.small .card-action, .card.medium .card-action, .card.large .card-action {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0; }\n\n.card.small {\n  height: 300px; }\n\n.card.medium {\n  height: 400px; }\n\n.card.large {\n  height: 500px; }\n\n.card.horizontal {\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex; }\n\n.card.horizontal.small .card-image, .card.horizontal.medium .card-image, .card.horizontal.large .card-image {\n  height: 100%;\n  max-height: none;\n  overflow: visible; }\n\n.card.horizontal.small .card-image img, .card.horizontal.medium .card-image img, .card.horizontal.large .card-image img {\n  height: 100%; }\n\n.card.horizontal .card-image {\n  max-width: 50%; }\n\n.card.horizontal .card-image img {\n  border-radius: 2px 0 0 2px;\n  max-width: 100%;\n  width: auto; }\n\n.card.horizontal .card-stacked {\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-flex-direction: column;\n  -ms-flex-direction: column;\n  flex-direction: column;\n  -webkit-flex: 1;\n  -ms-flex: 1;\n  flex: 1;\n  position: relative; }\n\n.card.horizontal .card-stacked .card-content {\n  -webkit-flex-grow: 1;\n  -ms-flex-positive: 1;\n  flex-grow: 1; }\n\n.card.sticky-action .card-action {\n  z-index: 2; }\n\n.card.sticky-action .card-reveal {\n  z-index: 1;\n  padding-bottom: 64px; }\n\n.card .card-image {\n  position: relative; }\n\n.card .card-image img {\n  display: block;\n  border-radius: 2px 2px 0 0;\n  position: relative;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  width: 100%; }\n\n.card .card-image .card-title {\n  color: #fff;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  max-width: 100%;\n  padding: 24px; }\n\n.card .card-content {\n  padding: 24px;\n  border-radius: 0 0 2px 2px; }\n\n.card .card-content p {\n  margin: 0;\n  color: inherit; }\n\n.card .card-content .card-title {\n  display: block;\n  line-height: 32px;\n  margin-bottom: 8px; }\n\n.card .card-content .card-title i {\n  line-height: 32px; }\n\n.card .card-action {\n  position: relative;\n  background-color: inherit;\n  border-top: 1px solid rgba(160, 160, 160, 0.2);\n  padding: 16px 24px; }\n\n.card .card-action:last-child {\n  border-radius: 0 0 2px 2px; }\n\n.card .card-action a:not(.btn):not(.btn-large):not(.btn-large):not(.btn-floating) {\n  color: #ffab40;\n  margin-right: 24px;\n  transition: color .3s ease;\n  text-transform: uppercase; }\n\n.card .card-action a:not(.btn):not(.btn-large):not(.btn-large):not(.btn-floating):hover {\n  color: #ffd8a6; }\n\n.card .card-reveal {\n  padding: 24px;\n  position: absolute;\n  background-color: #fff;\n  width: 100%;\n  overflow-y: auto;\n  left: 0;\n  top: 100%;\n  height: 100%;\n  z-index: 3;\n  display: none; }\n\n.card .card-reveal .card-title {\n  cursor: pointer;\n  display: block; }\n\n#toast-container {\n  display: block;\n  position: fixed;\n  z-index: 10000; }\n\n@media only screen and (max-width: 600px) {\n  #toast-container {\n    min-width: 100%;\n    bottom: 0%; } }\n\n@media only screen and (min-width: 601px) and (max-width: 992px) {\n  #toast-container {\n    left: 5%;\n    bottom: 7%;\n    max-width: 90%; } }\n\n@media only screen and (min-width: 993px) {\n  #toast-container {\n    top: 10%;\n    right: 7%;\n    max-width: 86%; } }\n\n.toast {\n  border-radius: 2px;\n  top: 35px;\n  width: auto;\n  clear: both;\n  margin-top: 10px;\n  position: relative;\n  max-width: 100%;\n  height: auto;\n  min-height: 48px;\n  line-height: 1.5em;\n  word-break: break-all;\n  background-color: #323232;\n  padding: 10px 25px;\n  font-size: 1.1rem;\n  font-weight: 300;\n  color: #fff;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-align-items: center;\n  -ms-flex-align: center;\n  align-items: center;\n  -webkit-justify-content: space-between;\n  -ms-flex-pack: justify;\n  justify-content: space-between; }\n\n.toast .btn, .toast .btn-large, .toast .btn-flat {\n  margin: 0;\n  margin-left: 3rem; }\n\n.toast.rounded {\n  border-radius: 24px; }\n\n@media only screen and (max-width: 600px) {\n  .toast {\n    width: 100%;\n    border-radius: 0; } }\n\n@media only screen and (min-width: 601px) and (max-width: 992px) {\n  .toast {\n    float: left; } }\n\n@media only screen and (min-width: 993px) {\n  .toast {\n    float: right; } }\n\n.tabs {\n  position: relative;\n  overflow-x: auto;\n  overflow-y: hidden;\n  height: 48px;\n  width: 100%;\n  background-color: #fff;\n  margin: 0 auto;\n  white-space: nowrap; }\n\n.tabs.tabs-transparent {\n  background-color: transparent; }\n\n.tabs.tabs-transparent .tab a, .tabs.tabs-transparent .tab.disabled a, .tabs.tabs-transparent .tab.disabled a:hover {\n  color: rgba(255, 255, 255, 0.7); }\n\n.tabs.tabs-transparent .tab a:hover, .tabs.tabs-transparent .tab a.active {\n  color: #fff; }\n\n.tabs.tabs-transparent .indicator {\n  background-color: #fff; }\n\n.tabs.tabs-fixed-width {\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex; }\n\n.tabs.tabs-fixed-width .tab {\n  -webkit-flex-grow: 1;\n  -ms-flex-positive: 1;\n  flex-grow: 1; }\n\n.tabs .tab {\n  display: inline-block;\n  text-align: center;\n  line-height: 48px;\n  height: 48px;\n  padding: 0;\n  margin: 0;\n  text-transform: uppercase; }\n\n.tabs .tab a {\n  color: rgba(238, 110, 115, 0.7);\n  display: block;\n  width: 100%;\n  height: 100%;\n  padding: 0 24px;\n  font-size: 14px;\n  text-overflow: ellipsis;\n  overflow: hidden;\n  transition: color .28s ease; }\n\n.tabs .tab a:hover, .tabs .tab a.active {\n  background-color: transparent;\n  color: #ee6e73; }\n\n.tabs .tab.disabled a, .tabs .tab.disabled a:hover {\n  color: rgba(238, 110, 115, 0.7);\n  cursor: default; }\n\n.tabs .indicator {\n  position: absolute;\n  bottom: 0;\n  height: 2px;\n  background-color: #f6b2b5;\n  will-change: left, right; }\n\n@media only screen and (max-width: 992px) {\n  .tabs {\n    display: -webkit-flex;\n    display: -ms-flexbox;\n    display: flex; }\n  .tabs .tab {\n    -webkit-flex-grow: 1;\n    -ms-flex-positive: 1;\n    flex-grow: 1; }\n  .tabs .tab a {\n    padding: 0 12px; } }\n\n.material-tooltip {\n  padding: 10px 8px;\n  font-size: 1rem;\n  z-index: 2000;\n  background-color: transparent;\n  border-radius: 2px;\n  color: #fff;\n  min-height: 36px;\n  line-height: 120%;\n  opacity: 0;\n  position: absolute;\n  text-align: center;\n  max-width: calc(100% - 4px);\n  overflow: hidden;\n  left: 0;\n  top: 0;\n  pointer-events: none;\n  visibility: hidden; }\n\n.backdrop {\n  position: absolute;\n  opacity: 0;\n  height: 7px;\n  width: 14px;\n  border-radius: 0 0 50% 50%;\n  background-color: #323232;\n  z-index: -1;\n  -webkit-transform-origin: 50% 0%;\n  transform-origin: 50% 0%;\n  visibility: hidden; }\n\n.btn, .btn-large, .btn-flat {\n  border: none;\n  border-radius: 2px;\n  display: inline-block;\n  height: 36px;\n  line-height: 36px;\n  padding: 0 2rem;\n  text-transform: uppercase;\n  vertical-align: middle;\n  -webkit-tap-highlight-color: transparent; }\n\n.btn.disabled, .disabled.btn-large, .btn-floating.disabled, .btn-large.disabled, .btn-flat.disabled, .btn:disabled, .btn-large:disabled, .btn-floating:disabled, .btn-large:disabled, .btn-flat:disabled, .btn[disabled], [disabled].btn-large, .btn-floating[disabled], .btn-large[disabled], .btn-flat[disabled] {\n  pointer-events: none;\n  background-color: #DFDFDF !important;\n  box-shadow: none;\n  color: #9F9F9F !important;\n  cursor: default; }\n\n.btn.disabled:hover, .disabled.btn-large:hover, .btn-floating.disabled:hover, .btn-large.disabled:hover, .btn-flat.disabled:hover, .btn:disabled:hover, .btn-large:disabled:hover, .btn-floating:disabled:hover, .btn-large:disabled:hover, .btn-flat:disabled:hover, .btn[disabled]:hover, [disabled].btn-large:hover, .btn-floating[disabled]:hover, .btn-large[disabled]:hover, .btn-flat[disabled]:hover {\n  background-color: #DFDFDF !important;\n  color: #9F9F9F !important; }\n\n.btn, .btn-large, .btn-floating, .btn-large, .btn-flat {\n  font-size: 1rem;\n  outline: 0; }\n\n.btn i, .btn-large i, .btn-floating i, .btn-large i, .btn-flat i {\n  font-size: 1.3rem;\n  line-height: inherit; }\n\n.btn:focus, .btn-large:focus, .btn-floating:focus {\n  background-color: #1d7d74; }\n\n.btn, .btn-large {\n  text-decoration: none;\n  color: #fff;\n  background-color: #26a69a;\n  text-align: center;\n  letter-spacing: .5px;\n  transition: .2s ease-out;\n  cursor: pointer; }\n\n.btn:hover, .btn-large:hover {\n  background-color: #2bbbad; }\n\n.btn-floating {\n  display: inline-block;\n  color: #fff;\n  position: relative;\n  overflow: hidden;\n  z-index: 1;\n  width: 40px;\n  height: 40px;\n  line-height: 40px;\n  padding: 0;\n  background-color: #26a69a;\n  border-radius: 50%;\n  transition: .3s;\n  cursor: pointer;\n  vertical-align: middle; }\n\n.btn-floating:hover {\n  background-color: #26a69a; }\n\n.btn-floating:before {\n  border-radius: 0; }\n\n.btn-floating.btn-large {\n  width: 56px;\n  height: 56px; }\n\n.btn-floating.btn-large.halfway-fab {\n  bottom: -28px; }\n\n.btn-floating.btn-large i {\n  line-height: 56px; }\n\n.btn-floating.halfway-fab {\n  position: absolute;\n  right: 24px;\n  bottom: -20px; }\n\n.btn-floating.halfway-fab.left {\n  right: auto;\n  left: 24px; }\n\n.btn-floating i {\n  width: inherit;\n  display: inline-block;\n  text-align: center;\n  color: #fff;\n  font-size: 1.6rem;\n  line-height: 40px; }\n\nbutton.btn-floating {\n  border: none; }\n\n.fixed-action-btn {\n  position: fixed;\n  right: 23px;\n  bottom: 23px;\n  padding-top: 15px;\n  margin-bottom: 0;\n  z-index: 998; }\n\n.fixed-action-btn.active ul {\n  visibility: visible; }\n\n.fixed-action-btn.horizontal {\n  padding: 0 0 0 15px; }\n\n.fixed-action-btn.horizontal ul {\n  text-align: right;\n  right: 64px;\n  top: 50%;\n  -webkit-transform: translateY(-50%);\n  transform: translateY(-50%);\n  height: 100%;\n  left: auto;\n  width: 500px; }\n\n.fixed-action-btn.horizontal ul li {\n  display: inline-block;\n  margin: 15px 15px 0 0; }\n\n.fixed-action-btn.toolbar {\n  padding: 0;\n  height: 56px; }\n\n.fixed-action-btn.toolbar.active > a i {\n  opacity: 0; }\n\n.fixed-action-btn.toolbar ul {\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  top: 0;\n  bottom: 0; }\n\n.fixed-action-btn.toolbar ul li {\n  -webkit-flex: 1;\n  -ms-flex: 1;\n  flex: 1;\n  display: inline-block;\n  margin: 0;\n  height: 100%;\n  transition: none; }\n\n.fixed-action-btn.toolbar ul li a {\n  display: block;\n  overflow: hidden;\n  position: relative;\n  width: 100%;\n  height: 100%;\n  background-color: transparent;\n  box-shadow: none;\n  color: #fff;\n  line-height: 56px;\n  z-index: 1; }\n\n.fixed-action-btn.toolbar ul li a i {\n  line-height: inherit; }\n\n.fixed-action-btn ul {\n  left: 0;\n  right: 0;\n  text-align: center;\n  position: absolute;\n  bottom: 64px;\n  margin: 0;\n  visibility: hidden; }\n\n.fixed-action-btn ul li {\n  margin-bottom: 15px; }\n\n.fixed-action-btn ul a.btn-floating {\n  opacity: 0; }\n\n.fixed-action-btn .fab-backdrop {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: -1;\n  width: 40px;\n  height: 40px;\n  background-color: #26a69a;\n  border-radius: 50%;\n  -webkit-transform: scale(0);\n  transform: scale(0); }\n\n.btn-flat {\n  box-shadow: none;\n  background-color: transparent;\n  color: #343434;\n  cursor: pointer;\n  transition: background-color .2s; }\n\n.btn-flat:focus, .btn-flat:active {\n  background-color: transparent; }\n\n.btn-flat:focus, .btn-flat:hover {\n  background-color: rgba(0, 0, 0, 0.1);\n  box-shadow: none; }\n\n.btn-flat:active {\n  background-color: rgba(0, 0, 0, 0.2); }\n\n.btn-flat.disabled {\n  background-color: transparent !important;\n  color: #b3b3b3 !important;\n  cursor: default; }\n\n.btn-large {\n  height: 54px;\n  line-height: 54px; }\n\n.btn-large i {\n  font-size: 1.6rem; }\n\n.btn-block {\n  display: block; }\n\n.dropdown-content {\n  background-color: #fff;\n  margin: 0;\n  display: none;\n  min-width: 100px;\n  max-height: 650px;\n  overflow-y: auto;\n  opacity: 0;\n  position: absolute;\n  z-index: 999;\n  will-change: width, height; }\n\n.dropdown-content li {\n  clear: both;\n  color: rgba(0, 0, 0, 0.87);\n  cursor: pointer;\n  min-height: 50px;\n  line-height: 1.5rem;\n  width: 100%;\n  text-align: left;\n  text-transform: none; }\n\n.dropdown-content li:hover, .dropdown-content li.active, .dropdown-content li.selected {\n  background-color: #eee; }\n\n.dropdown-content li.active.selected {\n  background-color: #e1e1e1; }\n\n.dropdown-content li.divider {\n  min-height: 0;\n  height: 1px; }\n\n.dropdown-content li > a, .dropdown-content li > span {\n  font-size: 16px;\n  color: #26a69a;\n  display: block;\n  line-height: 22px;\n  padding: 14px 16px; }\n\n.dropdown-content li > span > label {\n  top: 1px;\n  left: 0;\n  height: 18px; }\n\n.dropdown-content li > a > i {\n  height: inherit;\n  line-height: inherit;\n  float: left;\n  margin: 0 24px 0 0;\n  width: 24px; }\n\n.input-field.col .dropdown-content [type=\"checkbox\"] + label {\n  top: 1px;\n  left: 0;\n  height: 18px; }\n\n/*!\n * Waves v0.6.0\n * http://fian.my.id/Waves\n *\n * Copyright 2014 Alfiana E. Sibuea and other contributors\n * Released under the MIT license\n * https://github.com/fians/Waves/blob/master/LICENSE\n */\n.waves-effect {\n  position: relative;\n  cursor: pointer;\n  display: inline-block;\n  overflow: hidden;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  -webkit-tap-highlight-color: transparent;\n  vertical-align: middle;\n  z-index: 1;\n  transition: .3s ease-out; }\n\n.waves-effect .waves-ripple {\n  position: absolute;\n  border-radius: 50%;\n  width: 20px;\n  height: 20px;\n  margin-top: -10px;\n  margin-left: -10px;\n  opacity: 0;\n  background: rgba(0, 0, 0, 0.2);\n  transition: all 0.7s ease-out;\n  transition-property: opacity, -webkit-transform;\n  transition-property: transform, opacity;\n  transition-property: transform, opacity, -webkit-transform;\n  -webkit-transform: scale(0);\n  transform: scale(0);\n  pointer-events: none; }\n\n.waves-effect.waves-light .waves-ripple {\n  background-color: rgba(255, 255, 255, 0.45); }\n\n.waves-effect.waves-red .waves-ripple {\n  background-color: rgba(244, 67, 54, 0.7); }\n\n.waves-effect.waves-yellow .waves-ripple {\n  background-color: rgba(255, 235, 59, 0.7); }\n\n.waves-effect.waves-orange .waves-ripple {\n  background-color: rgba(255, 152, 0, 0.7); }\n\n.waves-effect.waves-purple .waves-ripple {\n  background-color: rgba(156, 39, 176, 0.7); }\n\n.waves-effect.waves-green .waves-ripple {\n  background-color: rgba(76, 175, 80, 0.7); }\n\n.waves-effect.waves-teal .waves-ripple {\n  background-color: rgba(0, 150, 136, 0.7); }\n\n.waves-effect input[type=\"button\"], .waves-effect input[type=\"reset\"], .waves-effect input[type=\"submit\"] {\n  border: 0;\n  font-style: normal;\n  font-size: inherit;\n  text-transform: inherit;\n  background: none; }\n\n.waves-effect img {\n  position: relative;\n  z-index: -1; }\n\n.waves-notransition {\n  transition: none !important; }\n\n.waves-circle {\n  -webkit-transform: translateZ(0);\n  transform: translateZ(0);\n  -webkit-mask-image: -webkit-radial-gradient(circle, #fff 100%, #000 100%); }\n\n.waves-input-wrapper {\n  border-radius: 0.2em;\n  vertical-align: bottom; }\n\n.waves-input-wrapper .waves-button-input {\n  position: relative;\n  top: 0;\n  left: 0;\n  z-index: 1; }\n\n.waves-circle {\n  text-align: center;\n  width: 2.5em;\n  height: 2.5em;\n  line-height: 2.5em;\n  border-radius: 50%;\n  -webkit-mask-image: none; }\n\n.waves-block {\n  display: block; }\n\n.waves-effect .waves-ripple {\n  z-index: -1; }\n\n.modal {\n  display: none;\n  position: fixed;\n  left: 0;\n  right: 0;\n  background-color: #fafafa;\n  padding: 0;\n  max-height: 70%;\n  width: 55%;\n  margin: auto;\n  overflow-y: auto;\n  border-radius: 2px;\n  will-change: top, opacity; }\n\n@media only screen and (max-width: 992px) {\n  .modal {\n    width: 80%; } }\n\n.modal h1, .modal h2, .modal h3, .modal h4 {\n  margin-top: 0; }\n\n.modal .modal-content {\n  padding: 24px; }\n\n.modal .modal-close {\n  cursor: pointer; }\n\n.modal .modal-footer {\n  border-radius: 0 0 2px 2px;\n  background-color: #fafafa;\n  padding: 4px 6px;\n  height: 56px;\n  width: 100%; }\n\n.modal .modal-footer .btn, .modal .modal-footer .btn-large, .modal .modal-footer .btn-flat {\n  float: right;\n  margin: 6px 0; }\n\n.modal-overlay {\n  position: fixed;\n  z-index: 999;\n  top: -100px;\n  left: 0;\n  bottom: 0;\n  right: 0;\n  height: 125%;\n  width: 100%;\n  background: #000;\n  display: none;\n  will-change: opacity; }\n\n.modal.modal-fixed-footer {\n  padding: 0;\n  height: 70%; }\n\n.modal.modal-fixed-footer .modal-content {\n  position: absolute;\n  height: calc(100% - 56px);\n  max-height: 100%;\n  width: 100%;\n  overflow-y: auto; }\n\n.modal.modal-fixed-footer .modal-footer {\n  border-top: 1px solid rgba(0, 0, 0, 0.1);\n  position: absolute;\n  bottom: 0; }\n\n.modal.bottom-sheet {\n  top: auto;\n  bottom: -100%;\n  margin: 0;\n  width: 100%;\n  max-height: 45%;\n  border-radius: 0;\n  will-change: bottom, opacity; }\n\n.collapsible {\n  border-top: 1px solid #ddd;\n  border-right: 1px solid #ddd;\n  border-left: 1px solid #ddd;\n  margin: .5rem 0 1rem 0; }\n\n.collapsible-header {\n  display: block;\n  cursor: pointer;\n  min-height: 3rem;\n  line-height: 3rem;\n  padding: 0 1rem;\n  background-color: #fff;\n  border-bottom: 1px solid #ddd; }\n\n.collapsible-header i {\n  width: 2rem;\n  font-size: 1.6rem;\n  line-height: 3rem;\n  display: block;\n  float: left;\n  text-align: center;\n  margin-right: 1rem; }\n\n.collapsible-body {\n  display: none;\n  border-bottom: 1px solid #ddd;\n  box-sizing: border-box;\n  padding: 2rem; }\n\n.side-nav .collapsible, .side-nav.fixed .collapsible {\n  border: none;\n  box-shadow: none; }\n\n.side-nav .collapsible li, .side-nav.fixed .collapsible li {\n  padding: 0; }\n\n.side-nav .collapsible-header, .side-nav.fixed .collapsible-header {\n  background-color: transparent;\n  border: none;\n  line-height: inherit;\n  height: inherit;\n  padding: 0 16px; }\n\n.side-nav .collapsible-header:hover, .side-nav.fixed .collapsible-header:hover {\n  background-color: rgba(0, 0, 0, 0.05); }\n\n.side-nav .collapsible-header i, .side-nav.fixed .collapsible-header i {\n  line-height: inherit; }\n\n.side-nav .collapsible-body, .side-nav.fixed .collapsible-body {\n  border: 0;\n  background-color: #fff; }\n\n.side-nav .collapsible-body li a, .side-nav.fixed .collapsible-body li a {\n  padding: 0 23.5px 0 31px; }\n\n.collapsible.popout {\n  border: none;\n  box-shadow: none; }\n\n.collapsible.popout > li {\n  box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);\n  margin: 0 24px;\n  transition: margin 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94); }\n\n.collapsible.popout > li.active {\n  box-shadow: 0 5px 11px 0 rgba(0, 0, 0, 0.18), 0 4px 15px 0 rgba(0, 0, 0, 0.15);\n  margin: 16px 0; }\n\n.chip {\n  display: inline-block;\n  height: 32px;\n  font-size: 13px;\n  font-weight: 500;\n  color: rgba(0, 0, 0, 0.6);\n  line-height: 32px;\n  padding: 0 12px;\n  border-radius: 16px;\n  background-color: #e4e4e4;\n  margin-bottom: 5px;\n  margin-right: 5px; }\n\n.chip > img {\n  float: left;\n  margin: 0 8px 0 -12px;\n  height: 32px;\n  width: 32px;\n  border-radius: 50%; }\n\n.chip .close {\n  cursor: pointer;\n  float: right;\n  font-size: 16px;\n  line-height: 32px;\n  padding-left: 8px; }\n\n.chips {\n  border: none;\n  border-bottom: 1px solid #9e9e9e;\n  box-shadow: none;\n  margin: 0 0 20px 0;\n  min-height: 45px;\n  outline: none;\n  transition: all .3s; }\n\n.chips.focus {\n  border-bottom: 1px solid #26a69a;\n  box-shadow: 0 1px 0 0 #26a69a; }\n\n.chips:hover {\n  cursor: text; }\n\n.chips .chip.selected {\n  background-color: #26a69a;\n  color: #fff; }\n\n.chips .input {\n  background: none;\n  border: 0;\n  color: rgba(0, 0, 0, 0.6);\n  display: inline-block;\n  font-size: 1rem;\n  height: 3rem;\n  line-height: 32px;\n  outline: 0;\n  margin: 0;\n  padding: 0 !important;\n  width: 120px !important; }\n\n.chips .input:focus {\n  border: 0 !important;\n  box-shadow: none !important; }\n\n.chips .autocomplete-content {\n  margin-top: 0; }\n\n.prefix ~ .chips {\n  margin-left: 3rem;\n  width: 92%;\n  width: calc(100% - 3rem); }\n\n.chips:empty ~ label {\n  font-size: 0.8rem;\n  -webkit-transform: translateY(-140%);\n  transform: translateY(-140%); }\n\n.materialboxed {\n  display: block;\n  cursor: -webkit-zoom-in;\n  cursor: zoom-in;\n  position: relative;\n  transition: opacity .4s;\n  -webkit-backface-visibility: hidden; }\n\n.materialboxed:hover:not(.active) {\n  opacity: .8; }\n\n.materialboxed.active {\n  cursor: -webkit-zoom-out;\n  cursor: zoom-out; }\n\n#materialbox-overlay {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  background-color: #292929;\n  z-index: 1000;\n  will-change: opacity; }\n\n.materialbox-caption {\n  position: fixed;\n  display: none;\n  color: #fff;\n  line-height: 50px;\n  bottom: 0;\n  left: 0;\n  width: 100%;\n  text-align: center;\n  padding: 0% 15%;\n  height: 50px;\n  z-index: 1000;\n  -webkit-font-smoothing: antialiased; }\n\nselect:focus {\n  outline: 1px solid #c9f3ef; }\n\nbutton:focus {\n  outline: none;\n  background-color: #2ab7a9; }\n\nlabel {\n  font-size: .8rem;\n  color: #9e9e9e; }\n\n::-webkit-input-placeholder {\n  color: #d1d1d1; }\n\n:-moz-placeholder {\n  color: #d1d1d1; }\n\n::-moz-placeholder {\n  color: #d1d1d1; }\n\n:-ms-input-placeholder {\n  color: #d1d1d1; }\n\ninput:not([type]), input[type=text], input[type=password], input[type=email], input[type=url], input[type=time], input[type=date], input[type=datetime], input[type=datetime-local], input[type=tel], input[type=number], input[type=search], textarea.materialize-textarea {\n  background-color: transparent;\n  border: none;\n  border-bottom: 1px solid #9e9e9e;\n  border-radius: 0;\n  outline: none;\n  height: 3rem;\n  width: 100%;\n  font-size: 1rem;\n  margin: 0 0 20px 0;\n  padding: 0;\n  box-shadow: none;\n  box-sizing: content-box;\n  transition: all 0.3s; }\n\ninput:not([type]):disabled, input:not([type])[readonly=\"readonly\"], input[type=text]:disabled, input[type=text][readonly=\"readonly\"], input[type=password]:disabled, input[type=password][readonly=\"readonly\"], input[type=email]:disabled, input[type=email][readonly=\"readonly\"], input[type=url]:disabled, input[type=url][readonly=\"readonly\"], input[type=time]:disabled, input[type=time][readonly=\"readonly\"], input[type=date]:disabled, input[type=date][readonly=\"readonly\"], input[type=datetime]:disabled, input[type=datetime][readonly=\"readonly\"], input[type=datetime-local]:disabled, input[type=datetime-local][readonly=\"readonly\"], input[type=tel]:disabled, input[type=tel][readonly=\"readonly\"], input[type=number]:disabled, input[type=number][readonly=\"readonly\"], input[type=search]:disabled, input[type=search][readonly=\"readonly\"], textarea.materialize-textarea:disabled, textarea.materialize-textarea[readonly=\"readonly\"] {\n  color: rgba(0, 0, 0, 0.26);\n  border-bottom: 1px dotted rgba(0, 0, 0, 0.26); }\n\ninput:not([type]):disabled + label, input:not([type])[readonly=\"readonly\"] + label, input[type=text]:disabled + label, input[type=text][readonly=\"readonly\"] + label, input[type=password]:disabled + label, input[type=password][readonly=\"readonly\"] + label, input[type=email]:disabled + label, input[type=email][readonly=\"readonly\"] + label, input[type=url]:disabled + label, input[type=url][readonly=\"readonly\"] + label, input[type=time]:disabled + label, input[type=time][readonly=\"readonly\"] + label, input[type=date]:disabled + label, input[type=date][readonly=\"readonly\"] + label, input[type=datetime]:disabled + label, input[type=datetime][readonly=\"readonly\"] + label, input[type=datetime-local]:disabled + label, input[type=datetime-local][readonly=\"readonly\"] + label, input[type=tel]:disabled + label, input[type=tel][readonly=\"readonly\"] + label, input[type=number]:disabled + label, input[type=number][readonly=\"readonly\"] + label, input[type=search]:disabled + label, input[type=search][readonly=\"readonly\"] + label, textarea.materialize-textarea:disabled + label, textarea.materialize-textarea[readonly=\"readonly\"] + label {\n  color: rgba(0, 0, 0, 0.26); }\n\ninput:not([type]):focus:not([readonly]), input[type=text]:focus:not([readonly]), input[type=password]:focus:not([readonly]), input[type=email]:focus:not([readonly]), input[type=url]:focus:not([readonly]), input[type=time]:focus:not([readonly]), input[type=date]:focus:not([readonly]), input[type=datetime]:focus:not([readonly]), input[type=datetime-local]:focus:not([readonly]), input[type=tel]:focus:not([readonly]), input[type=number]:focus:not([readonly]), input[type=search]:focus:not([readonly]), textarea.materialize-textarea:focus:not([readonly]) {\n  border-bottom: 1px solid #26a69a;\n  box-shadow: 0 1px 0 0 #26a69a; }\n\ninput:not([type]):focus:not([readonly]) + label, input[type=text]:focus:not([readonly]) + label, input[type=password]:focus:not([readonly]) + label, input[type=email]:focus:not([readonly]) + label, input[type=url]:focus:not([readonly]) + label, input[type=time]:focus:not([readonly]) + label, input[type=date]:focus:not([readonly]) + label, input[type=datetime]:focus:not([readonly]) + label, input[type=datetime-local]:focus:not([readonly]) + label, input[type=tel]:focus:not([readonly]) + label, input[type=number]:focus:not([readonly]) + label, input[type=search]:focus:not([readonly]) + label, textarea.materialize-textarea:focus:not([readonly]) + label {\n  color: #26a69a; }\n\ninput:not([type]).valid, input:not([type]):focus.valid, input[type=text].valid, input[type=text]:focus.valid, input[type=password].valid, input[type=password]:focus.valid, input[type=email].valid, input[type=email]:focus.valid, input[type=url].valid, input[type=url]:focus.valid, input[type=time].valid, input[type=time]:focus.valid, input[type=date].valid, input[type=date]:focus.valid, input[type=datetime].valid, input[type=datetime]:focus.valid, input[type=datetime-local].valid, input[type=datetime-local]:focus.valid, input[type=tel].valid, input[type=tel]:focus.valid, input[type=number].valid, input[type=number]:focus.valid, input[type=search].valid, input[type=search]:focus.valid, textarea.materialize-textarea.valid, textarea.materialize-textarea:focus.valid {\n  border-bottom: 1px solid #4CAF50;\n  box-shadow: 0 1px 0 0 #4CAF50; }\n\ninput:not([type]).valid + label:after, input:not([type]):focus.valid + label:after, input[type=text].valid + label:after, input[type=text]:focus.valid + label:after, input[type=password].valid + label:after, input[type=password]:focus.valid + label:after, input[type=email].valid + label:after, input[type=email]:focus.valid + label:after, input[type=url].valid + label:after, input[type=url]:focus.valid + label:after, input[type=time].valid + label:after, input[type=time]:focus.valid + label:after, input[type=date].valid + label:after, input[type=date]:focus.valid + label:after, input[type=datetime].valid + label:after, input[type=datetime]:focus.valid + label:after, input[type=datetime-local].valid + label:after, input[type=datetime-local]:focus.valid + label:after, input[type=tel].valid + label:after, input[type=tel]:focus.valid + label:after, input[type=number].valid + label:after, input[type=number]:focus.valid + label:after, input[type=search].valid + label:after, input[type=search]:focus.valid + label:after, textarea.materialize-textarea.valid + label:after, textarea.materialize-textarea:focus.valid + label:after {\n  content: attr(data-success);\n  color: #4CAF50;\n  opacity: 1; }\n\ninput:not([type]).invalid, input:not([type]):focus.invalid, input[type=text].invalid, input[type=text]:focus.invalid, input[type=password].invalid, input[type=password]:focus.invalid, input[type=email].invalid, input[type=email]:focus.invalid, input[type=url].invalid, input[type=url]:focus.invalid, input[type=time].invalid, input[type=time]:focus.invalid, input[type=date].invalid, input[type=date]:focus.invalid, input[type=datetime].invalid, input[type=datetime]:focus.invalid, input[type=datetime-local].invalid, input[type=datetime-local]:focus.invalid, input[type=tel].invalid, input[type=tel]:focus.invalid, input[type=number].invalid, input[type=number]:focus.invalid, input[type=search].invalid, input[type=search]:focus.invalid, textarea.materialize-textarea.invalid, textarea.materialize-textarea:focus.invalid {\n  border-bottom: 1px solid #F44336;\n  box-shadow: 0 1px 0 0 #F44336; }\n\ninput:not([type]).invalid + label:after, input:not([type]):focus.invalid + label:after, input[type=text].invalid + label:after, input[type=text]:focus.invalid + label:after, input[type=password].invalid + label:after, input[type=password]:focus.invalid + label:after, input[type=email].invalid + label:after, input[type=email]:focus.invalid + label:after, input[type=url].invalid + label:after, input[type=url]:focus.invalid + label:after, input[type=time].invalid + label:after, input[type=time]:focus.invalid + label:after, input[type=date].invalid + label:after, input[type=date]:focus.invalid + label:after, input[type=datetime].invalid + label:after, input[type=datetime]:focus.invalid + label:after, input[type=datetime-local].invalid + label:after, input[type=datetime-local]:focus.invalid + label:after, input[type=tel].invalid + label:after, input[type=tel]:focus.invalid + label:after, input[type=number].invalid + label:after, input[type=number]:focus.invalid + label:after, input[type=search].invalid + label:after, input[type=search]:focus.invalid + label:after, textarea.materialize-textarea.invalid + label:after, textarea.materialize-textarea:focus.invalid + label:after {\n  content: attr(data-error);\n  color: #F44336;\n  opacity: 1; }\n\ninput:not([type]).validate + label, input[type=text].validate + label, input[type=password].validate + label, input[type=email].validate + label, input[type=url].validate + label, input[type=time].validate + label, input[type=date].validate + label, input[type=datetime].validate + label, input[type=datetime-local].validate + label, input[type=tel].validate + label, input[type=number].validate + label, input[type=search].validate + label, textarea.materialize-textarea.validate + label {\n  width: 100%;\n  pointer-events: none; }\n\ninput:not([type]) + label:after, input[type=text] + label:after, input[type=password] + label:after, input[type=email] + label:after, input[type=url] + label:after, input[type=time] + label:after, input[type=date] + label:after, input[type=datetime] + label:after, input[type=datetime-local] + label:after, input[type=tel] + label:after, input[type=number] + label:after, input[type=search] + label:after, textarea.materialize-textarea + label:after {\n  display: block;\n  content: \"\";\n  position: absolute;\n  top: 60px;\n  opacity: 0;\n  transition: .2s opacity ease-out, .2s color ease-out; }\n\n.input-field {\n  position: relative;\n  margin-top: 1rem; }\n\n.input-field.inline {\n  display: inline-block;\n  vertical-align: middle;\n  margin-left: 5px; }\n\n.input-field.inline input, .input-field.inline .select-dropdown {\n  margin-bottom: 1rem; }\n\n.input-field.col label {\n  left: .75rem; }\n\n.input-field.col .prefix ~ label, .input-field.col .prefix ~ .validate ~ label {\n  width: calc(100% - 3rem - 1.5rem); }\n\n.input-field label {\n  color: #9e9e9e;\n  position: absolute;\n  top: 0.8rem;\n  left: 0;\n  font-size: 1rem;\n  cursor: text;\n  transition: .2s ease-out;\n  text-align: initial; }\n\n.input-field label:not(.label-icon).active {\n  font-size: .8rem;\n  -webkit-transform: translateY(-140%);\n  transform: translateY(-140%); }\n\n.input-field .prefix {\n  position: absolute;\n  width: 3rem;\n  font-size: 2rem;\n  transition: color .2s; }\n\n.input-field .prefix.active {\n  color: #26a69a; }\n\n.input-field .prefix ~ input, .input-field .prefix ~ textarea, .input-field .prefix ~ label, .input-field .prefix ~ .validate ~ label, .input-field .prefix ~ .autocomplete-content {\n  margin-left: 3rem;\n  width: 92%;\n  width: calc(100% - 3rem); }\n\n.input-field .prefix ~ label {\n  margin-left: 3rem; }\n\n@media only screen and (max-width: 992px) {\n  .input-field .prefix ~ input {\n    width: 86%;\n    width: calc(100% - 3rem); } }\n\n@media only screen and (max-width: 600px) {\n  .input-field .prefix ~ input {\n    width: 80%;\n    width: calc(100% - 3rem); } }\n\n.input-field input[type=search] {\n  display: block;\n  line-height: inherit;\n  padding-left: 4rem;\n  width: calc(100% - 4rem); }\n\n.input-field input[type=search]:focus {\n  background-color: #fff;\n  border: 0;\n  box-shadow: none;\n  color: #444; }\n\n.input-field input[type=search]:focus + label i, .input-field input[type=search]:focus ~ .mdi-navigation-close, .input-field input[type=search]:focus ~ .material-icons {\n  color: #444; }\n\n.input-field input[type=search] + label {\n  left: 1rem; }\n\n.input-field input[type=search] ~ .mdi-navigation-close, .input-field input[type=search] ~ .material-icons {\n  position: absolute;\n  top: 0;\n  right: 1rem;\n  color: transparent;\n  cursor: pointer;\n  font-size: 2rem;\n  transition: .3s color; }\n\ntextarea {\n  width: 100%;\n  height: 3rem;\n  background-color: transparent; }\n\ntextarea.materialize-textarea {\n  overflow-y: hidden;\n  padding: .8rem 0 1.6rem 0;\n  resize: none;\n  min-height: 3rem; }\n\n.hiddendiv {\n  display: none;\n  white-space: pre-wrap;\n  word-wrap: break-word;\n  overflow-wrap: break-word;\n  padding-top: 1.2rem;\n  position: absolute;\n  top: 0; }\n\n.autocomplete-content {\n  margin-top: -20px;\n  display: block;\n  opacity: 1;\n  position: static; }\n\n.autocomplete-content li .highlight {\n  color: #444; }\n\n.autocomplete-content li img {\n  height: 40px;\n  width: 40px;\n  margin: 5px 15px; }\n\n[type=\"radio\"]:not(:checked), [type=\"radio\"]:checked {\n  position: absolute;\n  left: -9999px;\n  opacity: 0; }\n\n[type=\"radio\"]:not(:checked) + label, [type=\"radio\"]:checked + label {\n  position: relative;\n  padding-left: 35px;\n  cursor: pointer;\n  display: inline-block;\n  height: 25px;\n  line-height: 25px;\n  font-size: 1rem;\n  transition: .28s ease;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n[type=\"radio\"] + label:before, [type=\"radio\"] + label:after {\n  content: '';\n  position: absolute;\n  left: 0;\n  top: 0;\n  margin: 4px;\n  width: 16px;\n  height: 16px;\n  z-index: 0;\n  transition: .28s ease; }\n\n[type=\"radio\"]:not(:checked) + label:before, [type=\"radio\"]:not(:checked) + label:after, [type=\"radio\"]:checked + label:before, [type=\"radio\"]:checked + label:after, [type=\"radio\"].with-gap:checked + label:before, [type=\"radio\"].with-gap:checked + label:after {\n  border-radius: 50%; }\n\n[type=\"radio\"]:not(:checked) + label:before, [type=\"radio\"]:not(:checked) + label:after {\n  border: 2px solid #5a5a5a; }\n\n[type=\"radio\"]:not(:checked) + label:after {\n  -webkit-transform: scale(0);\n  transform: scale(0); }\n\n[type=\"radio\"]:checked + label:before {\n  border: 2px solid transparent; }\n\n[type=\"radio\"]:checked + label:after, [type=\"radio\"].with-gap:checked + label:before, [type=\"radio\"].with-gap:checked + label:after {\n  border: 2px solid #26a69a; }\n\n[type=\"radio\"]:checked + label:after, [type=\"radio\"].with-gap:checked + label:after {\n  background-color: #26a69a; }\n\n[type=\"radio\"]:checked + label:after {\n  -webkit-transform: scale(1.02);\n  transform: scale(1.02); }\n\n[type=\"radio\"].with-gap:checked + label:after {\n  -webkit-transform: scale(0.5);\n  transform: scale(0.5); }\n\n[type=\"radio\"].tabbed:focus + label:before {\n  box-shadow: 0 0 0 10px rgba(0, 0, 0, 0.1); }\n\n[type=\"radio\"].with-gap:disabled:checked + label:before {\n  border: 2px solid rgba(0, 0, 0, 0.26); }\n\n[type=\"radio\"].with-gap:disabled:checked + label:after {\n  border: none;\n  background-color: rgba(0, 0, 0, 0.26); }\n\n[type=\"radio\"]:disabled:not(:checked) + label:before, [type=\"radio\"]:disabled:checked + label:before {\n  background-color: transparent;\n  border-color: rgba(0, 0, 0, 0.26); }\n\n[type=\"radio\"]:disabled + label {\n  color: rgba(0, 0, 0, 0.26); }\n\n[type=\"radio\"]:disabled:not(:checked) + label:before {\n  border-color: rgba(0, 0, 0, 0.26); }\n\n[type=\"radio\"]:disabled:checked + label:after {\n  background-color: rgba(0, 0, 0, 0.26);\n  border-color: #BDBDBD; }\n\nform p {\n  margin-bottom: 10px;\n  text-align: left; }\n\nform p:last-child {\n  margin-bottom: 0; }\n\n[type=\"checkbox\"]:not(:checked), [type=\"checkbox\"]:checked {\n  position: absolute;\n  left: -9999px;\n  opacity: 0; }\n\n[type=\"checkbox\"] + label {\n  position: relative;\n  padding-left: 35px;\n  cursor: pointer;\n  display: inline-block;\n  height: 25px;\n  line-height: 25px;\n  font-size: 1rem;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -khtml-user-select: none;\n  -ms-user-select: none; }\n\n[type=\"checkbox\"] + label:before, [type=\"checkbox\"]:not(.filled-in) + label:after {\n  content: '';\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 18px;\n  height: 18px;\n  z-index: 0;\n  border: 2px solid #5a5a5a;\n  border-radius: 1px;\n  margin-top: 2px;\n  transition: .2s; }\n\n[type=\"checkbox\"]:not(.filled-in) + label:after {\n  border: 0;\n  -webkit-transform: scale(0);\n  transform: scale(0); }\n\n[type=\"checkbox\"]:not(:checked):disabled + label:before {\n  border: none;\n  background-color: rgba(0, 0, 0, 0.26); }\n\n[type=\"checkbox\"].tabbed:focus + label:after {\n  -webkit-transform: scale(1);\n  transform: scale(1);\n  border: 0;\n  border-radius: 50%;\n  box-shadow: 0 0 0 10px rgba(0, 0, 0, 0.1);\n  background-color: rgba(0, 0, 0, 0.1); }\n\n[type=\"checkbox\"]:checked + label:before {\n  top: -4px;\n  left: -5px;\n  width: 12px;\n  height: 22px;\n  border-top: 2px solid transparent;\n  border-left: 2px solid transparent;\n  border-right: 2px solid #26a69a;\n  border-bottom: 2px solid #26a69a;\n  -webkit-transform: rotate(40deg);\n  transform: rotate(40deg);\n  -webkit-backface-visibility: hidden;\n  backface-visibility: hidden;\n  -webkit-transform-origin: 100% 100%;\n  transform-origin: 100% 100%; }\n\n[type=\"checkbox\"]:checked:disabled + label:before {\n  border-right: 2px solid rgba(0, 0, 0, 0.26);\n  border-bottom: 2px solid rgba(0, 0, 0, 0.26); }\n\n[type=\"checkbox\"]:indeterminate + label:before {\n  top: -11px;\n  left: -12px;\n  width: 10px;\n  height: 22px;\n  border-top: none;\n  border-left: none;\n  border-right: 2px solid #26a69a;\n  border-bottom: none;\n  -webkit-transform: rotate(90deg);\n  transform: rotate(90deg);\n  -webkit-backface-visibility: hidden;\n  backface-visibility: hidden;\n  -webkit-transform-origin: 100% 100%;\n  transform-origin: 100% 100%; }\n\n[type=\"checkbox\"]:indeterminate:disabled + label:before {\n  border-right: 2px solid rgba(0, 0, 0, 0.26);\n  background-color: transparent; }\n\n[type=\"checkbox\"].filled-in + label:after {\n  border-radius: 2px; }\n\n[type=\"checkbox\"].filled-in + label:before, [type=\"checkbox\"].filled-in + label:after {\n  content: '';\n  left: 0;\n  position: absolute;\n  transition: border .25s, background-color .25s, width .20s .1s, height .20s .1s, top .20s .1s, left .20s .1s;\n  z-index: 1; }\n\n[type=\"checkbox\"].filled-in:not(:checked) + label:before {\n  width: 0;\n  height: 0;\n  border: 3px solid transparent;\n  left: 6px;\n  top: 10px;\n  -webkit-transform: rotateZ(37deg);\n  transform: rotateZ(37deg);\n  -webkit-transform-origin: 20% 40%;\n  transform-origin: 100% 100%; }\n\n[type=\"checkbox\"].filled-in:not(:checked) + label:after {\n  height: 20px;\n  width: 20px;\n  background-color: transparent;\n  border: 2px solid #5a5a5a;\n  top: 0px;\n  z-index: 0; }\n\n[type=\"checkbox\"].filled-in:checked + label:before {\n  top: 0;\n  left: 1px;\n  width: 8px;\n  height: 13px;\n  border-top: 2px solid transparent;\n  border-left: 2px solid transparent;\n  border-right: 2px solid #fff;\n  border-bottom: 2px solid #fff;\n  -webkit-transform: rotateZ(37deg);\n  transform: rotateZ(37deg);\n  -webkit-transform-origin: 100% 100%;\n  transform-origin: 100% 100%; }\n\n[type=\"checkbox\"].filled-in:checked + label:after {\n  top: 0;\n  width: 20px;\n  height: 20px;\n  border: 2px solid #26a69a;\n  background-color: #26a69a;\n  z-index: 0; }\n\n[type=\"checkbox\"].filled-in.tabbed:focus + label:after {\n  border-radius: 2px;\n  border-color: #5a5a5a;\n  background-color: rgba(0, 0, 0, 0.1); }\n\n[type=\"checkbox\"].filled-in.tabbed:checked:focus + label:after {\n  border-radius: 2px;\n  background-color: #26a69a;\n  border-color: #26a69a; }\n\n[type=\"checkbox\"].filled-in:disabled:not(:checked) + label:before {\n  background-color: transparent;\n  border: 2px solid transparent; }\n\n[type=\"checkbox\"].filled-in:disabled:not(:checked) + label:after {\n  border-color: transparent;\n  background-color: #BDBDBD; }\n\n[type=\"checkbox\"].filled-in:disabled:checked + label:before {\n  background-color: transparent; }\n\n[type=\"checkbox\"].filled-in:disabled:checked + label:after {\n  background-color: #BDBDBD;\n  border-color: #BDBDBD; }\n\n.switch, .switch * {\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -khtml-user-select: none;\n  -ms-user-select: none; }\n\n.switch label {\n  cursor: pointer; }\n\n.switch label input[type=checkbox] {\n  opacity: 0;\n  width: 0;\n  height: 0; }\n\n.switch label input[type=checkbox]:checked + .lever {\n  background-color: #84c7c1; }\n\n.switch label input[type=checkbox]:checked + .lever:after {\n  background-color: #26a69a;\n  left: 24px; }\n\n.switch label .lever {\n  content: \"\";\n  display: inline-block;\n  position: relative;\n  width: 40px;\n  height: 15px;\n  background-color: #818181;\n  border-radius: 15px;\n  margin-right: 10px;\n  transition: background 0.3s ease;\n  vertical-align: middle;\n  margin: 0 16px; }\n\n.switch label .lever:after {\n  content: \"\";\n  position: absolute;\n  display: inline-block;\n  width: 21px;\n  height: 21px;\n  background-color: #F1F1F1;\n  border-radius: 21px;\n  box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.4);\n  left: -5px;\n  top: -3px;\n  transition: left 0.3s ease, background .3s ease, box-shadow 0.1s ease; }\n\ninput[type=checkbox]:checked:not(:disabled) ~ .lever:active::after, input[type=checkbox]:checked:not(:disabled).tabbed:focus ~ .lever::after {\n  box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.4), 0 0 0 15px rgba(38, 166, 154, 0.1); }\n\ninput[type=checkbox]:not(:disabled) ~ .lever:active:after, input[type=checkbox]:not(:disabled).tabbed:focus ~ .lever::after {\n  box-shadow: 0 1px 3px 1px rgba(0, 0, 0, 0.4), 0 0 0 15px rgba(0, 0, 0, 0.08); }\n\n.switch input[type=checkbox][disabled] + .lever {\n  cursor: default; }\n\n.switch label input[type=checkbox][disabled] + .lever:after, .switch label input[type=checkbox][disabled]:checked + .lever:after {\n  background-color: #BDBDBD; }\n\nselect {\n  display: none; }\n\nselect.browser-default {\n  display: block; }\n\nselect {\n  background-color: rgba(255, 255, 255, 0.9);\n  width: 100%;\n  padding: 5px;\n  border: 1px solid #f2f2f2;\n  border-radius: 2px;\n  height: 3rem; }\n\n.select-label {\n  position: absolute; }\n\n.select-wrapper {\n  position: relative; }\n\n.select-wrapper input.select-dropdown {\n  position: relative;\n  cursor: pointer;\n  background-color: transparent;\n  border: none;\n  border-bottom: 1px solid #9e9e9e;\n  outline: none;\n  height: 3rem;\n  line-height: 3rem;\n  width: 100%;\n  font-size: 1rem;\n  margin: 0 0 20px 0;\n  padding: 0;\n  display: block; }\n\n.select-wrapper span.caret {\n  color: initial;\n  position: absolute;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  height: 10px;\n  margin: auto 0;\n  font-size: 10px;\n  line-height: 10px; }\n\n.select-wrapper span.caret.disabled {\n  color: rgba(0, 0, 0, 0.26); }\n\n.select-wrapper + label {\n  position: absolute;\n  top: -14px;\n  font-size: .8rem; }\n\nselect:disabled {\n  color: rgba(0, 0, 0, 0.3); }\n\n.select-wrapper input.select-dropdown:disabled {\n  color: rgba(0, 0, 0, 0.3);\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.3); }\n\n.select-wrapper i {\n  color: rgba(0, 0, 0, 0.3); }\n\n.select-dropdown li.disabled, .select-dropdown li.disabled > span, .select-dropdown li.optgroup {\n  color: rgba(0, 0, 0, 0.3);\n  background-color: transparent; }\n\n.prefix ~ .select-wrapper {\n  margin-left: 3rem;\n  width: 92%;\n  width: calc(100% - 3rem); }\n\n.prefix ~ label {\n  margin-left: 3rem; }\n\n.select-dropdown li img {\n  height: 40px;\n  width: 40px;\n  margin: 5px 15px;\n  float: right; }\n\n.select-dropdown li.optgroup {\n  border-top: 1px solid #eee; }\n\n.select-dropdown li.optgroup.selected > span {\n  color: rgba(0, 0, 0, 0.7); }\n\n.select-dropdown li.optgroup > span {\n  color: rgba(0, 0, 0, 0.4); }\n\n.select-dropdown li.optgroup ~ li.optgroup-option {\n  padding-left: 1rem; }\n\n.file-field {\n  position: relative; }\n\n.file-field .file-path-wrapper {\n  overflow: hidden;\n  padding-left: 10px; }\n\n.file-field input.file-path {\n  width: 100%; }\n\n.file-field .btn, .file-field .btn-large {\n  float: left;\n  height: 3rem;\n  line-height: 3rem; }\n\n.file-field span {\n  cursor: pointer; }\n\n.file-field input[type=file] {\n  position: absolute;\n  top: 0;\n  right: 0;\n  left: 0;\n  bottom: 0;\n  width: 100%;\n  margin: 0;\n  padding: 0;\n  font-size: 20px;\n  cursor: pointer;\n  opacity: 0;\n  filter: alpha(opacity=0); }\n\n.range-field {\n  position: relative; }\n\ninput[type=range], input[type=range] + .thumb {\n  cursor: pointer; }\n\ninput[type=range] {\n  position: relative;\n  background-color: transparent;\n  border: none;\n  outline: none;\n  width: 100%;\n  margin: 15px 0;\n  padding: 0; }\n\ninput[type=range]:focus {\n  outline: none; }\n\ninput[type=range] + .thumb {\n  position: absolute;\n  top: 10px;\n  left: 0;\n  border: none;\n  height: 0;\n  width: 0;\n  border-radius: 50%;\n  background-color: #26a69a;\n  margin-left: 7px;\n  -webkit-transform-origin: 50% 50%;\n  transform-origin: 50% 50%;\n  -webkit-transform: rotate(-45deg);\n  transform: rotate(-45deg); }\n\ninput[type=range] + .thumb .value {\n  display: block;\n  width: 30px;\n  text-align: center;\n  color: #26a69a;\n  font-size: 0;\n  -webkit-transform: rotate(45deg);\n  transform: rotate(45deg); }\n\ninput[type=range] + .thumb.active {\n  border-radius: 50% 50% 50% 0; }\n\ninput[type=range] + .thumb.active .value {\n  color: #fff;\n  margin-left: -1px;\n  margin-top: 8px;\n  font-size: 10px; }\n\ninput[type=range] {\n  -webkit-appearance: none; }\n\ninput[type=range]::-webkit-slider-runnable-track {\n  height: 3px;\n  background: #c2c0c2;\n  border: none; }\n\ninput[type=range]::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  border: none;\n  height: 14px;\n  width: 14px;\n  border-radius: 50%;\n  background-color: #26a69a;\n  -webkit-transform-origin: 50% 50%;\n  transform-origin: 50% 50%;\n  margin: -5px 0 0 0;\n  transition: .3s; }\n\ninput[type=range]:focus::-webkit-slider-runnable-track {\n  background: #ccc; }\n\ninput[type=range] {\n  border: 1px solid white; }\n\ninput[type=range]::-moz-range-track {\n  height: 3px;\n  background: #ddd;\n  border: none; }\n\ninput[type=range]::-moz-range-thumb {\n  border: none;\n  height: 14px;\n  width: 14px;\n  border-radius: 50%;\n  background: #26a69a;\n  margin-top: -5px; }\n\ninput[type=range]:-moz-focusring {\n  outline: 1px solid #fff;\n  outline-offset: -1px; }\n\ninput[type=range]:focus::-moz-range-track {\n  background: #ccc; }\n\ninput[type=range]::-ms-track {\n  height: 3px;\n  background: transparent;\n  border-color: transparent;\n  border-width: 6px 0;\n  color: transparent; }\n\ninput[type=range]::-ms-fill-lower {\n  background: #777; }\n\ninput[type=range]::-ms-fill-upper {\n  background: #ddd; }\n\ninput[type=range]::-ms-thumb {\n  border: none;\n  height: 14px;\n  width: 14px;\n  border-radius: 50%;\n  background: #26a69a; }\n\ninput[type=range]:focus::-ms-fill-lower {\n  background: #888; }\n\ninput[type=range]:focus::-ms-fill-upper {\n  background: #ccc; }\n\n.table-of-contents.fixed {\n  position: fixed; }\n\n.table-of-contents li {\n  padding: 2px 0; }\n\n.table-of-contents a {\n  display: inline-block;\n  font-weight: 300;\n  color: #757575;\n  padding-left: 20px;\n  height: 1.5rem;\n  line-height: 1.5rem;\n  letter-spacing: .4;\n  display: inline-block; }\n\n.table-of-contents a:hover {\n  color: #a8a8a8;\n  padding-left: 19px;\n  border-left: 1px solid #ee6e73; }\n\n.table-of-contents a.active {\n  font-weight: 500;\n  padding-left: 18px;\n  border-left: 2px solid #ee6e73; }\n\n.side-nav {\n  position: fixed;\n  width: 300px;\n  left: 0;\n  top: 0;\n  margin: 0;\n  -webkit-transform: translateX(-100%);\n  transform: translateX(-100%);\n  height: 100%;\n  height: calc(100% + 60px);\n  height: -moz-calc(100%);\n  padding-bottom: 60px;\n  background-color: #fff;\n  z-index: 999;\n  overflow-y: auto;\n  will-change: transform;\n  -webkit-backface-visibility: hidden;\n  backface-visibility: hidden;\n  -webkit-transform: translateX(-105%);\n  transform: translateX(-105%); }\n\n.side-nav.right-aligned {\n  right: 0;\n  -webkit-transform: translateX(105%);\n  transform: translateX(105%);\n  left: auto;\n  -webkit-transform: translateX(100%);\n  transform: translateX(100%); }\n\n.side-nav .collapsible {\n  margin: 0; }\n\n.side-nav li {\n  float: none;\n  line-height: 48px; }\n\n.side-nav li.active {\n  background-color: rgba(0, 0, 0, 0.05); }\n\n.side-nav li > a {\n  color: rgba(0, 0, 0, 0.87);\n  display: block;\n  font-size: 14px;\n  font-weight: 500;\n  height: 48px;\n  line-height: 48px;\n  padding: 0 32px; }\n\n.side-nav li > a:hover {\n  background-color: rgba(0, 0, 0, 0.05); }\n\n.side-nav li > a.btn, .side-nav li > a.btn-large, .side-nav li > a.btn-large, .side-nav li > a.btn-flat, .side-nav li > a.btn-floating {\n  margin: 10px 15px; }\n\n.side-nav li > a.btn, .side-nav li > a.btn-large, .side-nav li > a.btn-large, .side-nav li > a.btn-floating {\n  color: #fff; }\n\n.side-nav li > a.btn-flat {\n  color: #343434; }\n\n.side-nav li > a.btn:hover, .side-nav li > a.btn-large:hover, .side-nav li > a.btn-large:hover {\n  background-color: #2bbbad; }\n\n.side-nav li > a.btn-floating:hover {\n  background-color: #26a69a; }\n\n.side-nav li > a > i, .side-nav li > a > [class^=\"mdi-\"], .side-nav li > a li > a > [class*=\"mdi-\"], .side-nav li > a > i.material-icons {\n  float: left;\n  height: 48px;\n  line-height: 48px;\n  margin: 0 32px 0 0;\n  width: 24px;\n  color: rgba(0, 0, 0, 0.54); }\n\n.side-nav .divider {\n  margin: 8px 0 0 0; }\n\n.side-nav .subheader {\n  cursor: initial;\n  pointer-events: none;\n  color: rgba(0, 0, 0, 0.54);\n  font-size: 14px;\n  font-weight: 500;\n  line-height: 48px; }\n\n.side-nav .subheader:hover {\n  background-color: transparent; }\n\n.side-nav .userView {\n  position: relative;\n  padding: 32px 32px 0;\n  margin-bottom: 8px; }\n\n.side-nav .userView > a {\n  height: auto;\n  padding: 0; }\n\n.side-nav .userView > a:hover {\n  background-color: transparent; }\n\n.side-nav .userView .background {\n  overflow: hidden;\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: -1; }\n\n.side-nav .userView .circle, .side-nav .userView .name, .side-nav .userView .email {\n  display: block; }\n\n.side-nav .userView .circle {\n  height: 64px;\n  width: 64px; }\n\n.side-nav .userView .name, .side-nav .userView .email {\n  font-size: 14px;\n  line-height: 24px; }\n\n.side-nav .userView .name {\n  margin-top: 16px;\n  font-weight: 500; }\n\n.side-nav .userView .email {\n  padding-bottom: 16px;\n  font-weight: 400; }\n\n.drag-target {\n  height: 100%;\n  width: 10px;\n  position: fixed;\n  top: 0;\n  z-index: 998; }\n\n.side-nav.fixed {\n  left: 0;\n  -webkit-transform: translateX(0);\n  transform: translateX(0);\n  position: fixed; }\n\n.side-nav.fixed.right-aligned {\n  right: 0;\n  left: auto; }\n\n@media only screen and (max-width: 992px) {\n  .side-nav.fixed {\n    -webkit-transform: translateX(-105%);\n    transform: translateX(-105%); }\n  .side-nav.fixed.right-aligned {\n    -webkit-transform: translateX(105%);\n    transform: translateX(105%); }\n  .side-nav a {\n    padding: 0 16px; }\n  .side-nav .userView {\n    padding: 16px 16px 0; } }\n\n.side-nav .collapsible-body > ul:not(.collapsible) > li.active, .side-nav.fixed .collapsible-body > ul:not(.collapsible) > li.active {\n  background-color: #ee6e73; }\n\n.side-nav .collapsible-body > ul:not(.collapsible) > li.active a, .side-nav.fixed .collapsible-body > ul:not(.collapsible) > li.active a {\n  color: #fff; }\n\n.side-nav .collapsible-body {\n  padding: 0; }\n\n#sidenav-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 120vh;\n  background-color: rgba(0, 0, 0, 0.5);\n  z-index: 997;\n  will-change: opacity; }\n\n.preloader-wrapper {\n  display: inline-block;\n  position: relative;\n  width: 50px;\n  height: 50px; }\n\n.preloader-wrapper.small {\n  width: 36px;\n  height: 36px; }\n\n.preloader-wrapper.big {\n  width: 64px;\n  height: 64px; }\n\n.preloader-wrapper.active {\n  -webkit-animation: container-rotate 1568ms linear infinite;\n  animation: container-rotate 1568ms linear infinite; }\n\n@-webkit-keyframes container-rotate {\n  to {\n    -webkit-transform: rotate(360deg); } }\n\n@keyframes container-rotate {\n  to {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg); } }\n\n.spinner-layer {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n  border-color: #26a69a; }\n\n.spinner-blue, .spinner-blue-only {\n  border-color: #4285f4; }\n\n.spinner-red, .spinner-red-only {\n  border-color: #db4437; }\n\n.spinner-yellow, .spinner-yellow-only {\n  border-color: #f4b400; }\n\n.spinner-green, .spinner-green-only {\n  border-color: #0f9d58; }\n\n.active .spinner-layer.spinner-blue {\n  -webkit-animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, blue-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\n  animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, blue-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both; }\n\n.active .spinner-layer.spinner-red {\n  -webkit-animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, red-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\n  animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, red-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both; }\n\n.active .spinner-layer.spinner-yellow {\n  -webkit-animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, yellow-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\n  animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, yellow-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both; }\n\n.active .spinner-layer.spinner-green {\n  -webkit-animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, green-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\n  animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both, green-fade-in-out 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both; }\n\n.active .spinner-layer, .active .spinner-layer.spinner-blue-only, .active .spinner-layer.spinner-red-only, .active .spinner-layer.spinner-yellow-only, .active .spinner-layer.spinner-green-only {\n  opacity: 1;\n  -webkit-animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\n  animation: fill-unfill-rotate 5332ms cubic-bezier(0.4, 0, 0.2, 1) infinite both; }\n\n@-webkit-keyframes fill-unfill-rotate {\n  12.5% {\n    -webkit-transform: rotate(135deg); }\n  25% {\n    -webkit-transform: rotate(270deg); }\n  37.5% {\n    -webkit-transform: rotate(405deg); }\n  50% {\n    -webkit-transform: rotate(540deg); }\n  62.5% {\n    -webkit-transform: rotate(675deg); }\n  75% {\n    -webkit-transform: rotate(810deg); }\n  87.5% {\n    -webkit-transform: rotate(945deg); }\n  to {\n    -webkit-transform: rotate(1080deg); } }\n\n@keyframes fill-unfill-rotate {\n  12.5% {\n    -webkit-transform: rotate(135deg);\n    transform: rotate(135deg); }\n  25% {\n    -webkit-transform: rotate(270deg);\n    transform: rotate(270deg); }\n  37.5% {\n    -webkit-transform: rotate(405deg);\n    transform: rotate(405deg); }\n  50% {\n    -webkit-transform: rotate(540deg);\n    transform: rotate(540deg); }\n  62.5% {\n    -webkit-transform: rotate(675deg);\n    transform: rotate(675deg); }\n  75% {\n    -webkit-transform: rotate(810deg);\n    transform: rotate(810deg); }\n  87.5% {\n    -webkit-transform: rotate(945deg);\n    transform: rotate(945deg); }\n  to {\n    -webkit-transform: rotate(1080deg);\n    transform: rotate(1080deg); } }\n\n@-webkit-keyframes blue-fade-in-out {\n  from {\n    opacity: 1; }\n  25% {\n    opacity: 1; }\n  26% {\n    opacity: 0; }\n  89% {\n    opacity: 0; }\n  90% {\n    opacity: 1; }\n  100% {\n    opacity: 1; } }\n\n@keyframes blue-fade-in-out {\n  from {\n    opacity: 1; }\n  25% {\n    opacity: 1; }\n  26% {\n    opacity: 0; }\n  89% {\n    opacity: 0; }\n  90% {\n    opacity: 1; }\n  100% {\n    opacity: 1; } }\n\n@-webkit-keyframes red-fade-in-out {\n  from {\n    opacity: 0; }\n  15% {\n    opacity: 0; }\n  25% {\n    opacity: 1; }\n  50% {\n    opacity: 1; }\n  51% {\n    opacity: 0; } }\n\n@keyframes red-fade-in-out {\n  from {\n    opacity: 0; }\n  15% {\n    opacity: 0; }\n  25% {\n    opacity: 1; }\n  50% {\n    opacity: 1; }\n  51% {\n    opacity: 0; } }\n\n@-webkit-keyframes yellow-fade-in-out {\n  from {\n    opacity: 0; }\n  40% {\n    opacity: 0; }\n  50% {\n    opacity: 1; }\n  75% {\n    opacity: 1; }\n  76% {\n    opacity: 0; } }\n\n@keyframes yellow-fade-in-out {\n  from {\n    opacity: 0; }\n  40% {\n    opacity: 0; }\n  50% {\n    opacity: 1; }\n  75% {\n    opacity: 1; }\n  76% {\n    opacity: 0; } }\n\n@-webkit-keyframes green-fade-in-out {\n  from {\n    opacity: 0; }\n  65% {\n    opacity: 0; }\n  75% {\n    opacity: 1; }\n  90% {\n    opacity: 1; }\n  100% {\n    opacity: 0; } }\n\n@keyframes green-fade-in-out {\n  from {\n    opacity: 0; }\n  65% {\n    opacity: 0; }\n  75% {\n    opacity: 1; }\n  90% {\n    opacity: 1; }\n  100% {\n    opacity: 0; } }\n\n.gap-patch {\n  position: absolute;\n  top: 0;\n  left: 45%;\n  width: 10%;\n  height: 100%;\n  overflow: hidden;\n  border-color: inherit; }\n\n.gap-patch .circle {\n  width: 1000%;\n  left: -450%; }\n\n.circle-clipper {\n  display: inline-block;\n  position: relative;\n  width: 50%;\n  height: 100%;\n  overflow: hidden;\n  border-color: inherit; }\n\n.circle-clipper .circle {\n  width: 200%;\n  height: 100%;\n  border-width: 3px;\n  border-style: solid;\n  border-color: inherit;\n  border-bottom-color: transparent !important;\n  border-radius: 50%;\n  -webkit-animation: none;\n  animation: none;\n  position: absolute;\n  top: 0;\n  right: 0;\n  bottom: 0; }\n\n.circle-clipper.left .circle {\n  left: 0;\n  border-right-color: transparent !important;\n  -webkit-transform: rotate(129deg);\n  transform: rotate(129deg); }\n\n.circle-clipper.right .circle {\n  left: -100%;\n  border-left-color: transparent !important;\n  -webkit-transform: rotate(-129deg);\n  transform: rotate(-129deg); }\n\n.active .circle-clipper.left .circle {\n  -webkit-animation: left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\n  animation: left-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both; }\n\n.active .circle-clipper.right .circle {\n  -webkit-animation: right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both;\n  animation: right-spin 1333ms cubic-bezier(0.4, 0, 0.2, 1) infinite both; }\n\n@-webkit-keyframes left-spin {\n  from {\n    -webkit-transform: rotate(130deg); }\n  50% {\n    -webkit-transform: rotate(-5deg); }\n  to {\n    -webkit-transform: rotate(130deg); } }\n\n@keyframes left-spin {\n  from {\n    -webkit-transform: rotate(130deg);\n    transform: rotate(130deg); }\n  50% {\n    -webkit-transform: rotate(-5deg);\n    transform: rotate(-5deg); }\n  to {\n    -webkit-transform: rotate(130deg);\n    transform: rotate(130deg); } }\n\n@-webkit-keyframes right-spin {\n  from {\n    -webkit-transform: rotate(-130deg); }\n  50% {\n    -webkit-transform: rotate(5deg); }\n  to {\n    -webkit-transform: rotate(-130deg); } }\n\n@keyframes right-spin {\n  from {\n    -webkit-transform: rotate(-130deg);\n    transform: rotate(-130deg); }\n  50% {\n    -webkit-transform: rotate(5deg);\n    transform: rotate(5deg); }\n  to {\n    -webkit-transform: rotate(-130deg);\n    transform: rotate(-130deg); } }\n\n#spinnerContainer.cooldown {\n  -webkit-animation: container-rotate 1568ms linear infinite, fade-out 400ms cubic-bezier(0.4, 0, 0.2, 1);\n  animation: container-rotate 1568ms linear infinite, fade-out 400ms cubic-bezier(0.4, 0, 0.2, 1); }\n\n@-webkit-keyframes fade-out {\n  from {\n    opacity: 1; }\n  to {\n    opacity: 0; } }\n\n@keyframes fade-out {\n  from {\n    opacity: 1; }\n  to {\n    opacity: 0; } }\n\n.slider {\n  position: relative;\n  height: 400px;\n  width: 100%; }\n\n.slider.fullscreen {\n  height: 100%;\n  width: 100%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0; }\n\n.slider.fullscreen ul.slides {\n  height: 100%; }\n\n.slider.fullscreen ul.indicators {\n  z-index: 2;\n  bottom: 30px; }\n\n.slider .slides {\n  background-color: #9e9e9e;\n  margin: 0;\n  height: 400px; }\n\n.slider .slides li {\n  opacity: 0;\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 1;\n  width: 100%;\n  height: inherit;\n  overflow: hidden; }\n\n.slider .slides li img {\n  height: 100%;\n  width: 100%;\n  background-size: cover;\n  background-position: center; }\n\n.slider .slides li .caption {\n  color: #fff;\n  position: absolute;\n  top: 15%;\n  left: 15%;\n  width: 70%;\n  opacity: 0; }\n\n.slider .slides li .caption p {\n  color: #e0e0e0; }\n\n.slider .slides li.active {\n  z-index: 2; }\n\n.slider .indicators {\n  position: absolute;\n  text-align: center;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  margin: 0; }\n\n.slider .indicators .indicator-item {\n  display: inline-block;\n  position: relative;\n  cursor: pointer;\n  height: 16px;\n  width: 16px;\n  margin: 0 12px;\n  background-color: #e0e0e0;\n  transition: background-color .3s;\n  border-radius: 50%; }\n\n.slider .indicators .indicator-item.active {\n  background-color: #4CAF50; }\n\n.carousel {\n  overflow: hidden;\n  position: relative;\n  width: 100%;\n  height: 400px;\n  -webkit-perspective: 500px;\n  perspective: 500px;\n  -webkit-transform-style: preserve-3d;\n  transform-style: preserve-3d;\n  -webkit-transform-origin: 0% 50%;\n  transform-origin: 0% 50%; }\n\n.carousel.carousel-slider {\n  top: 0;\n  left: 0;\n  height: 0; }\n\n.carousel.carousel-slider .carousel-fixed-item {\n  position: absolute;\n  left: 0;\n  right: 0;\n  bottom: 20px;\n  z-index: 1; }\n\n.carousel.carousel-slider .carousel-fixed-item.with-indicators {\n  bottom: 68px; }\n\n.carousel.carousel-slider .carousel-item {\n  width: 100%;\n  height: 100%;\n  min-height: 400px;\n  position: absolute;\n  top: 0;\n  left: 0; }\n\n.carousel.carousel-slider .carousel-item h2 {\n  font-size: 24px;\n  font-weight: 500;\n  line-height: 32px; }\n\n.carousel.carousel-slider .carousel-item p {\n  font-size: 15px; }\n\n.carousel .carousel-item {\n  display: none;\n  width: 200px;\n  height: 200px;\n  position: absolute;\n  top: 0;\n  left: 0; }\n\n.carousel .carousel-item > img {\n  width: 100%; }\n\n.carousel .indicators {\n  position: absolute;\n  text-align: center;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  margin: 0; }\n\n.carousel .indicators .indicator-item {\n  display: inline-block;\n  position: relative;\n  cursor: pointer;\n  height: 8px;\n  width: 8px;\n  margin: 24px 4px;\n  background-color: rgba(255, 255, 255, 0.5);\n  transition: background-color .3s;\n  border-radius: 50%; }\n\n.carousel .indicators .indicator-item.active {\n  background-color: #fff; }\n\n.carousel.scrolling .carousel-item .materialboxed, .carousel .carousel-item:not(.active) .materialboxed {\n  pointer-events: none; }\n\n.tap-target-wrapper {\n  width: 800px;\n  height: 800px;\n  position: fixed;\n  z-index: 1000;\n  visibility: hidden;\n  transition: visibility 0s .3s; }\n\n.tap-target-wrapper.open {\n  visibility: visible;\n  transition: visibility 0s; }\n\n.tap-target-wrapper.open .tap-target {\n  -webkit-transform: scale(1);\n  transform: scale(1);\n  opacity: .95;\n  transition: opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1), -webkit-transform 0.3s cubic-bezier(0.42, 0, 0.58, 1);\n  transition: transform 0.3s cubic-bezier(0.42, 0, 0.58, 1), opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1);\n  transition: transform 0.3s cubic-bezier(0.42, 0, 0.58, 1), opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1), -webkit-transform 0.3s cubic-bezier(0.42, 0, 0.58, 1); }\n\n.tap-target-wrapper.open .tap-target-wave::before {\n  -webkit-transform: scale(1);\n  transform: scale(1); }\n\n.tap-target-wrapper.open .tap-target-wave::after {\n  visibility: visible;\n  -webkit-animation: pulse-animation 1s cubic-bezier(0.24, 0, 0.38, 1) infinite;\n  animation: pulse-animation 1s cubic-bezier(0.24, 0, 0.38, 1) infinite;\n  transition: opacity .3s, visibility 0s 1s, -webkit-transform .3s;\n  transition: opacity .3s, transform .3s, visibility 0s 1s;\n  transition: opacity .3s, transform .3s, visibility 0s 1s, -webkit-transform .3s; }\n\n.tap-target {\n  position: absolute;\n  font-size: 1rem;\n  border-radius: 50%;\n  background-color: #ee6e73;\n  box-shadow: 0 20px 20px 0 rgba(0, 0, 0, 0.14), 0 10px 50px 0 rgba(0, 0, 0, 0.12), 0 30px 10px -20px rgba(0, 0, 0, 0.2);\n  width: 100%;\n  height: 100%;\n  opacity: 0;\n  -webkit-transform: scale(0);\n  transform: scale(0);\n  transition: opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1), -webkit-transform 0.3s cubic-bezier(0.42, 0, 0.58, 1);\n  transition: transform 0.3s cubic-bezier(0.42, 0, 0.58, 1), opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1);\n  transition: transform 0.3s cubic-bezier(0.42, 0, 0.58, 1), opacity 0.3s cubic-bezier(0.42, 0, 0.58, 1), -webkit-transform 0.3s cubic-bezier(0.42, 0, 0.58, 1); }\n\n.tap-target-content {\n  position: relative;\n  display: table-cell; }\n\n.tap-target-wave {\n  position: absolute;\n  border-radius: 50%;\n  z-index: 10001; }\n\n.tap-target-wave::before, .tap-target-wave::after {\n  content: '';\n  display: block;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  border-radius: 50%;\n  background-color: #ffffff; }\n\n.tap-target-wave::before {\n  -webkit-transform: scale(0);\n  transform: scale(0);\n  transition: -webkit-transform .3s;\n  transition: transform .3s;\n  transition: transform .3s, -webkit-transform .3s; }\n\n.tap-target-wave::after {\n  visibility: hidden;\n  transition: opacity .3s, visibility 0s, -webkit-transform .3s;\n  transition: opacity .3s, transform .3s, visibility 0s;\n  transition: opacity .3s, transform .3s, visibility 0s, -webkit-transform .3s;\n  z-index: -1; }\n\n.tap-target-origin {\n  top: 50%;\n  left: 50%;\n  -webkit-transform: translate(-50%, -50%);\n  transform: translate(-50%, -50%);\n  z-index: 10002;\n  position: absolute !important; }\n\n.tap-target-origin:not(.btn):not(.btn-large), .tap-target-origin:not(.btn):not(.btn-large):hover {\n  background: none; }\n\n@media only screen and (max-width: 600px) {\n  .tap-target, .tap-target-wrapper {\n    width: 600px;\n    height: 600px; } }\n\n.pulse {\n  overflow: initial;\n  position: relative; }\n\n.pulse::before {\n  content: '';\n  display: block;\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  background-color: inherit;\n  border-radius: inherit;\n  transition: opacity .3s, -webkit-transform .3s;\n  transition: opacity .3s, transform .3s;\n  transition: opacity .3s, transform .3s, -webkit-transform .3s;\n  -webkit-animation: pulse-animation 1s cubic-bezier(0.24, 0, 0.38, 1) infinite;\n  animation: pulse-animation 1s cubic-bezier(0.24, 0, 0.38, 1) infinite;\n  z-index: -1; }\n\n@-webkit-keyframes pulse-animation {\n  0% {\n    opacity: 1;\n    -webkit-transform: scale(1);\n    transform: scale(1); }\n  50% {\n    opacity: 0;\n    -webkit-transform: scale(1.5);\n    transform: scale(1.5); }\n  100% {\n    opacity: 0;\n    -webkit-transform: scale(1.5);\n    transform: scale(1.5); } }\n\n@keyframes pulse-animation {\n  0% {\n    opacity: 1;\n    -webkit-transform: scale(1);\n    transform: scale(1); }\n  50% {\n    opacity: 0;\n    -webkit-transform: scale(1.5);\n    transform: scale(1.5); }\n  100% {\n    opacity: 0;\n    -webkit-transform: scale(1.5);\n    transform: scale(1.5); } }\n\n.picker {\n  font-size: 16px;\n  text-align: left;\n  line-height: 1.2;\n  color: #000000;\n  position: absolute;\n  z-index: 10000;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.picker__input {\n  cursor: default; }\n\n.picker__input.picker__input--active {\n  border-color: #0089ec; }\n\n.picker__holder {\n  width: 100%;\n  overflow-y: auto;\n  -webkit-overflow-scrolling: touch; }\n\n/*!\n * Default mobile-first, responsive styling for pickadate.js\n * Demo: http://amsul.github.io/pickadate.js\n */\n.picker__holder, .picker__frame {\n  bottom: 0;\n  left: 0;\n  right: 0;\n  top: 100%; }\n\n.picker__holder {\n  position: fixed;\n  transition: background 0.15s ease-out, top 0s 0.15s;\n  -webkit-backface-visibility: hidden; }\n\n.picker__frame {\n  position: absolute;\n  margin: 0 auto;\n  min-width: 256px;\n  width: 300px;\n  max-height: 350px;\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=0)\";\n  filter: alpha(opacity=0);\n  -moz-opacity: 0;\n  opacity: 0;\n  transition: all 0.15s ease-out; }\n\n@media (min-height: 28.875em) {\n  .picker__frame {\n    overflow: visible;\n    top: auto;\n    bottom: -100%;\n    max-height: 80%; } }\n\n@media (min-height: 40.125em) {\n  .picker__frame {\n    margin-bottom: 7.5%; } }\n\n.picker__wrap {\n  display: table;\n  width: 100%;\n  height: 100%; }\n\n@media (min-height: 28.875em) {\n  .picker__wrap {\n    display: block; } }\n\n.picker__box {\n  background: #ffffff;\n  display: table-cell;\n  vertical-align: middle; }\n\n@media (min-height: 28.875em) {\n  .picker__box {\n    display: block;\n    border: 1px solid #777777;\n    border-top-color: #898989;\n    border-bottom-width: 0;\n    border-radius: 5px 5px 0 0;\n    box-shadow: 0 12px 36px 16px rgba(0, 0, 0, 0.24); } }\n\n.picker--opened .picker__holder {\n  top: 0;\n  background: transparent;\n  -ms-filter: \"progid:DXImageTransform.Microsoft.gradient(startColorstr=#1E000000,endColorstr=#1E000000)\";\n  zoom: 1;\n  background: rgba(0, 0, 0, 0.32);\n  transition: background 0.15s ease-out; }\n\n.picker--opened .picker__frame {\n  top: 0;\n  -ms-filter: \"progid:DXImageTransform.Microsoft.Alpha(Opacity=100)\";\n  filter: alpha(opacity=100);\n  -moz-opacity: 1;\n  opacity: 1; }\n\n@media (min-height: 35.875em) {\n  .picker--opened .picker__frame {\n    top: 10%;\n    bottom: auto; } }\n\n.picker__input.picker__input--active {\n  border-color: #E3F2FD; }\n\n.picker__frame {\n  margin: 0 auto;\n  max-width: 325px; }\n\n@media (min-height: 38.875em) {\n  .picker--opened .picker__frame {\n    top: 10%;\n    bottom: auto; } }\n\n.picker__box {\n  padding: 0 1em; }\n\n.picker__header {\n  text-align: center;\n  position: relative;\n  margin-top: .75em; }\n\n.picker__month, .picker__year {\n  display: inline-block;\n  margin-left: .25em;\n  margin-right: .25em; }\n\n.picker__select--month, .picker__select--year {\n  height: 2em;\n  padding: 0;\n  margin-left: .25em;\n  margin-right: .25em; }\n\n.picker__select--month.browser-default {\n  display: inline;\n  background-color: #FFFFFF;\n  width: 40%; }\n\n.picker__select--year.browser-default {\n  display: inline;\n  background-color: #FFFFFF;\n  width: 26%; }\n\n.picker__select--month:focus, .picker__select--year:focus {\n  border-color: rgba(0, 0, 0, 0.05); }\n\n.picker__nav--prev, .picker__nav--next {\n  position: absolute;\n  padding: .5em 1.25em;\n  width: 1em;\n  height: 1em;\n  box-sizing: content-box;\n  top: -0.25em; }\n\n.picker__nav--prev {\n  left: -1em;\n  padding-right: 1.25em; }\n\n.picker__nav--next {\n  right: -1em;\n  padding-left: 1.25em; }\n\n.picker__nav--disabled, .picker__nav--disabled:hover, .picker__nav--disabled:before, .picker__nav--disabled:before:hover {\n  cursor: default;\n  background: none;\n  border-right-color: #f5f5f5;\n  border-left-color: #f5f5f5; }\n\n.picker__table {\n  text-align: center;\n  border-collapse: collapse;\n  border-spacing: 0;\n  table-layout: fixed;\n  font-size: 1rem;\n  width: 100%;\n  margin-top: .75em;\n  margin-bottom: .5em; }\n\n.picker__table th, .picker__table td {\n  text-align: center; }\n\n.picker__table td {\n  margin: 0;\n  padding: 0; }\n\n.picker__weekday {\n  width: 14.285714286%;\n  font-size: .75em;\n  padding-bottom: .25em;\n  color: #999999;\n  font-weight: 500; }\n\n@media (min-height: 33.875em) {\n  .picker__weekday {\n    padding-bottom: .5em; } }\n\n.picker__day--today {\n  position: relative;\n  color: #595959;\n  letter-spacing: -.3;\n  padding: .75rem 0;\n  font-weight: 400;\n  border: 1px solid transparent; }\n\n.picker__day--disabled:before {\n  border-top-color: #aaaaaa; }\n\n.picker__day--infocus:hover {\n  cursor: pointer;\n  color: #000;\n  font-weight: 500; }\n\n.picker__day--outfocus {\n  display: none;\n  padding: .75rem 0;\n  color: #fff; }\n\n.picker__day--outfocus:hover {\n  cursor: pointer;\n  color: #dddddd;\n  font-weight: 500; }\n\n.picker__day--highlighted:hover, .picker--focused .picker__day--highlighted {\n  cursor: pointer; }\n\n.picker__day--selected, .picker__day--selected:hover, .picker--focused .picker__day--selected {\n  border-radius: 50%;\n  -webkit-transform: scale(0.75);\n  transform: scale(0.75);\n  background: #0089ec;\n  color: #ffffff; }\n\n.picker__day--disabled, .picker__day--disabled:hover, .picker--focused .picker__day--disabled {\n  background: #f5f5f5;\n  border-color: #f5f5f5;\n  color: #dddddd;\n  cursor: default; }\n\n.picker__day--highlighted.picker__day--disabled, .picker__day--highlighted.picker__day--disabled:hover {\n  background: #bbbbbb; }\n\n.picker__footer {\n  text-align: center;\n  display: -webkit-flex;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-align-items: center;\n  -ms-flex-align: center;\n  align-items: center;\n  -webkit-justify-content: space-between;\n  -ms-flex-pack: justify;\n  justify-content: space-between; }\n\n.picker__button--today, .picker__button--clear, .picker__button--close {\n  border: 1px solid #ffffff;\n  background: #ffffff;\n  font-size: .8em;\n  padding: .66em 0;\n  font-weight: bold;\n  width: 33%;\n  display: inline-block;\n  vertical-align: bottom; }\n\n.picker__button--today:hover, .picker__button--clear:hover, .picker__button--close:hover {\n  cursor: pointer;\n  color: #000000;\n  background: #b1dcfb;\n  border-bottom-color: #b1dcfb; }\n\n.picker__button--today:focus, .picker__button--clear:focus, .picker__button--close:focus {\n  background: #b1dcfb;\n  border-color: rgba(0, 0, 0, 0.05);\n  outline: none; }\n\n.picker__button--today:before, .picker__button--clear:before, .picker__button--close:before {\n  position: relative;\n  display: inline-block;\n  height: 0; }\n\n.picker__button--today:before, .picker__button--clear:before {\n  content: \" \";\n  margin-right: .45em; }\n\n.picker__button--today:before {\n  top: -0.05em;\n  width: 0;\n  border-top: 0.66em solid #0059bc;\n  border-left: .66em solid transparent; }\n\n.picker__button--clear:before {\n  top: -0.25em;\n  width: .66em;\n  border-top: 3px solid #ee2200; }\n\n.picker__button--close:before {\n  content: \"\\D7\";\n  top: -0.1em;\n  vertical-align: top;\n  font-size: 1.1em;\n  margin-right: .35em;\n  color: #777777; }\n\n.picker__button--today[disabled], .picker__button--today[disabled]:hover {\n  background: #f5f5f5;\n  border-color: #f5f5f5;\n  color: #dddddd;\n  cursor: default; }\n\n.picker__button--today[disabled]:before {\n  border-top-color: #aaaaaa; }\n\n.picker__box {\n  border-radius: 2px;\n  overflow: hidden; }\n\n.picker__date-display {\n  text-align: center;\n  background-color: #26a69a;\n  color: #fff;\n  padding-bottom: 15px;\n  font-weight: 300; }\n\n.picker__nav--prev:hover, .picker__nav--next:hover {\n  cursor: pointer;\n  color: #000000;\n  background: #a1ded8; }\n\n.picker__weekday-display {\n  background-color: #1f897f;\n  padding: 10px;\n  font-weight: 200;\n  letter-spacing: .5;\n  font-size: 1rem;\n  margin-bottom: 15px; }\n\n.picker__month-display {\n  text-transform: uppercase;\n  font-size: 2rem; }\n\n.picker__day-display {\n  font-size: 4.5rem;\n  font-weight: 400; }\n\n.picker__year-display {\n  font-size: 1.8rem;\n  color: rgba(255, 255, 255, 0.4); }\n\n.picker__box {\n  padding: 0; }\n\n.picker__calendar-container {\n  padding: 0 1rem; }\n\n.picker__calendar-container thead {\n  border: none; }\n\n.picker__table {\n  margin-top: 0;\n  margin-bottom: .5em; }\n\n.picker__day--infocus {\n  color: #595959;\n  letter-spacing: -.3;\n  padding: .75rem 0;\n  font-weight: 400;\n  border: 1px solid transparent; }\n\n.picker__day.picker__day--today {\n  color: #26a69a; }\n\n.picker__day.picker__day--today.picker__day--selected {\n  color: #fff; }\n\n.picker__weekday {\n  font-size: .9rem; }\n\n.picker__day--selected, .picker__day--selected:hover, .picker--focused .picker__day--selected {\n  border-radius: 50%;\n  -webkit-transform: scale(0.9);\n  transform: scale(0.9);\n  background-color: #26a69a;\n  color: #ffffff; }\n\n.picker__day--selected.picker__day--outfocus, .picker__day--selected:hover.picker__day--outfocus, .picker--focused .picker__day--selected.picker__day--outfocus {\n  background-color: #a1ded8; }\n\n.picker__footer {\n  text-align: right;\n  padding: 5px 10px; }\n\n.picker__close, .picker__today {\n  font-size: 1.1rem;\n  padding: 0 1rem;\n  color: #26a69a; }\n\n.picker__nav--prev:before, .picker__nav--next:before {\n  content: \" \";\n  border-top: .5em solid transparent;\n  border-bottom: .5em solid transparent;\n  border-right: 0.75em solid #676767;\n  width: 0;\n  height: 0;\n  display: block;\n  margin: 0 auto; }\n\n.picker__nav--next:before {\n  border-right: 0;\n  border-left: 0.75em solid #676767; }\n\nbutton.picker__today:focus, button.picker__clear:focus, button.picker__close:focus {\n  background-color: #a1ded8; }\n\n.picker__list {\n  list-style: none;\n  padding: 0.75em 0 4.2em;\n  margin: 0; }\n\n.picker__list-item {\n  border-bottom: 1px solid #dddddd;\n  border-top: 1px solid #dddddd;\n  margin-bottom: -1px;\n  position: relative;\n  background: #ffffff;\n  padding: .75em 1.25em; }\n\n@media (min-height: 46.75em) {\n  .picker__list-item {\n    padding: .5em 1em; } }\n\n.picker__list-item:hover {\n  cursor: pointer;\n  color: #000000;\n  background: #b1dcfb;\n  border-color: #0089ec;\n  z-index: 10; }\n\n.picker__list-item--highlighted {\n  border-color: #0089ec;\n  z-index: 10; }\n\n.picker__list-item--highlighted:hover, .picker--focused .picker__list-item--highlighted {\n  cursor: pointer;\n  color: #000000;\n  background: #b1dcfb; }\n\n.picker__list-item--selected, .picker__list-item--selected:hover, .picker--focused .picker__list-item--selected {\n  background: #0089ec;\n  color: #ffffff;\n  z-index: 10; }\n\n.picker__list-item--disabled, .picker__list-item--disabled:hover, .picker--focused .picker__list-item--disabled {\n  background: #f5f5f5;\n  border-color: #f5f5f5;\n  color: #dddddd;\n  cursor: default;\n  border-color: #dddddd;\n  z-index: auto; }\n\n.picker--time .picker__button--clear {\n  display: block;\n  width: 80%;\n  margin: 1em auto 0;\n  padding: 1em 1.25em;\n  background: none;\n  border: 0;\n  font-weight: 500;\n  font-size: .67em;\n  text-align: center;\n  text-transform: uppercase;\n  color: #666; }\n\n.picker--time .picker__button--clear:hover, .picker--time .picker__button--clear:focus {\n  color: #000000;\n  background: #b1dcfb;\n  background: #ee2200;\n  border-color: #ee2200;\n  cursor: pointer;\n  color: #ffffff;\n  outline: none; }\n\n.picker--time .picker__button--clear:before {\n  top: -0.25em;\n  color: #666;\n  font-size: 1.25em;\n  font-weight: bold; }\n\n.picker--time .picker__button--clear:hover:before, .picker--time .picker__button--clear:focus:before {\n  color: #ffffff; }\n\n.picker--time .picker__frame {\n  min-width: 256px;\n  max-width: 320px; }\n\n.picker--time .picker__box {\n  font-size: 1em;\n  background: #f2f2f2;\n  padding: 0; }\n\n@media (min-height: 40.125em) {\n  .picker--time .picker__box {\n    margin-bottom: 5em; } }\n\nbody {\n  background-color: #fcfcfc; }\n\np.box {\n  padding: 20px; }\n\np {\n  color: rgba(0, 0, 0, 0.71);\n  padding: 0;\n  -webkit-font-smoothing: antialiased; }\n\nh1, h2, h3, h4, h5, h6 {\n  -webkit-font-smoothing: antialiased; }\n\nh5 > span {\n  font-size: 14px;\n  margin-left: 15px;\n  color: #777; }\n\nnav a {\n  -webkit-font-smoothing: antialiased; }\n\nnav ul li a:hover, nav ul li.active {\n  background-color: #ea454b; }\n\n.header {\n  color: #ee6e73;\n  font-weight: 300; }\n\n.caption {\n  font-size: 1.25rem;\n  font-weight: 300;\n  margin-bottom: 30px; }\n\n.preview {\n  background-color: #FFF;\n  border: 1px solid #eee;\n  padding: 20px 20px; }\n\nheader, main, footer {\n  padding-left: 300px; }\n\n.parallax-demo header, .parallax-demo main, .parallax-demo footer {\n  padding-left: 0; }\n\nfooter.example {\n  padding-left: 0; }\n\n@media only screen and (max-width: 992px) {\n  header, main, footer {\n    padding-left: 0; }\n  h5 > span {\n    display: block;\n    margin: 0 0 15px 0; } }\n\nul.side-nav.fixed li.logo {\n  text-align: center;\n  margin-top: 32px;\n  margin-bottom: 80px; }\n\nul.side-nav.fixed li.logo:hover, ul.side-nav.fixed li.logo #logo-container:hover {\n  background-color: transparent; }\n\nul.side-nav.fixed {\n  overflow: hidden; }\n\nul.side-nav.fixed li {\n  line-height: 44px; }\n\nul.side-nav.fixed li.active {\n  background-color: rgba(0, 0, 0, 0.05); }\n\nul.side-nav.fixed li a {\n  font-size: 13px;\n  line-height: 44px;\n  height: 44px;\n  padding: 0 30px; }\n\nul.side-nav.fixed ul.collapsible-accordion {\n  background-color: #FFF; }\n\nul.side-nav.fixed ul.collapsible-accordion a.collapsible-header {\n  padding: 0 30px; }\n\nul.side-nav.fixed ul.collapsible-accordion .collapsible-body li a {\n  font-weight: 400;\n  padding: 0 37.5px 0 45px; }\n\nul.side-nav.fixed:hover {\n  overflow-y: auto; }\n\n.bold > a {\n  font-weight: bold; }\n\n#logo-container {\n  height: 57px;\n  margin-bottom: 32px; }\n\nnav.top-nav {\n  height: 122px;\n  box-shadow: none; }\n\nnav.top-nav a.page-title {\n  line-height: 122px;\n  font-size: 48px; }\n\na.button-collapse.top-nav {\n  position: absolute;\n  text-align: center;\n  height: 48px;\n  width: 48px;\n  left: 7.5%;\n  top: 0;\n  float: none;\n  margin-left: 1.5rem;\n  color: #fff;\n  font-size: 36px;\n  z-index: 2; }\n\na.button-collapse.top-nav.full {\n  line-height: 122px; }\n\na.button-collapse.top-nav i {\n  font-size: 32px; }\n\n@media only screen and (max-width: 600px) {\n  a.button-collapse.top-nav {\n    left: 5%; } }\n\n@media only screen and (max-width: 992px) {\n  nav .nav-wrapper {\n    text-align: center; }\n  nav .nav-wrapper a.page-title {\n    font-size: 36px; } }\n\n@media only screen and (min-width: 993px) {\n  .container {\n    width: 85%; } }\n\n#front-page-logo {\n  display: inline-block;\n  height: 100%;\n  pointer-events: none; }\n\n@media only screen and (max-width: 992px) {\n  #front-page-nav ul.side-nav li {\n    float: none;\n    padding: 0 15px; }\n  #front-page-nav ul.side-nav li:hover {\n    background-color: #ddd; }\n  #front-page-nav ul.side-nav li .active {\n    background-color: transparent; }\n  #front-page-nav ul.side-nav a {\n    color: #444; } }\n\n#responsive-img {\n  width: 80%;\n  display: block;\n  margin: 0 auto; }\n\n#index-banner {\n  background-color: #ee6e73; }\n\n#index-banner .container {\n  position: relative; }\n\n#index-banner .header {\n  color: #FFF; }\n\n#index-banner h4 {\n  margin-bottom: 40px; }\n\n#index-banner h1 {\n  margin-top: 16px; }\n\n@media only screen and (max-width: 992px) {\n  #index-banner h1 {\n    margin-top: 60px; }\n  #index-banner h4 {\n    margin-bottom: 15px; } }\n\n@media only screen and (max-width: 600px) {\n  #index-banner h4 {\n    margin-bottom: 0; } }\n\n.github-commit {\n  padding: 14px 0;\n  height: 64px;\n  line-height: 36px;\n  background-color: #5c5757;\n  color: #e6e6e6;\n  font-size: .9rem; }\n\n@media only screen and (max-width: 992px) {\n  .github-commit {\n    text-align: center; } }\n\n#github-button {\n  background-color: #6f6d6d;\n  transition: .25s ease; }\n\n#github-button:hover {\n  background-color: #797777; }\n\n.sha {\n  color: #f0f0f0;\n  margin: 0 6px 0 6px; }\n\n#download-button {\n  background-color: #f3989b;\n  width: 260px;\n  height: 70px;\n  line-height: 70px;\n  font-size: 18px;\n  font-weight: 400; }\n\n#download-button:hover {\n  background-color: #f5a5a8; }\n\n.promo {\n  width: 100%; }\n\n.promo i {\n  margin: 40px 0;\n  color: #ee6e73;\n  font-size: 7rem;\n  display: block; }\n\n.promo-caption {\n  font-size: 1.7rem;\n  font-weight: 500;\n  margin-top: 5px;\n  margin-bottom: 0; }\n\n#front-page-nav {\n  background-color: #FFF;\n  position: relative; }\n\n#front-page-nav a {\n  color: #ee6e73; }\n\n#front-page-nav li:hover {\n  background-color: #fdeaeb; }\n\n#front-page-nav li.active {\n  background-color: #fdeaeb; }\n\n#front-page-nav .container {\n  height: inherit; }\n\n.col.grid-example {\n  border: 1px solid #eee;\n  margin: 7px 0;\n  text-align: center;\n  line-height: 50px;\n  font-size: 28px;\n  background-color: tomato;\n  color: white;\n  padding: 0; }\n\n.col.grid-example span {\n  font-weight: 100;\n  line-height: 50px; }\n\n.promo-example {\n  overflow: hidden; }\n\n#site-layout-example-left {\n  background-color: #90a4ae;\n  height: 300px; }\n\n#site-layout-example-right {\n  background-color: #26a69a;\n  height: 300px; }\n\n#site-layout-example-top {\n  background-color: #E57373;\n  height: 42px; }\n\n.flat-text-header {\n  height: 35px;\n  width: 80%;\n  background-color: rgba(255, 255, 255, 0.15);\n  display: block;\n  margin: 27px auto; }\n\n.flat-text {\n  height: 25px;\n  width: 80%;\n  background-color: rgba(0, 0, 0, 0.15);\n  display: block;\n  margin: 27px auto; }\n\n.flat-text.small {\n  width: 25%;\n  height: 25px;\n  background-color: rgba(0, 0, 0, 0.15); }\n\n.flat-text.full-width {\n  width: 100%; }\n\n.browser-window {\n  text-align: left;\n  width: 100%;\n  height: auto;\n  display: inline-block;\n  border-radius: 5px 5px 2px 2px;\n  background-color: #fff;\n  margin: 20px 0px;\n  overflow: hidden; }\n\n.browser-window .top-bar {\n  height: 30px;\n  border-radius: 5px 5px 0 0;\n  border-top: thin solid #eaeae9;\n  border-bottom: thin solid #dfdfde;\n  background: linear-gradient(#e7e7e6, #E2E2E1); }\n\n.browser-window .circle {\n  height: 10px;\n  width: 10px;\n  display: inline-block;\n  border-radius: 50%;\n  background-color: #fff;\n  margin-right: 1px; }\n\n#close-circle {\n  background-color: #FF5C5A; }\n\n#minimize-circle {\n  background-color: #FFBB50; }\n\n#maximize-circle {\n  background-color: #1BC656; }\n\n.browser-window .circles {\n  margin: 5px 12px; }\n\n.browser-window .content {\n  margin: 0;\n  width: 100%;\n  display: inline-block;\n  border-radius: 0 0 5px 5px;\n  background-color: #fafafa; }\n\n.browser-window .row {\n  margin: 0; }\n\n.clear {\n  clear: both; }\n\n.dynamic-color .red, .dynamic-color .pink, .dynamic-color .purple, .dynamic-color .deep-purple, .dynamic-color .indigo, .dynamic-color .blue, .dynamic-color .light-blue, .dynamic-color .cyan, .dynamic-color .teal, .dynamic-color .green, .dynamic-color .light-green, .dynamic-color .lime, .dynamic-color .yellow, .dynamic-color .amber, .dynamic-color .orange, .dynamic-color .deep-orange, .dynamic-color .brown, .dynamic-color .grey, .dynamic-color .blue-grey, .dynamic-color .black, .dynamic-color .white, .dynamic-color .transparent {\n  height: 55px;\n  width: 100%;\n  padding: 0 15px;\n  line-height: 55px;\n  font-weight: 500;\n  font-size: 12px;\n  display: block;\n  box-sizing: border-box; }\n\n.dynamic-color .col {\n  margin-bottom: 55px; }\n\n.center {\n  text-align: center;\n  vertical-align: middle; }\n\n.material-icons.icon-demo {\n  line-height: 50px; }\n\n.icon-container i {\n  font-size: 3em;\n  margin-bottom: 10px; }\n\n.icon-container .icon-preview {\n  height: 120px;\n  text-align: center; }\n\n.icon-container span {\n  display: block; }\n\n.icon-holder {\n  display: block;\n  text-align: center;\n  width: 150px;\n  height: 115px;\n  float: left;\n  margin: 0 0px 15px 0px; }\n\n.icon-holder p {\n  margin: 0 0; }\n\n.tabs-wrapper {\n  position: relative;\n  height: 48px; }\n\n.tabs-wrapper .row.pinned {\n  position: fixed;\n  width: 100%;\n  top: 0;\n  z-index: 10; }\n\n.shadow-demo {\n  background-color: #26a69a;\n  width: 100px;\n  height: 100px;\n  margin: 20px auto; }\n\n@media only screen and (max-width: 600px) {\n  .shadow-demo {\n    width: 150px;\n    height: 150px; } }\n\n.parallax-container .text-center {\n  position: absolute;\n  top: 50%;\n  left: 0;\n  right: 0;\n  margin-top: -27px; }\n\nul.table-of-contents {\n  margin-top: 0;\n  padding-top: 48px; }\n\ncode, pre {\n  position: relative;\n  font-size: 1.1rem; }\n\n.directory-markup {\n  font-size: 1rem;\n  line-height: 1.1rem !important; }\n\n:not(pre) > code[class*=\"language-\"] {\n  padding: .1em .25em;\n  border: solid 1px rgba(51, 51, 51, 0.12); }\n\npre[class*=\"language-\"] {\n  padding: 25px 12px 7px 12px;\n  border: solid 1px rgba(51, 51, 51, 0.12); }\n\npre[class*=\"language-\"]:before {\n  position: absolute;\n  padding: 1px 5px;\n  background: #e8e6e3;\n  top: 0;\n  left: 0;\n  font-family: \"Roboto\", sans-serif;\n  -webkit-font-smoothing: antialiased;\n  color: #555;\n  content: attr(class);\n  font-size: .9rem;\n  border: solid 1px rgba(51, 51, 51, 0.12);\n  border-top: none;\n  border-left: none; }\n\n.toc-wrapper {\n  position: relative;\n  margin-top: 42px; }\n\n.toc-wrapper.pin-bottom {\n  margin-top: 84px; }\n\n#carbonads {\n  max-width: 150px;\n  display: inline-block;\n  position: relative;\n  text-align: left;\n  -webkit-font-smoothing: antialiased; }\n\n#carbonads > span, #carbonads span.carbon-wrap {\n  height: 100px;\n  display: block; }\n\n#carbonads a.carbon-img {\n  height: 100px;\n  display: inline-block;\n  margin-right: 10px; }\n\n#carbonads a.carbon-text, #carbonads input[type=\"submit\"] {\n  position: relative;\n  top: 0;\n  width: 150px;\n  vertical-align: top;\n  display: inline-block;\n  font-size: 13px;\n  color: #E57373; }\n\n#carbonads a.carbon-poweredby {\n  position: relative;\n  left: 28px;\n  font-size: 11px;\n  color: #EF9A9A; }\n\n.buysellads #carbonads > span, .buysellads #carbonads span.carbon-wrap {\n  height: auto; }\n\n.buysellads #carbonads a.carbon-text {\n  top: 5px;\n  left: 0;\n  width: 130px;\n  display: block;\n  font-size: 13px;\n  -webkit-font-smoothing: antialiased;\n  color: #E57373; }\n\n.buysellads #carbonads a.carbon-poweredby {\n  top: 5px; }\n\n.buysellads-header #carbonads > span, .buysellads-header #carbonads span.carbon-wrap {\n  height: auto; }\n\n.buysellads-header #carbonads a.carbon-text {\n  color: #fff; }\n\n.buysellads-header #carbonads a.carbon-poweredby {\n  color: rgba(255, 255, 255, 0.8); }\n\n.buysellads-homepage #carbonads {\n  display: block;\n  overflow: hidden;\n  margin: 4em auto 0;\n  padding: 1em;\n  max-width: 360px;\n  border-radius: 2px;\n  background-color: rgba(255, 255, 255, 0.13); }\n\n.buysellads-homepage #carbonads span {\n  position: relative;\n  display: block;\n  overflow: hidden; }\n\n.buysellads-homepage #carbonads .carbon-img {\n  float: left;\n  margin-right: 1em; }\n\n.buysellads-homepage #carbonads .carbon-text {\n  max-width: calc(100% - 135px - 1em);\n  width: auto; }\n\n.buysellads-homepage #carbonads .carbon-poweredby {\n  position: absolute;\n  left: auto;\n  right: 0;\n  bottom: -4px; }\n\n.buysellads {\n  -webkit-font-smoothing: antialiased;\n  position: relative; }\n\n.buysellads.buysellads-demo {\n  bottom: 20px;\n  right: 20px;\n  position: fixed;\n  padding: 10px;\n  background-color: rgba(255, 255, 255, 0.9);\n  z-index: 1000; }\n\n.buysellads.buysellads-demo #carbonads a.carbon-img {\n  margin-right: 0; }\n\n.buysellads.buysellads-demo #carbonads a.carbon-text {\n  top: 0; }\n\n.buysellads.buysellads-demo a.close {\n  text-align: center;\n  background-color: #fff;\n  border-radius: 50%;\n  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);\n  height: 24px;\n  width: 24px;\n  position: absolute;\n  top: -6px;\n  right: -6px;\n  z-index: 1;\n  transition: background-color .2s; }\n\n.buysellads.buysellads-demo a.close:hover {\n  background-color: #ddd; }\n\n.buysellads.buysellads-demo a.close .material-icons {\n  font-size: 18px;\n  line-height: 24px; }\n\n.buysellads .bsa_it.one {\n  width: 130px;\n  position: absolute;\n  left: 0;\n  top: 50px; }\n\n.buysellads .bsa_it.one .bsa_it_p {\n  left: 0;\n  bottom: -15px; }\n\n.buysellads .bsa_it.one .bsa_it_ad .bsa_it_t {\n  color: #E57373; }\n\n.buysellads .bsa_it.one .bsa_it_ad .bsa_it_d {\n  color: #EF9A9A; }\n\n.buysellads .bsa_it_ad a {\n  display: block;\n  width: 130px; }\n\n.buysellads-header {\n  margin-top: 30px; }\n\n.buysellads-header .bsa_it.one .bsa_it_p {\n  bottom: -20px; }\n\n.bsa_it.one {\n  min-width: 230px;\n  max-width: 270px;\n  display: inline-block;\n  text-align: left; }\n\n.bsa_it.one .bsa_it_ad {\n  border: 0;\n  padding: 0;\n  background-color: transparent; }\n\n.bsa_it.one .bsa_it_ad .bsa_it_t {\n  color: #fff; }\n\n.bsa_it.one .bsa_it_ad .bsa_it_d {\n  color: #FFCDD2; }\n\n.bsa_it.one .bsa_it_p {\n  right: auto;\n  left: 40px;\n  bottom: -5px; }\n\n.bsa_it.one .bsa_it_p a {\n  color: #FFCDD2; }\n\nfooter {\n  font-size: .9rem; }\n\nbody.parallax-demo footer {\n  margin-top: 0; }\n\n.image-container {\n  width: 100%; }\n\n.image-container img {\n  max-width: 100%; }\n\n@media only screen and (max-width: 600px) {\n  .mobile-image {\n    max-width: 100%; } }\n\n.waves-color-demo .collection-item {\n  height: 37px;\n  line-height: 37px;\n  box-sizing: content-box; }\n\n.waves-color-demo .collection-item code {\n  line-height: 37px; }\n\n.waves-color-demo .btn:not(.waves-light), .waves-color-demo .btn-large:not(.waves-light) {\n  background-color: #fff;\n  color: #212121; }\n\n.card-panel span, .card-content p {\n  -webkit-font-smoothing: antialiased; }\n\n#images .card-panel .row {\n  margin-bottom: 0; }\n\n.pushpin-demo {\n  position: relative;\n  height: 100px; }\n\n#pushpin-demo-1 {\n  display: block;\n  height: inherit;\n  background-color: #ddd; }\n\n.valign-demo {\n  height: 400px;\n  background-color: #ddd; }\n\n.talign-demo {\n  height: 100px;\n  background-color: #ddd; }\n\n#staggered-test li, #image-test {\n  opacity: 0; }\n\n#tx-live-lang-container {\n  background-color: #fcfcfc;\n  z-index: 999; }\n\n#tx-live-lang-container #tx-live-lang-picker {\n  background-color: #fcfcfc; }\n\n#tx-live-lang-container #tx-live-lang-picker li {\n  color: rgba(0, 0, 0, 0.87); }\n\n#tx-live-lang-container #tx-live-lang-picker li:hover {\n  color: inherit;\n  background-color: #fdeaeb; }\n\n#tx-live-lang-container .txlive-langselector-toggle {\n  border-bottom: 2px solid #ee6e73; }\n\n#tx-live-lang-container .txlive-langselector-current {\n  color: rgba(0, 0, 0, 0.87); }\n\n#tx-live-lang-container .txlive-langselector-marker {\n  border-bottom: 4px solid rgba(0, 0, 0, 0.61); }\n\n#download-thanks {\n  display: none; }\n\n#twitter-widget-0 {\n  width: 300px !important; }\n\n#nav-mobile li.search {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 120px;\n  margin-top: 1px;\n  padding: 1px 0 0 0;\n  z-index: 2; }\n\n#nav-mobile li.search:hover {\n  background-color: #fff; }\n\n#nav-mobile li.search .search-wrapper {\n  margin: 0 12px;\n  transition: margin .25s ease; }\n\n#nav-mobile li.search .search-wrapper.focused {\n  margin: 0; }\n\n#nav-mobile li.search .search-wrapper input#search {\n  display: block;\n  font-size: 16px;\n  font-weight: 300;\n  width: 100%;\n  height: 45px;\n  margin: 0;\n  padding: 0 45px 0 15px;\n  border: 0; }\n\n#nav-mobile li.search .search-wrapper input#search:focus {\n  outline: none;\n  box-shadow: none; }\n\n#nav-mobile li.search .search-wrapper i.material-icons {\n  position: absolute;\n  top: 10px;\n  right: 10px;\n  cursor: pointer; }\n\n#nav-mobile li.search .search-results {\n  margin: 0;\n  border-top: 1px solid #e9e9e9;\n  background-color: #fff; }\n\n#nav-mobile li.search .search-results a {\n  font-size: 12px;\n  white-space: nowrap;\n  display: block; }\n\n#nav-mobile li.search .search-results a:hover, #nav-mobile li.search .search-results a.focused {\n  background-color: #eee;\n  outline: none; }\n\nbody.themes .themes-section {\n  padding: 60px 0 40px 0; }\n\nbody.themes .themes-section .theme-preview {\n  width: 100%; }\n\nbody.themes .themes-section h4 {\n  margin-top: 0; }\n\n.shopify-buy-frame, .shopify-btn {\n  float: left; }\n\n.shopify-buy-frame {\n  width: 105px; }\n\n.shopify-btn {\n  background-color: #78B657;\n  font-size: 15px;\n  font-family: 'Helvetica Neue';\n  letter-spacing: .3px;\n  border-radius: 2px;\n  color: #fff;\n  padding: 10px 20px;\n  transition: background .2s;\n  margin: 20px 0 0 5px;\n  -webkit-font-smoothing: antialiased; }\n\n.shopify-btn:hover {\n  background-color: #5f9d3e; }\n\n.themes-banner {\n  text-align: center;\n  background-color: #5f5f5f;\n  padding: 30px 0; }\n\n.themes-banner p {\n  font-size: 18px;\n  color: #fff; }\n\n.themes-banner a {\n  color: #baef74; }\n", ""]);

// exports


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(1)();
// imports


// module
exports.push([module.i, "/*\n Solarized Color Schemes originally by Ethan Schoonover\n http://ethanschoonover.com/solarized\n\n Ported for PrismJS by Hector Matos\n Website: https://krakendev.io\n Twitter Handle: https://twitter.com/allonsykraken)\n*/\n/*\nSOLARIZED HEX\n--------- -------\nbase03    #002b36\nbase02    #073642\nbase01    #586e75\nbase00    #657b83\nbase0     #839496\nbase1     #93a1a1\nbase2     #eee8d5\nbase3     #fdf6e3\nyellow    #b58900\norange    #cb4b16\nred       #dc322f\nmagenta   #d33682\nviolet    #6c71c4\nblue      #268bd2\ncyan      #2aa198\ngreen     #859900\n*/\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n  color: #657b83;\n  /* base00 */\n  font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;\n  text-align: left;\n  white-space: pre;\n  word-spacing: normal;\n  word-break: normal;\n  word-wrap: normal;\n  line-height: 1.5;\n  -moz-tab-size: 4;\n  -o-tab-size: 4;\n  tab-size: 4;\n  -webkit-hyphens: none;\n  -moz-hyphens: none;\n  -ms-hyphens: none;\n  hyphens: none; }\n\npre[class*=\"language-\"]::-moz-selection, pre[class*=\"language-\"] ::-moz-selection,\ncode[class*=\"language-\"]::-moz-selection, code[class*=\"language-\"] ::-moz-selection {\n  background: #073642;\n  /* base02 */ }\n\npre[class*=\"language-\"]::selection, pre[class*=\"language-\"] ::selection,\ncode[class*=\"language-\"]::selection, code[class*=\"language-\"] ::selection {\n  background: #073642;\n  /* base02 */ }\n\n/* Code blocks */\npre[class*=\"language-\"] {\n  padding: 1em;\n  margin: .5em 0;\n  overflow: auto;\n  border-radius: 0.3em; }\n\n:not(pre) > code[class*=\"language-\"],\npre[class*=\"language-\"] {\n  background-color: #fdf6e3;\n  /* base3 */ }\n\n/* Inline code */\n:not(pre) > code[class*=\"language-\"] {\n  padding: .1em;\n  border-radius: .3em; }\n\n.token.comment,\n.token.prolog,\n.token.doctype,\n.token.cdata {\n  color: #93a1a1;\n  /* base1 */ }\n\n.token.punctuation {\n  color: #586e75;\n  /* base01 */ }\n\n.namespace {\n  opacity: .7; }\n\n.token.property,\n.token.tag,\n.token.boolean,\n.token.number,\n.token.constant,\n.token.symbol,\n.token.deleted {\n  color: #268bd2;\n  /* blue */ }\n\n.token.selector,\n.token.attr-name,\n.token.string,\n.token.char,\n.token.builtin,\n.token.url,\n.token.inserted {\n  color: #2aa198;\n  /* cyan */ }\n\n.token.entity {\n  color: #657b83;\n  /* base00 */\n  background: #eee8d5;\n  /* base2 */ }\n\n.token.atrule,\n.token.attr-value,\n.token.keyword {\n  color: #859900;\n  /* green */ }\n\n.token.function {\n  color: #b58900;\n  /* yellow */ }\n\n.token.regex,\n.token.important,\n.token.variable {\n  color: #cb4b16;\n  /* orange */ }\n\n.token.important,\n.token.bold {\n  font-weight: bold; }\n\n.token.italic {\n  font-style: italic; }\n\n.token.entity {\n  cursor: help; }\n", ""]);

// exports


/***/ }),
/* 31 */
/***/ (function(module, exports) {

// empty (null-loader)

/***/ }),
/* 32 */
/***/ (function(module, exports) {

// empty (null-loader)

/***/ }),
/* 33 */
/***/ (function(module, exports) {

// empty (null-loader)

/***/ }),
/* 34 */
/***/ (function(module, exports) {

// empty (null-loader)

/***/ }),
/* 35 */
/***/ (function(module, exports) {

// empty (null-loader)

/***/ }),
/* 36 */
/***/ (function(module, exports) {

// empty (null-loader)

/***/ }),
/* 37 */
/***/ (function(module, exports) {

// empty (null-loader)

/***/ }),
/* 38 */
/***/ (function(module, exports) {

// empty (null-loader)

/***/ }),
/* 39 */
/***/ (function(module, exports) {

// empty (null-loader)

/***/ }),
/* 40 */
/***/ (function(module, exports) {

// empty (null-loader)

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(26);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(2)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./header.scss", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./header.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(27);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(2)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./playground.scss", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/sass-loader/lib/loader.js!./playground.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(30);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(2)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../css-loader/index.js!../../sass-loader/lib/loader.js!./prism-solarizedlight.css", function() {
			var newContent = require("!!../../css-loader/index.js!../../sass-loader/lib/loader.js!./prism-solarizedlight.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(13);

var _src = __webpack_require__(0);

var _subheader = __webpack_require__(3);

var _infos = __webpack_require__(9);

var _header = __webpack_require__(8);

var _tutorial = __webpack_require__(11);

var _playground = __webpack_require__(10);

__webpack_require__(12);

// components


// core
var router$ = (0, _src.initRouter)();

// main render function for the application
// render provided hyperscript into a parent element
// zliq passes around HTMLElement elements so you can decide what to do with them


//styles


// router
// dependencies
var app = (0, _src.h)(
	'div',
	null,
	[(0, _src.h)(
		_header.Header,
		null,
		[]
	), (0, _src.h)(
		'div',
		{ 'class': 'container' },
		[(0, _src.h)(
			'a',
			{ href: 'https://github.com/faboweb/zliq' },
			[(0, _src.h)(
				'img',
				{ style: 'position: absolute; top: 0; right: 0; border: 0;', src: 'https://camo.githubusercontent.com/38ef81f8aca64bb9a64448d0d70f1308ef5341ab/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f72696768745f6461726b626c75655f3132313632312e706e67', alt: 'Fork me on GitHub', 'data-canonical-src': 'https://s3.amazonaws.com/github/ribbons/forkme_right_darkblue_121621.png' },
				[]
			)]
		), (0, _src.h)(
			_src.Router,
			{ router$: router$, route: '/' },
			[(0, _src.h)(
				_infos.Infos,
				null,
				[]
			), (0, _src.h)(
				'div',
				{ 'class': 'section' },
				[(0, _src.h)(
					_subheader.Subheader,
					{ title: 'Motivation', subtitle: 'Why yet another web framework?', id: 'motivation' },
					[]
				), (0, _src.h)(
					'div',
					{ 'class': 'row' },
					[(0, _src.h)(
						'p',
						null,
						['Modern web frameworks got really big (React + Redux 139Kb and Angular 2 + Rx 766Kb, ', (0, _src.h)(
							'a',
							{ href: 'https://gist.github.com/Restuta/cda69e50a853aa64912d' },
							['src']
						), '). As a developer I came into the (un)pleasant situation to teach people how these work. But I couldn\'t really say, as I haven\'t actually understood each line of code in these beasts. But not only that, they also have a lot of structures I as a developer have to learn to get where I want to go. It feels like learning programming again just to be able to render some data.']
					), (0, _src.h)(
						'p',
						null,
						['ZLIQ tries to be something simple. Something that reads in an evening. But that is still so powerful you can just go and display complex UIs with it. Something that feels more JS less Java.']
					), (0, _src.h)(
						'p',
						null,
						['Still ZLIQ doesn\'t try to be the next React or Angular! ZLIQ has a decent render speed even up to several hundred simultaneous updates but it\'s not as fast as ', (0, _src.h)(
							'a',
							{ href: '(https://preactjs.com/' },
							['Preact']
						), '. And it on purpose does not solve every problem you will ever have. ZLIQ is a tool to help you create the solution that fits your need.']
					)]
				)]
			), (0, _src.h)(
				_tutorial.Tutorial,
				null,
				[]
			), (0, _src.h)(
				_playground.Playground,
				null,
				[]
			)]
		), (0, _src.h)(
			_src.Router,
			{ router$: router$, route: '/subpage' },
			['You are at a subpage. The router detected the params:', router$.$('params').map(function (params) {
				return JSON.stringify(params);
			}), '.', (0, _src.h)(
				'a',
				{ href: '/#routing' },
				['Go Back']
			)]
		)]
	)]
);
document.querySelector('#app').appendChild(app);

/***/ })
/******/ ]);