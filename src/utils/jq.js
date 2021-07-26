

const $ = function (nodeOrSelector) {
    let nodes = {}
    if (typeof nodeOrSelector === 'string') {
        let temp = document.querySelectorAll(nodeOrSelector)
        for (let i = 0; i < temp.length; i++) {
            nodes[i] = temp[i]
        }
        nodes.length = temp.length

    } else if (nodeOrSelector instanceof Node) {
        nodes = {
            0: nodeOrSelector,
            length: 1
        }
    }

    nodes.getText = function () {
        var texts = []
        for (let i = 0; i < nodes.length; i++) {
            texts.push(nodes[i].textContent)
        }
        return texts
    }
    nodes.setText = function (text) {
        for (let i = 0; i < nodes.length; i++) {
            nodes[i].textContent = text
        }
    }
    //合并get和set
    nodes.text = function (text) {
        if (text === undefined) {
            var texts = []
            for (let i = 0; i < nodes.length; i++) {
                texts.push(nodes[i].textContent)
            }
            return texts
        } else {
            for (let i = 0; i < nodes.length; i++) {
                nodes[i].textContent = text
            }
        }
        return nodes
    }
    nodes.addClass = function (classes) {
        for (let i = 0; i < nodes.length; i++) {
            for (let key in classes) {
                var value = classes[key]
                var methodName = value ? 'add' : 'remove'
                nodes[i].classList[methodName](key)
            }
        }
    }
    return nodes
}
export default $;
