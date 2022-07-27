interface DOM {
    imageBox: DOMELE // 商品图盒子
    image: DOMELE // 商品图片
    maskBox: DOMELE // 小蒙版 放大镜
    maskTop: DOMELE // 顶层蒙版
    zoomerBox: DOMELE // 放大图片
}

interface DOMELE {
    el: HTMLElement,
    width: number,
    height: number
}

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

        const imageBox = document.createElement('div')
        const image = document.createElement('img')
        const maskBox = document.createElement('div')
        const maskTop = document.createElement('div')
        const zoomerBox = document.createElement('div')
        const zoomerImg = document.createElement('img')

        imageBox.className = `${className}-imageBox`
        image.className = `${className}-imageBox-image`
        maskBox.className = `${className}-imageBox-maskBox`
        maskTop.className = `${className}-maskTop`
        zoomerBox.className = `${className}-zoomerBox`
        zoomerImg.className = `${className}-zoomerBox-image`


        setTimeout(() => {
            this.$dom.imageBox.width = imageBox.clientWidth
            this.$dom.imageBox.height = imageBox.clientHeight
            this.$dom.image.width = image.clientWidth
            this.$dom.image.height = image.clientHeight
            this.$dom.maskBox.width = maskBox.clientWidth
            this.$dom.maskBox.height = maskBox.clientHeight
            this.$dom.maskTop.width = maskTop.clientWidth
            this.$dom.maskTop.height = maskTop.clientHeight
            this.$dom.zoomerBox.width = zoomerBox.clientWidth
            this.$dom.zoomerBox.height = zoomerBox.clientHeight
            
            this.$dom.zoomerBox.el.style.backgroundSize = `${this.$dom.image.width / this.$dom.maskBox.width * 100}% ${this.$dom.image.height / this.$dom.maskBox.height * 100}%`
        })


        this.$dom = {
            imageBox: {
                el: imageBox,
                width: imageBox.clientWidth,
                height: imageBox.clientHeight
            },

            image: {
                el: image as HTMLImageElement,
                width: image.clientWidth,
                height: image.clientHeight
            },

            maskBox: {
                el: maskBox,
                width: maskBox.clientWidth,
                height: maskBox.clientHeight
            },

            maskTop: {
                el: maskTop,
                width: maskTop.clientWidth,
                height: maskTop.clientHeight
            },

            zoomerBox: {
                el: zoomerBox,
                width: zoomerBox.clientWidth,
                height: zoomerBox.clientHeight
            }

        }

        this.$el.appendChild(this.$dom.imageBox.el)
        this.$dom.imageBox.el.append(this.$dom.image.el, this.$dom.maskBox.el)
        this.$el.appendChild(this.$dom.maskTop.el)
        this.$el.appendChild(this.$dom.zoomerBox.el)

    }

    // 添加事件
    initEvent() {
        const mouseFn = throttle(this.onmousemove.bind(this), 10)

        this.$dom.maskTop.el.addEventListener('mouseenter', this.onmouseenter.bind(this))
        this.$dom.maskTop.el.addEventListener('mousemove', mouseFn.bind(this))
        // this.$dom.maskTop.el.addEventListener('mousemove', this.onmousemove.bind(this))
        this.$dom.maskTop.el.addEventListener('mouseleave', this.onmouseleave.bind(this))

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