interface Vdom {
    tag: string
    okey?: string
    attrs?: { [key: string]: string }[],
    child?: (Vdom | string)[] | null
}
interface Edata {
    el: HTMLElement
    width: number
    height: number
}
interface Edom {
    [key: string]: Edata
}
interface Sdom {
    head: string
    child: Array<Sdom | string> | null
}

// 
export function splitTemplate(vTem: string):Sdom {
    // 暂用警号匹配
    const Rex = /(<[^\/].*?[^\/]>)|(<.*? \/>)|(<\/.*?>)|#(.*)#/gm
    // const RexString = />(.*)</gm
    const arr = []
    const temArr = []
    let exec = null
    // console.log(vTem)
    while ((exec = Rex.exec(vTem)) !== null) {
        // console.log(exec, 'exec')
        if (exec[1]) {
            temArr.push(exec[1])
            arr.push(1)
        }
        else if (exec[2]) {
            temArr.push(exec[2])
            arr.push(3)
        }
        else if (exec[3]) {
            temArr.push(exec[3])
            arr.push(2)
        }
        else if(exec[4]) {
            // temArr.push(exec[4])
            // arr.push(4)
            // console.log(exec[4], 'execDying')
        }
    }
    console.log(arr, temArr)
    const t = long(arr, temArr)[0]
    const vdom = createVirtualDom_(t)
    console.log(vdom, 'vdom')
    // console.log(t)
    return t
}

// 
export function createVirtualDom_(Sdom: Sdom):Vdom {
    // console.log(Sdom, 'Sdom')
    let vdom:Vdom = {
        tag: null
    }
    const head = Sdom.head
    const Rex = /(\w+)\s|(\w+)=[',"](.+?)[',"]/g

    let execCache
    while((execCache = Rex.exec(head)) !== null) {
        if(execCache[1]) vdom.tag = execCache[1]
        else if(execCache[2] && execCache[2] === 'okey') vdom.okey = execCache[3]
        else if(execCache[2] && execCache[3]) {
            // console.log(typeof execCache[2], 'ex', execCache[3])
            const key = execCache[2]
            if(!vdom.attrs) vdom.attrs = []
            vdom.attrs.push({ [key]: execCache[3] })
        }
    }
    vdom.child = Sdom.child && Sdom.child.map(item => createVirtualDom_(item))

    return vdom
}

// 
export function createElement(vdom: Vdom): [Edom, Edata] {
    let edata: Edata = { el: null, width: null, height: null }
    let edom: any = {}

    const ele = document.createElement(vdom.tag)
    vdom?.attrs?.forEach(item => {
        Object.keys(item).forEach(key => {
            const d = ele.getAttribute(key)
            if (d) ele.setAttribute(key, d + ' ' + item[key])
            else ele.setAttribute(key, item[key])
        })
    });


    edata.el = ele
    setTimeout(() => {
        edata.width = ele.clientWidth
        edata.height = ele.clientHeight
    })

    vdom?.child?.forEach(item => {
        if (typeof item === 'string') {
            ele.append(item)
        } else {
            const [_edom, _edata] = createElement(item)
            ele.append(_edata.el)
            edom = { ...edom, ..._edom }
        }
    });

    if (vdom.okey) return [{ [vdom.okey]: edata, ...edom }, edata]
    else return [edom, edata]
}

function long(arr:number[], sArr:string[]):Sdom[] {
    let hk = 0
    let h = 0
    let _arr:Sdom[] = []

    arr.forEach((v:number, i:number) => {
        if(v === 1) hk++
        else if(v === 2) hk--
        
        if(hk === 0) {
            // const rex = /[^<>]*/g
            // console.log(sArr[h],' 1', rex.exec(sArr[h])[0])
            _arr.push({
                head: sArr[h],
                child: long(arr.slice(h + 1,i), sArr.slice(h + 1,i))
            })
            h = i + 1
        }
    })

    return _arr.length ? _arr : null

}


export function createVirtualDom(vTem: string): Vdom {

    const _vTem = vTem
    const headTagReg = /<(.*?)>/gm
    let vdom: Vdom
    const headArr = []
    const botArr = []
    let execCache
    while ((execCache = headTagReg.exec(_vTem)) !== null) {
        if (/<\//.test(execCache[0])) botArr.push(execCache)
        else headArr.push(execCache)
    }
    // 数组的位数 遇到自闭合标签需要减一
    let index = 0
    headArr.forEach(item => {
        const tagReg = /(\w*) /
        const attrsReg = /(\w*)=[',"](.*?)[',"]/g
        const $ = item[1]
        // tag
        const tag = tagReg.exec($)[1]
        // attrs
        let cache
        let okey
        const attrs = []
        while ((cache = attrsReg.exec($)) !== null) {
            const key = cache[1]
            const value = cache[2]
            if (value && key !== 'okey') attrs.push({ [key]: value })
            else if (value && key === 'okey') okey = value
            // console.log(cache, 'cache')
        }
        console.log(item, 'item')
        // child 
        const singleRex = /<.*? \/>/
        if (singleRex.test(item[0])) {
            index--
            vdom = {
                tag,
                attrs,
                okey
            }
        } else {
            index++
            vdom = {
                tag,
                attrs,
                okey,
                // child: createTemplate(vTem.)
            }
        }

    })
    return vdom

}
