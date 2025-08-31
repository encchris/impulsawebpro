const nodeIndex = new Map([]);

export class MapApi {
    /* TODO: tendría la función de:
    agregar, eliminar, actualizar y leer*/
    get allNode() {
        return nodeIndex;
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