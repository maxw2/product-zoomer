interface Vdom {
    tag: string
    key?: string
    attrs?: { [key: string]: string }[],
    child?: Vdom[]
}

interface Edata {
    el: HTMLElement
    width: number
    height: number
}

interface Edom {
    [key: string]: Edata
}

export function createElement(vdom: Vdom): Edom | Edata {
    let edata: Edata = { el: null, width: null, height: null }
    let dData: any = {}

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

    // if (vdom.child) {
    vdom?.child?.forEach(item => {

        if (item.key) {
            const data = createElement(item) as Edom

            dData = { ...dData, ...data }
            edata.el.append(data[item.key].el)
        } else {
            const data = createElement(item) as Edata
            edata.el.append(data.el)
        }

    });
    // }
    if (vdom.key) {
        dData[vdom.key] = edata
        return  dData
    } 
    else return edata

    // return vdom.key ? dData || edata
    // return dData
}