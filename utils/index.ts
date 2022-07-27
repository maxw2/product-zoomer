interface domTree {
    tagName: string
    attribute: attr[],
    children: string | domTree []
}

interface attr {
    [key:string]: string
}


export function renderDom(domTree: domTree) {
    
}