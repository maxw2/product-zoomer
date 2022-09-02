(function () {
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

  var css_248z = ".product-box-box {\n  position: relative;\n  width: 400px;\n  height: 400px; }\n  .product-box-box-imageBox {\n    position: relative;\n    width: 100%;\n    height: 100%;\n    overflow: hidden; }\n    .product-box-box-imageBox-image {\n      width: 100%; }\n    .product-box-box-imageBox-maskBox {\n      visibility: hidden;\n      position: absolute;\n      top: 0px;\n      left: 0px;\n      width: 100px;\n      height: 100px;\n      background: rgba(0, 0, 0, 0.5); }\n  .product-box-box-maskTop {\n    cursor: move;\n    position: absolute;\n    top: 0px;\n    left: 0px;\n    width: 100%;\n    height: 100%; }\n  .product-box-box-zoomerBox {\n    visibility: hidden;\n    position: absolute;\n    top: 0px;\n    right: -20px;\n    width: 600px;\n    height: 600px;\n    border: 1px solid gray;\n    transform: translateX(100%);\n    background-repeat: no-repeat; }\n";
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
      console.log(arr, temArr);
      const t = long(arr, temArr)[0];
      const vdom = createVirtualDom_(t);
      console.log(vdom, 'vdom');
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

  class ProductZoomer {
      constructor(el, options) {
          this.$el = typeof el === 'string' ? document.querySelector(el) : el;
          console.log(this.$el);
          this.initDom();
          this.initEvent();
      }
      // 
      initDom() {
          const className = this.$el.classList[0];
          const template = `<div class="${className}-box" okey="box" >
                <div class='${className}-box-imageBox' okey="imageBox" >
                    <img class="${className}-box-imageBox-image" okey="image" class="image-1" />
                    <div class="${className}-box-imageBox-maskBox" okey="maskBox"></div>
                </div>
                <div class="${className}-box-maskTop" okey="maskTop"></div>
                <div class="${className}-box-zoomerBox" okey="zoomerBox"></div>
            </div>`;
          // const vdom = createVirtualDom(template)
          const sdom = splitTemplate(template);
          const vdom = createVirtualDom_(sdom);
          this.$dom = createElement(vdom)[0];
          console.log(this.$dom.box, '$dom', sdom, 'sDom', vdom, 'vDom');
          // this.$dom = createElement({
          //     tag: 'div',
          //     okey: `zoomer-box`,
          //     attrs: [{ 'class': `${className}-zoomer-box` }],
          //     child: [{
          //         tag: 'div',
          //         okey: 'imageBox',
          //         attrs: [{ 'class': `${className}-zoomer-box-imageBox` }],
          //         child: [{
          //             tag: 'img',
          //             okey: 'image',
          //             attrs: [{ 'class': `${className}-zoomer-box-imageBox-image` }]
          //         }, {
          //             tag: 'div',
          //             okey: 'maskBox',
          //             attrs: [{ 'class': `${className}-zoomer-box-imageBox-maskBox` }]
          //         }]
          //     }, {
          //         tag: 'div',
          //         okey: 'maskTop',
          //         attrs: [{ 'class': `${className}-zoomer-box-maskTop` }],
          //         child: null
          //     }, {
          //         tag: 'div',
          //         okey: 'zoomerBox',
          //         attrs: [{ 'class': `${className}-zoomer-box-zoomerBox` }]
          //     },'This is Text']
          // })[0]
          console.log(this.$dom, 'createElement');
          this.$el.appendChild(this.$dom.box.el);
      }
      // 添加事件
      initEvent() {
          const mouseFn = throttle(this.onmousemove.bind(this), 10);
          this.$dom.maskTop.el.addEventListener('mouseenter', this.onmouseenter.bind(this));
          this.$dom.maskTop.el.addEventListener('mousemove', mouseFn.bind(this));
          this.$dom.maskTop.el.addEventListener('mouseleave', this.onmouseleave.bind(this));
          this.$dom.image.el.addEventListener('load', this.onimgLoad.bind(this));
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
          if (typeof option === 'string') {
              this.$dom.image.el.setAttribute('src', option);
              this.$dom.zoomerBox.el.style.backgroundImage = `url(${option})`;
          }
      }
      render() {
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

  // const pic = new ProductZoomer('.product-box',)
  // pic.repeact('https://gd-hbimg.huaban.com/72c96a5f19908bec1e71cae49ca0cc2a7c1e0e9858a99-24nwAk_fw1200')

  // console.log(pic)

  return ProductZoomer;

})();
