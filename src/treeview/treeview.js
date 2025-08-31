import { MapApi } from "../api/nodeMap.js";
const Node = new MapApi;

export function renderTree(rootContainer, selectedPath) {

    rootContainer.innerHTML = '';

    Node.getParents.forEach(rootNode => {
        const renderedElement = renderNode(rootNode, selectedPath);
        if (renderedElement) {
            rootContainer.appendChild(renderedElement);
        }
    });
}

function renderNode(node, selectedPath) {
    if (!node) return null;

    let element;
    const isSelected = selectedPath === node.identifier;
    
    if (node.children && node.children.length > 0) { // Si tiene hijos
        element = document.createElement("details");
        element.className = "treeview-details indented";
        element.open = true; 
        
        const summary = document.createElement("summary");
        summary.className = `treeview-item${isSelected ? ' active' : ''}`;
        summary.dataset.item = node.identifier;
        summary.textContent = node.item;
        element.appendChild(summary);
        
        // Agrega todos los hijos
        node.children.forEach(childId => {
            const childNode = Node.nodeById(childId);
            const childElement = renderNode(childNode);
            if (childElement) {
                element.appendChild(childElement);
            }
        });
        
    } else { // Si no tiene hijos, es un nodo hoja (un <div>)
        element = document.createElement("div");
        element.className = `treeview-item indented${isSelected ? ' active' : ''}`;
        element.dataset.item = node.identifier;
        element.textContent = node.item;
        
        // Agregar el ícono de basura y otros elementos al div aquí
        const deleteSpan = document.createElement("span");
        deleteSpan.className = "delete-icon";
        deleteSpan.textContent = "🗑";
        element.appendChild(deleteSpan);
    }
    return element;
}