'use strict';

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".product-box-zoomer-box {\n  position: relative;\n  width: 400px;\n  height: 400px; }\n  .product-box-zoomer-box-imageBox {\n    position: relative;\n    width: 100%;\n    height: 100%;\n    overflow: hidden; }\n    .product-box-zoomer-box-imageBox-image {\n      width: 100%; }\n    .product-box-zoomer-box-imageBox-maskBox {\n      visibility: hidden;\n      position: absolute;\n      top: 0px;\n      left: 0px;\n      width: 100px;\n      height: 100px;\n      background: rgba(0, 0, 0, 0.5); }\n  .product-box-zoomer-box-maskTop {\n    cursor: move;\n    position: absolute;\n    top: 0px;\n    left: 0px;\n    width: 100%;\n    height: 100%; }\n  .product-box-zoomer-box-zoomerBox {\n    visibility: hidden;\n    position: absolute;\n    top: 0px;\n    right: -20px;\n    width: 600px;\n    height: 600px;\n    border: 1px solid gray;\n    transform: translateX(100%);\n    background-repeat: no-repeat; }\n";
styleInject(css_248z);

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function createElement(vdom) {
    var _a, _b;
    var edata = { el: null, width: null, height: null };
    var dData = {};
    var ele = document.createElement(vdom.tag);
    (_a = vdom === null || vdom === void 0 ? void 0 : vdom.attrs) === null || _a === void 0 ? void 0 : _a.forEach(function (item) {
        Object.keys(item).forEach(function (key) {
            var d = ele.getAttribute(key);
            if (d)
                ele.setAttribute(key, d + ' ' + item[key]);
            else
                ele.setAttribute(key, item[key]);
        });
    });
    edata.el = ele;
    setTimeout(function () {
        edata.width = ele.clientWidth;
        edata.height = ele.clientHeight;
    });
    // if (vdom.child) {
    (_b = vdom === null || vdom === void 0 ? void 0 : vdom.child) === null || _b === void 0 ? void 0 : _b.forEach(function (item) {
        if (item.key) {
            var data = createElement(item);
            dData = __assign(__assign({}, dData), data);
            edata.el.append(data[item.key].el);
        }
        else {
            var data = createElement(item);
            edata.el.append(data.el);
        }
    });
    // }
    if (vdom.key) {
        dData[vdom.key] = edata;
        return dData;
    }
    else
        return edata;
    // return vdom.key ? dData || edata
    // return dData
}

