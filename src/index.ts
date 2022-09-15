interface DOM {
    box?: DOMELE // 发
    imageBox?: DOMELE // 商品图盒子
    image?: DOMELE // 商品图片

    maskBox?: DOMELE // 小蒙版 放大镜
    maskTop?: DOMELE // 顶层蒙版

    fatVideoBox?: DOMELE // 带封面商品
    fatImageBox?: DOMELE // 
    VideoBox?: DOMELE // 
    iconPlay?: DOMELE // 播放键
    iconClose?: DOMELE // 关闭键

    videoBox?: DOMELE // 商品视频盒子
    video?: VIDEOELE // 商品视频



    zoomerBox?: DOMELE // 放大图片
}

interface DOMELE {
    el: HTMLElement
    width: number
    height: number
    // child?: DOMELE[]
}

interface VIDEOELE {
    el: HTMLMediaElement
    width: number
    height: number
}

interface Replace {
    headImg?: string
    videoUrl: string
    icon?: string
}



import { render } from "./util"

import grid from './assest/grid.png'
import sprite from './assest/sprite.png'

class ProductZoomer {
    $el: Element
    $dom: DOM
    $opt: any
    constructor(el: string | Element, options?: Replace) {
        this.$el = typeof el === 'string' ? document.querySelector(el) : el
        this.$el.classList.add('product-zoomer')
        if (options) this.$opt = options

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
        const topEle = this.$dom?.imageBox?.el
        const template = `
            <div class='image-box' okey='imageBox' >
                <img class='image' okey='image' />
                <div class='mask-box' okey='maskBox'></div>
                <div class='mask-top' okey='maskTop'></div>
            </div>
        `


        if (this.$dom?.videoBox?.el) this.$dom.videoBox.el.remove()
        if (this.$dom?.fatVideoBox?.el) this.$dom.fatVideoBox.el.remove()
        if (topEle && topEle.parentElement) this.$el.append(this.$dom.imageBox.el)
        else {
            this.$dom = { ...this.$dom, ...render(template) }
            this.$el.append(this.$dom.imageBox.el)
            this.initZoomerBox()
            this.initEvent()
            this.$dom.maskBox.el.style.backgroundImage = `url(${grid})`
        }
        
    }
    // 
    initVideoBox() {
        const topEle = this.$dom?.videoBox?.el
        const template = `
            <div class='video-box' okey='videoBox'>
                <video controls='true' okey='video' />
            </div>
        `
        if (this.$dom?.imageBox?.el) this.$dom.imageBox.el.remove()
        if (this.$dom?.fatVideoBox?.el) this.$dom.fatVideoBox.el.remove()
        if (topEle && topEle.parentElement) this.$el.append(this.$dom.videoBox.el)
        else {
            console.log('video append')
            this.$dom = { ...this.$dom, ...render(template) }
            this.$el.append(this.$dom.videoBox.el)
        }


    }

    initFatVideoBox() {
        const topEle = this.$dom?.fatVideoBox?.el
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
        `

        if (this.$dom?.imageBox?.el) this.$dom.imageBox.el.remove()
        if (this.$dom?.videoBox?.el) this.$dom.videoBox.el.remove()

        if (topEle && topEle.parentElement) this.$el.append(this.$dom.fatVideoBox.el)
        else {
            this.$dom = { ...this.$dom, ...render(template) }
            this.$el.append(this.$dom.fatVideoBox.el)
            this.initFatEvent()
            this.$dom.maskBox.el.style.backgroundImage = `url(${grid})`
            this.$dom.iconPlay.el.style.backgroundImage = `url(${sprite})`
            this.$dom.iconClose.el.style.backgroundImage = `url(${sprite})`
        }

    }
    // 
    initZoomerBox() {
        const topEle = this.$dom?.fatVideoBox?.el
        const template = `
            <div class='zoomer-box' okey='zoomerBox'></div>
        `
        if (topEle && topEle.parentElement) return 
        else {
            this.$dom = { ...this.$dom, ...render(template) }
            this.$el.append(this.$dom.zoomerBox.el)
        }
        
    }

    // 添加事件
    initEvent() {
        const mouseFn = throttle(this.onmousemove.bind(this), 10)

        this.$dom.maskTop.el.addEventListener('mouseenter', this.onmouseenter.bind(this))
        this.$dom.maskTop.el.addEventListener('mousemove', mouseFn.bind(this))
        this.$dom.maskTop.el.addEventListener('mouseleave', this.onmouseleave.bind(this))

        // this.$dom.image.el.addEventListener('load', this.onimgLoad.bind(this))
    }

    // fat添加事件
    initFatEvent() {
        const mouseFn = throttle(this.onmousemove.bind(this), 10)

        this.$dom.maskTop.el.addEventListener('mouseenter', this.onmouseenter.bind(this))
        this.$dom.maskTop.el.addEventListener('mousemove', mouseFn.bind(this))
        this.$dom.maskTop.el.addEventListener('mouseleave', this.onmouseleave.bind(this))
        
        this.$dom.iconPlay.el.addEventListener('click', this.onclick.bind(this))
        this.$dom.iconPlay.el.addEventListener('mouseenter', ()=>{
            this.$dom.iconPlay.el.style.backgroundPosition = `-51px 0px`
        })
        this.$dom.iconPlay.el.addEventListener('mouseleave', ()=>{
            this.$dom.iconPlay.el.style.backgroundPosition = `0px 0px`
        })
        this.$dom.iconClose.el.addEventListener('click',()=>{
            this.$dom.fatImageBox.el.style.visibility = 'visible'
            console.log(this.$dom.fatImageBox, 'fatImageBox')
            const video = this.$dom.video.el 
            video.pause()
        })
    }

    onclick(ev:Event) {
        this.$dom.fatImageBox.el.style.visibility = 'hidden'
        const video = this.$dom.video.el 
        video.play()
        
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

        this.$dom.zoomerBox.el.style.backgroundSize = `${maskRatioWidth * zoomerRatioWidth * 100}%`
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
    replace(option: string | Replace) {
        this.$opt = option
        if (typeof option === 'string') {
            this.initImageBox()
            this.$dom.image.el.setAttribute('src', option)
            this.$dom.zoomerBox.el.style.backgroundImage = `url(${option})`
        }
        else {
            if (option.headImg) {
                this.initFatVideoBox()
                this.$dom.image.el.setAttribute('src', option.headImg)
                this.$dom.zoomerBox.el.style.backgroundImage = `url(${option.headImg})`
            }
            else this.initVideoBox()
            this.$dom.video.el.setAttribute('src', option.videoUrl)
        }
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