const nodeIndex = new Map([]);

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
        nodeIndex.delete(key);
        return nodeIndex;
    }
}