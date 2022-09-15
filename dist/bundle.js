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

var css_248z = ".product-zoomer {\n  position: relative; }\n  .product-zoomer .image-box {\n    position: relative;\n    width: 100%;\n    height: 100%;\n    overflow: hidden; }\n    .product-zoomer .image-box .image {\n      width: 100%; }\n    .product-zoomer .image-box .mask-box {\n      visibility: hidden;\n      position: absolute;\n      top: 0px;\n      left: 0px;\n      width: 100px;\n      height: 100px; }\n    .product-zoomer .image-box .mask-top {\n      position: absolute;\n      width: 100%;\n      height: 100%;\n      top: 0px;\n      left: 0px;\n      cursor: move; }\n  .product-zoomer .video-box {\n    display: flex;\n    align-items: center;\n    width: 100%;\n    height: 100%;\n    overflow: hidden; }\n    .product-zoomer .video-box video {\n      width: 100%;\n      height: 100%; }\n  .product-zoomer .fat-video-box {\n    position: relative;\n    width: 100%;\n    height: 100%; }\n    .product-zoomer .fat-video-box .image-box {\n      position: relative;\n      width: 100%;\n      height: 100%;\n      overflow: hidden;\n      z-index: 2; }\n      .product-zoomer .fat-video-box .image-box .image {\n        width: 100%; }\n      .product-zoomer .fat-video-box .image-box .mask-box {\n        visibility: hidden;\n        position: absolute;\n        top: 0px;\n        left: 0px;\n        width: 100px;\n        height: 100px; }\n      .product-zoomer .fat-video-box .image-box .mask-top {\n        position: absolute;\n        width: 100%;\n        height: 100%;\n        top: 0px;\n        left: 0px;\n        cursor: move; }\n      .product-zoomer .fat-video-box .image-box .icon-play {\n        position: absolute;\n        left: 50%;\n        top: 50%;\n        transform: translate(-50%, -50%);\n        width: 50px;\n        height: 50px;\n        cursor: pointer;\n        background-position: 0px 0px; }\n    .product-zoomer .fat-video-box .video-box {\n      position: absolute;\n      top: 0px;\n      left: 0px;\n      display: flex;\n      align-items: center;\n      width: 100%;\n      height: 100%;\n      overflow: hidden;\n      background: white; }\n      .product-zoomer .fat-video-box .video-box .icon-close {\n        position: absolute;\n        top: 5px;\n        right: 10px;\n        width: 12px;\n        height: 12px;\n        background-position: 0px 50px;\n        z-index: 1;\n        cursor: pointer; }\n      .product-zoomer .fat-video-box .video-box video {\n        width: 100%;\n        height: 100%; }\n  .product-zoomer .zoomer-box {\n    position: absolute;\n    top: 0px;\n    right: -100%;\n    width: 100%;\n    height: 100%;\n    background: gray;\n    visibility: hidden;\n    background-size: 100%;\n    background-repeat: no-repeat; }\n";
styleInject(css_248z);

