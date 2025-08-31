import { MapApi } from "./src/api/nodeMap.js";
import { renderTree } from "./src/treeview/treeview.js";
import { renderWorkArea } from "./src/workArea/workArea.js";

let selectedPath = 'root';
const Node = new MapApi();

function addChildByIdentifierFast(parentId, newChild) {
    if (parentId === 'root') {
        Node.updateNode(newChild.identifier, newChild);
        return true;
    }

    const parent = Node.nodeById(parentId);
    if (parent) {
        parent.children = parent.children || [];
        parent.children.push(newChild.identifier);
        Node.updateNode(newChild.identifier, newChild);
        return true;
    }
    return false;
}

// Función para manejar la selección de un nodo
function selectNode(event) {
    if (event.target.classList.contains('treeview-item')) {
        const treeviewItems = document.querySelectorAll('.treeview-item');
        treeviewItems.forEach(item => item.classList.remove('active'));

        const selectedNode = event.target;
        selectedNode.classList.add('active');        
        
        selectedPath = selectedNode.dataset.item;
        document.getElementById('selected-path').textContent = selectedPath;       
    }
}

// Función para generar un nuevo nodo
function generateNewNode(tagName) {
    const UUID = uuidv4()
    return {
            item: tagName,
            identifier: UUID,
            atributos: {},
            propiedades: {},
            children: []
        };
}

// Función para agregar un nodo
function addNode() {
    const tagName = document.getElementById('input-node').value.trim();
    if (tagName) {
        const newNode = generateNewNode(tagName);

        addChildByIdentifierFast(selectedPath, newNode);

        const rootDetailsContent = document.querySelector('.treeview-details-content');
        const detailsElement = rootDetailsContent.querySelector('.treeview-root');  // El elemento <details>

        renderTree(detailsElement, Node.allNode, selectedPath);
        renderWorkArea();
        // Limpiar el input
        document.getElementById('input-node').value = '';
        console.log("treeView", Node.allNode);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const sidebarTreeview = document.querySelector('.sidebar-treeview');
    const btnAddNode = document.getElementById('add-node');
    
    // EVENTOS
    sidebarTreeview.addEventListener('click', (event) => { selectNode(event) });
    btnAddNode.addEventListener('click', addNode);
});
