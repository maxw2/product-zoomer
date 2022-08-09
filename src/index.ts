interface DOM {
    'zoomer-box'?: DOMELE // 发
    imageBox?: DOMELE // 商品图盒子
    image?: DOMELE // 商品图片
    maskBox?: DOMELE // 小蒙版 放大镜
    maskTop?: DOMELE // 顶层蒙版
    zoomerBox?: DOMELE // 放大图片
}

interface DOMELE {
    el: HTMLElement,
    width: number,
    height: number,
    child?: DOMELE[]
}
import { createElement } from "./util"
class ProductZoomer {
    $el: Element
    $dom: DOM
    $opt: any
    constructor(el: string | Element, options: any) {
        this.$el = typeof el === 'string' ? document.querySelector(el) : el
        console.log(this.$el)
        this.initDom()
        this.initEvent()
    }

    // 
    initDom() {
        const className = this.$el.classList[0]
        this.$dom = createElement({
            tag: 'div',
            key: `zoomer-box`,
            attrs: [{ 'class': `${className}-zoomer-box` }],
            child: [{
                tag: 'div',
                key: 'imageBox',
                attrs: [{ 'class': `${className}-zoomer-box-imageBox` }],
                child: [{
                    tag: 'img',
                    key: 'image',
                    attrs: [{ 'class': `${className}-zoomer-box-imageBox-image` }]
                }, {
                    tag: 'div',
                    key: 'maskBox',
                    attrs: [{ 'class': `${className}-zoomer-box-imageBox-maskBox` }]
                }]
            }, {
                tag: 'div',
                key: 'maskTop',
                attrs: [{ 'class': `${className}-zoomer-box-maskTop` }]
            }, {
                tag: 'div',
                key: 'zoomerBox',
                attrs: [{ 'class': `${className}-zoomer-box-zoomerBox` }]
            }]
        })
        this.$el.appendChild(this.$dom['zoomer-box'].el)
        console.log(this.$dom, 'createElement')

    }

    // 添加事件
    initEvent() {
        const mouseFn = throttle(this.onmousemove.bind(this), 10)

        this.$dom.maskTop.el.addEventListener('mouseenter', this.onmouseenter.bind(this))
        this.$dom.maskTop.el.addEventListener('mousemove', mouseFn.bind(this))
        this.$dom.maskTop.el.addEventListener('mouseleave', this.onmouseleave.bind(this))

        this.$dom.image.el.addEventListener('load', this.onimgLoad.bind(this))
    }

    onmouseenter(ev: MouseEvent) {
        this.$dom.maskBox.el.style.visibility = 'visible'
        this.$dom.zoomerBox.el.style.visibility = 'visible'
    }

    onmousemove(ev: MouseEvent) {
        const maskBox = this.$dom.maskBox.el

        const maskRatioWidth = this.$dom.imageBox.width / this.$dom.maskBox.width
        const maskRatioHeight = this.$dom.imageBox.height / this.$dom.maskBox.height
        const zoomerRatioWidth = this.$dom.zoomerBox.width / this.$dom.imageBox.width
        const zoomerRatioHeight = this.$dom.zoomerBox.height / this.$dom.imageBox.height

        let x = ev.offsetX - (this.$dom.maskBox.width / 2)
        let y = ev.offsetY - (this.$dom.maskBox.height / 2)
        // 
        if (ev.offsetX <= this.$dom.maskBox.width / 2) x = 0
        if (ev.offsetX >= this.$dom.imageBox.width - this.$dom.maskBox.width / 2) x = this.$dom.imageBox.width - this.$dom.maskBox.width
        if (ev.offsetY <= this.$dom.maskBox.height / 2) y = 0
        if (ev.offsetY >= this.$dom.imageBox.height - this.$dom.maskBox.height / 2) y = this.$dom.imageBox.height - this.$dom.maskBox.height

        maskBox.style.transform = `translate(${x}px,${y}px)`

        this.$dom.zoomerBox.el.style.backgroundPosition = `-${x * maskRatioWidth * zoomerRatioWidth}px -${y * maskRatioHeight * zoomerRatioHeight}px`
    }

    onmouseleave(ev: MouseEvent) {
        this.$dom.maskBox.el.style.visibility = 'hidden'
        this.$dom.zoomerBox.el.style.visibility = 'hidden'
    }

    onimgLoad(ev: Event) {
        const currentEle = ev.currentTarget as HTMLImageElement
        // console.log(currentEle, currentEle.clientWidth,111)
        this.$dom.image.width = currentEle.clientWidth
        this.$dom.image.height = currentEle.clientHeight
        this.$dom.zoomerBox.el.style.backgroundSize = `${this.$dom.image.width / this.$dom.maskBox.width * 100}% ${this.$dom.image.height / this.$dom.maskBox.height * 100}%`
    }


    // 更换图片
    repeact(imgUrl: string) {
        this.$dom.image.el.setAttribute('src', imgUrl)
        this.$dom.zoomerBox.el.style.backgroundImage = `url(${imgUrl})`
    }

    render() {

    }

}

function throttle(fn: Function, delay: number) {
    let time: NodeJS.Timeout
    return function (arg: any) {
        // console.log(arg,'=>')
        if (time) return
        time = setTimeout(() => {
            fn(arg)
            time = null
        }, delay)
    }
}


export default ProductZoomer