// 
function splitTemplate(vTem) {
    // 暂用警号匹配
    const Rex = /(<[^\/].*?[^\/]>)|(<.*? \/>)|(<\/.*?>)|#(.*)#/gm;
    // const RexString = />(.*)</gm
    const arr = [];
    const temArr = [];
    let exec = null;
    // console.log(vTem)
    while ((exec = Rex.exec(vTem)) !== null) {
        // console.log(exec, 'exec')
        if (exec[1]) {
            temArr.push(exec[1]);
            arr.push(1);
        }
        else if (exec[2]) {
            temArr.push(exec[2]);
            arr.push(3);
        }
        else if (exec[3]) {
            temArr.push(exec[3]);
            arr.push(2);
        }
        else if (exec[4]) ;
    }
    // console.log(arr, temArr)
    const t = long(arr, temArr)[0];
    // const vdom = createVirtualDom_(t)
    // console.log(vdom, 'vdom')
    // console.log(t)
    return t;
}
// 
function createVirtualDom_(Sdom) {
    // console.log(Sdom, 'Sdom')
    let vdom = {
        tag: null
    };
    const head = Sdom.head;
    const Rex = /(\w+)\s|(\w+)=[',"](.+?)[',"]/g;
    let execCache;
    while ((execCache = Rex.exec(head)) !== null) {
        if (execCache[1])
            vdom.tag = execCache[1];
        else if (execCache[2] && execCache[2] === 'okey')
            vdom.okey = execCache[3];
        else if (execCache[2] && execCache[3]) {
            // console.log(typeof execCache[2], 'ex', execCache[3])
            const key = execCache[2];
            if (!vdom.attrs)
                vdom.attrs = [];
            vdom.attrs.push({ [key]: execCache[3] });
        }
    }
    vdom.child = Sdom.child && Sdom.child.map(item => createVirtualDom_(item));
    return vdom;
}
// 
function createElement(vdom) {
    let edata = { el: null, width: null, height: null };
    let edom = {};
    const ele = document.createElement(vdom.tag);
    vdom?.attrs?.forEach(item => {
        Object.keys(item).forEach(key => {
            const d = ele.getAttribute(key);
            if (d)
                ele.setAttribute(key, d + ' ' + item[key]);
            else
                ele.setAttribute(key, item[key]);
        });
    });
    edata.el = ele;
    setTimeout(() => {
        edata.width = ele.clientWidth;
        edata.height = ele.clientHeight;
    });
    vdom?.child?.forEach(item => {
        if (typeof item === 'string') {
            ele.append(item);
        }
        else {
            const [_edom, _edata] = createElement(item);
            ele.append(_edata.el);
            edom = { ...edom, ..._edom };
        }
    });
    if (vdom.okey)
        return [{ [vdom.okey]: edata, ...edom }, edata];
    else
        return [edom, edata];
}
function long(arr, sArr) {
    let hk = 0;
    let h = 0;
    let _arr = [];
    arr.forEach((v, i) => {
        if (v === 1)
            hk++;
        else if (v === 2)
            hk--;
        if (hk === 0) {
            // const rex = /[^<>]*/g
            // console.log(sArr[h],' 1', rex.exec(sArr[h])[0])
            _arr.push({
                head: sArr[h],
                child: long(arr.slice(h + 1, i), sArr.slice(h + 1, i))
            });
            h = i + 1;
        }
    });
    return _arr.length ? _arr : null;
}
function render(template) {
    const sdom = splitTemplate(template);
    const vdom = createVirtualDom_(sdom);
    const edom = createElement(vdom)[0];
    return edom;
}

var img$1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAMAAABFaP0WAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAGUExURT1uzv///62t27cAAAACdFJOU/8A5bcwSgAAABBJREFUeNpiYGBkYGQECDAAAA0ABMZIs2EAAAAASUVORK5CYII=";

var img = "data:image/png;base64,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";

class ProductZoomer {
    constructor(el, options) {
        this.$el = typeof el === 'string' ? document.querySelector(el) : el;
        this.$el.classList.add('product-zoomer');
        if (options)
            this.$opt = options;
    }
    // createImageBox() {
    //     const template = `
    //         <div class='image-box' okey='imageBox' >
    //             <img class='image' okey='image' />
    //             <div class='mask-box' okey='maskBox'></div>
    //             <div class='mask-top' okey='maskTop'></div>
    //         </div>
    //     `
    //     return data
    // }
    initImageBox() {
        const topEle = this.$dom?.imageBox?.el;
        const template = `
            <div class='image-box' okey='imageBox' >
                <img class='image' okey='image' />
                <div class='mask-box' okey='maskBox'></div>
                <div class='mask-top' okey='maskTop'></div>
            </div>
        `;
        if (this.$dom?.videoBox?.el)
            this.$dom.videoBox.el.remove();
        if (this.$dom?.fatVideoBox?.el)
            this.$dom.fatVideoBox.el.remove();
        if (topEle && topEle.parentElement)
            this.$el.append(this.$dom.imageBox.el);
        else {
            this.$dom = { ...this.$dom, ...render(template) };
            this.$el.append(this.$dom.imageBox.el);
            this.initZoomerBox();
            this.initEvent();
            this.$dom.maskBox.el.style.backgroundImage = `url(${img$1})`;
        }
    }
    // 
    initVideoBox() {
        const topEle = this.$dom?.videoBox?.el;
        const template = `
            <div class='video-box' okey='videoBox'>
                <video controls='true' okey='video' />
            </div>
        `;
        if (this.$dom?.imageBox?.el)
            this.$dom.imageBox.el.remove();
        if (this.$dom?.fatVideoBox?.el)
            this.$dom.fatVideoBox.el.remove();
        if (topEle && topEle.parentElement)
            this.$el.append(this.$dom.videoBox.el);
        else {
            console.log('video append');
            this.$dom = { ...this.$dom, ...render(template) };
            this.$el.append(this.$dom.videoBox.el);
        }
    }
    initFatVideoBox() {
        const topEle = this.$dom?.fatVideoBox?.el;
        const template = `
            <div class='fat-video-box' okey='fatVideoBox'>
                <div class='image-box' okey='fatImageBox' >
                    <img class='image' okey='image' />
                    <div class='mask-box' okey='maskBox'></div>
                    <div class='mask-top' okey='maskTop'></div>
                    <div class='icon-play' okey='iconPlay'></div>
                </div>
                <div class='video-box' okey='VideoBox'>
                  <div class='icon-close' okey='iconClose'></div>
                  <video controls='true' okey='video' />
                </div>
            </div>
        `;
        if (this.$dom?.imageBox?.el)
            this.$dom.imageBox.el.remove();
        if (this.$dom?.videoBox?.el)
            this.$dom.videoBox.el.remove();
        if (topEle && topEle.parentElement)
            this.$el.append(this.$dom.fatVideoBox.el);
        else {
            this.$dom = { ...this.$dom, ...render(template) };
            this.$el.append(this.$dom.fatVideoBox.el);
            this.initFatEvent();
            this.$dom.maskBox.el.style.backgroundImage = `url(${img$1})`;
            this.$dom.iconPlay.el.style.backgroundImage = `url(${img})`;
            this.$dom.iconClose.el.style.backgroundImage = `url(${img})`;
        }
    }
    // 
    initZoomerBox() {
        const topEle = this.$dom?.fatVideoBox?.el;
        const template = `
            <div class='zoomer-box' okey='zoomerBox'></div>
        `;
        if (topEle && topEle.parentElement)
            return;
        else {
            this.$dom = { ...this.$dom, ...render(template) };
            this.$el.append(this.$dom.zoomerBox.el);
        }
    }
    // 添加事件
    initEvent() {
        const mouseFn = throttle(this.onmousemove.bind(this), 10);
        this.$dom.maskTop.el.addEventListener('mouseenter', this.onmouseenter.bind(this));
        this.$dom.maskTop.el.addEventListener('mousemove', mouseFn.bind(this));
        this.$dom.maskTop.el.addEventListener('mouseleave', this.onmouseleave.bind(this));
        // this.$dom.image.el.addEventListener('load', this.onimgLoad.bind(this))
    }
    // fat添加事件
    initFatEvent() {
        const mouseFn = throttle(this.onmousemove.bind(this), 10);
        this.$dom.maskTop.el.addEventListener('mouseenter', this.onmouseenter.bind(this));
        this.$dom.maskTop.el.addEventListener('mousemove', mouseFn.bind(this));
        this.$dom.maskTop.el.addEventListener('mouseleave', this.onmouseleave.bind(this));
        this.$dom.iconPlay.el.addEventListener('click', this.onclick.bind(this));
        this.$dom.iconPlay.el.addEventListener('mouseenter', () => {
            this.$dom.iconPlay.el.style.backgroundPosition = `-51px 0px`;
        });
        this.$dom.iconPlay.el.addEventListener('mouseleave', () => {
            this.$dom.iconPlay.el.style.backgroundPosition = `0px 0px`;
        });
        this.$dom.iconClose.el.addEventListener('click', () => {
            this.$dom.fatImageBox.el.style.visibility = 'visible';
            console.log(this.$dom.fatImageBox, 'fatImageBox');
            const video = this.$dom.video.el;
            video.pause();
        });
    }
    onclick(ev) {
        this.$dom.fatImageBox.el.style.visibility = 'hidden';
        const video = this.$dom.video.el;
        video.play();
    }
    onmouseenter(ev) {
        this.$dom.maskBox.el.style.visibility = 'visible';
        this.$dom.zoomerBox.el.style.visibility = 'visible';
    }
    onmousemove(ev) {
        const maskBox = this.$dom.maskBox.el;
        const maskRatioWidth = this.$dom.imageBox.width / this.$dom.maskBox.width;
        const maskRatioHeight = this.$dom.imageBox.height / this.$dom.maskBox.height;
        const zoomerRatioWidth = this.$dom.zoomerBox.width / this.$dom.imageBox.width;
        const zoomerRatioHeight = this.$dom.zoomerBox.height / this.$dom.imageBox.height;
        let x = ev.offsetX - (this.$dom.maskBox.width / 2);
        let y = ev.offsetY - (this.$dom.maskBox.height / 2);
        // 
        if (ev.offsetX <= this.$dom.maskBox.width / 2)
            x = 0;
        if (ev.offsetX >= this.$dom.imageBox.width - this.$dom.maskBox.width / 2)
            x = this.$dom.imageBox.width - this.$dom.maskBox.width;
        if (ev.offsetY <= this.$dom.maskBox.height / 2)
            y = 0;
        if (ev.offsetY >= this.$dom.imageBox.height - this.$dom.maskBox.height / 2)
            y = this.$dom.imageBox.height - this.$dom.maskBox.height;
        maskBox.style.transform = `translate(${x}px,${y}px)`;
        this.$dom.zoomerBox.el.style.backgroundSize = `${maskRatioWidth * zoomerRatioWidth * 100}%`;
        this.$dom.zoomerBox.el.style.backgroundPosition = `-${x * maskRatioWidth * zoomerRatioWidth}px -${y * maskRatioHeight * zoomerRatioHeight}px`;
    }
    onmouseleave(ev) {
        this.$dom.maskBox.el.style.visibility = 'hidden';
        this.$dom.zoomerBox.el.style.visibility = 'hidden';
    }
    onimgLoad(ev) {
        const currentEle = ev.currentTarget;
        // console.log(currentEle, currentEle.clientWidth,111)
        this.$dom.image.width = currentEle.clientWidth;
        this.$dom.image.height = currentEle.clientHeight;
        this.$dom.zoomerBox.el.style.backgroundSize = `${this.$dom.image.width / this.$dom.maskBox.width * 100}% ${this.$dom.image.height / this.$dom.maskBox.height * 100}%`;
    }
    // 更换图片
    replace(option) {
        this.$opt = option;
        if (typeof option === 'string') {
            this.initImageBox();
            this.$dom.image.el.setAttribute('src', option);
            this.$dom.zoomerBox.el.style.backgroundImage = `url(${option})`;
        }
        else {
            if (option.headImg) {
                this.initFatVideoBox();
                this.$dom.image.el.setAttribute('src', option.headImg);
                this.$dom.zoomerBox.el.style.backgroundImage = `url(${option.headImg})`;
            }
            else
                this.initVideoBox();
            this.$dom.video.el.setAttribute('src', option.videoUrl);
        }
    }
}
function throttle(fn, delay) {
    let time;
    return function (arg) {
        // console.log(arg,'=>')
        if (time)
            return;
        time = setTimeout(() => {
            fn(arg);
            time = null;
        }, delay);
    };
}

module.exports = ProductZoomer;
