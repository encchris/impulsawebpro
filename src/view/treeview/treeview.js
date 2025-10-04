import { MapApi, SelectedPath } from "../../api/nodeMap.js";
import { renderWorkArea } from "../workArea/workArea.js";

const Node = new MapApi;
const selectedPath = new SelectedPath();
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

        const deleteSpan = document.createElement("button");
        deleteSpan.onclick = (event) => {deleteTreeItem(event)};
        deleteSpan.className = "delete-icon";
        deleteSpan.textContent = "🗑";

        summary.appendChild(deleteSpan);
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
        const deleteSpan = document.createElement("button");
        deleteSpan.onclick = (event) => {deleteTreeItem(event)};
        deleteSpan.className = "delete-icon";
        deleteSpan.textContent = "🗑";
        element.appendChild(deleteSpan);
    }
    return element;
}
function deleteTreeItem(event) {
    const button = event.target;
    const key = button.parentElement?.getAttribute('data-item');
    
    Node.deleteNode(key);
    
    selectedPath.set('root');
    document.getElementById('selected-path').textContent = selectedPath.get;

    const rootDetailsContent = document.querySelector('.treeview-details-content');
    const detailsElement = rootDetailsContent.querySelector('.treeview-root');

    renderTree(detailsElement, 'root');
    renderWorkArea()
}