//Nodo
const jsonString = localStorage.getItem('Nodo');
const arrayFromStorage = JSON.parse(jsonString) ?? [];

const nodeIndex = new Map(arrayFromStorage);
let selectedPath = 'root';
export class MapApi {
    /* TODO: tendría la función de:
    agregar, eliminar, actualizar y leer*/
    get allNode() {
        return nodeIndex;
    }

    get getParents() {
        const allChildrenIds = new Set(Array.from(nodeIndex.values()).flatMap(n => n.children || []));
        const rootNodes = Array.from(nodeIndex.values()).filter(node => !allChildrenIds.has(node.identifier));
        return rootNodes;
    }

    nodeById(key) {
        return nodeIndex.get(key);
    }

    updateNode(key, newNode) {
        nodeIndex.set(key, newNode);
        return nodeIndex;
    }

    deleteNode(key) {
        const node = this.nodeById(key);

        if(node.children) {
            node.children.forEach(child => {
                nodeIndex.delete(child);
            })
        }

        nodeIndex.delete(key);

        this.getParents.forEach(node => {
            const index = node.children.indexOf(key);
            if (index > -1) {
                node.children.splice(index, 1);
                return;
            }
        });
        return nodeIndex;
    }

    cleanNode() {
        nodeIndex.clear();
        return nodeIndex;
    }
}

export class SelectedPath {
    get get() {
        return selectedPath;
    }

    set(value) {
        selectedPath = value;
    }
}