var ProductZoomer = /** @class */ (function () {
    function ProductZoomer(el, options) {
        this.$el = typeof el === 'string' ? document.querySelector(el) : el;
        console.log(this.$el);
        this.initDom();
        this.initEvent();
    }
    // 
    ProductZoomer.prototype.initDom = function () {
        var className = this.$el.classList[0];
        this.$dom = createElement({
            tag: 'div',
            key: "zoomer-box",
            attrs: [{ 'class': "".concat(className, "-zoomer-box") }],
            child: [{
                    tag: 'div',
                    key: 'imageBox',
                    attrs: [{ 'class': "".concat(className, "-zoomer-box-imageBox") }],
                    child: [{
                            tag: 'img',
                            key: 'image',
                            attrs: [{ 'class': "".concat(className, "-zoomer-box-imageBox-image") }]
                        }, {
                            tag: 'div',
                            key: 'maskBox',
                            attrs: [{ 'class': "".concat(className, "-zoomer-box-imageBox-maskBox") }]
                        }]
                }, {
                    tag: 'div',
                    key: 'maskTop',
                    attrs: [{ 'class': "".concat(className, "-zoomer-box-maskTop") }]
                }, {
                    tag: 'div',
                    key: 'zoomerBox',
                    attrs: [{ 'class': "".concat(className, "-zoomer-box-zoomerBox") }]
                }]
        });
        this.$el.appendChild(this.$dom['zoomer-box'].el);
        console.log(this.$dom, 'createElement');
    };
    // 添加事件
    ProductZoomer.prototype.initEvent = function () {
        var mouseFn = throttle(this.onmousemove.bind(this), 10);
        this.$dom.maskTop.el.addEventListener('mouseenter', this.onmouseenter.bind(this));
        this.$dom.maskTop.el.addEventListener('mousemove', mouseFn.bind(this));
        this.$dom.maskTop.el.addEventListener('mouseleave', this.onmouseleave.bind(this));
        this.$dom.image.el.addEventListener('load', this.onimgLoad.bind(this));
    };
    ProductZoomer.prototype.onmouseenter = function (ev) {
        this.$dom.maskBox.el.style.visibility = 'visible';
        this.$dom.zoomerBox.el.style.visibility = 'visible';
    };
    ProductZoomer.prototype.onmousemove = function (ev) {
        var maskBox = this.$dom.maskBox.el;
        var maskRatioWidth = this.$dom.imageBox.width / this.$dom.maskBox.width;
        var maskRatioHeight = this.$dom.imageBox.height / this.$dom.maskBox.height;
        var zoomerRatioWidth = this.$dom.zoomerBox.width / this.$dom.imageBox.width;
        var zoomerRatioHeight = this.$dom.zoomerBox.height / this.$dom.imageBox.height;
        var x = ev.offsetX - (this.$dom.maskBox.width / 2);
        var y = ev.offsetY - (this.$dom.maskBox.height / 2);
        // 
        if (ev.offsetX <= this.$dom.maskBox.width / 2)
            x = 0;
        if (ev.offsetX >= this.$dom.imageBox.width - this.$dom.maskBox.width / 2)
            x = this.$dom.imageBox.width - this.$dom.maskBox.width;
        if (ev.offsetY <= this.$dom.maskBox.height / 2)
            y = 0;
        if (ev.offsetY >= this.$dom.imageBox.height - this.$dom.maskBox.height / 2)
            y = this.$dom.imageBox.height - this.$dom.maskBox.height;
        maskBox.style.transform = "translate(".concat(x, "px,").concat(y, "px)");
        this.$dom.zoomerBox.el.style.backgroundPosition = "-".concat(x * maskRatioWidth * zoomerRatioWidth, "px -").concat(y * maskRatioHeight * zoomerRatioHeight, "px");
    };
    ProductZoomer.prototype.onmouseleave = function (ev) {
        this.$dom.maskBox.el.style.visibility = 'hidden';
        this.$dom.zoomerBox.el.style.visibility = 'hidden';
    };
    ProductZoomer.prototype.onimgLoad = function (ev) {
        var currentEle = ev.currentTarget;
        // console.log(currentEle, currentEle.clientWidth,111)
        this.$dom.image.width = currentEle.clientWidth;
        this.$dom.image.height = currentEle.clientHeight;
        this.$dom.zoomerBox.el.style.backgroundSize = "".concat(this.$dom.image.width / this.$dom.maskBox.width * 100, "% ").concat(this.$dom.image.height / this.$dom.maskBox.height * 100, "%");
    };
    // 更换图片
    ProductZoomer.prototype.repeact = function (imgUrl) {
        this.$dom.image.el.setAttribute('src', imgUrl);
        this.$dom.zoomerBox.el.style.backgroundImage = "url(".concat(imgUrl, ")");
    };
    ProductZoomer.prototype.render = function () {
    };
    return ProductZoomer;
}());
function throttle(fn, delay) {
    var time;
    return function (arg) {
        // console.log(arg,'=>')
        if (time)
            return;
        time = setTimeout(function () {
            fn(arg);
            time = null;
        }, delay);
    };
}

// const pic = new ProductZoomer('.product-box',)
// pic.repeact('https://gd-hbimg.huaban.com/72c96a5f19908bec1e71cae49ca0cc2a7c1e0e9858a99-24nwAk_fw1200')

// console.log(pic)

module.exports = ProductZoomer;
