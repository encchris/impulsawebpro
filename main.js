import { MapApi, SelectedPath } from "./src/api/nodeMap.js";
import { renderStyles, renderToolset } from "./src/view/toolset/toolset.js";
import { renderTree } from "./src/view/treeview/treeview.js";
import { renderWorkArea } from "./src/view/workArea/workArea.js";

const selectedPath = new SelectedPath();
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
        
        selectedPath.set(selectedNode.dataset.item);
        document.getElementById('selected-path').textContent = selectedPath.get;

        renderStyles(selectedPath.get);
    }
}

// Función para generar un nuevo nodo
function generateNewNode(tagName) {
    const UUID = uuidv4()
    return {
            item: tagName,
            identifier: UUID,
            atributos: {},
            children: []
        };
}

// Función para agregar un nodo
function addNode() {
    const tagName = document.getElementById('input-node').value.trim();
    if (tagName) {
        const newNode = generateNewNode(tagName);

        addChildByIdentifierFast(selectedPath.get, newNode);

        renderStart();
        
        // Limpiar el input
        document.getElementById('input-node').value = '';
        console.log("treeView", Node.allNode);
    }
}

function renderStart() {
    if(!Node.allNode) return;

    const rootDetailsContent = document.querySelector('.treeview-details-content');
    const detailsElement = rootDetailsContent.querySelector('.treeview-root');  // El elemento <details>

    renderTree(detailsElement, selectedPath.get);
    renderWorkArea();
    renderToolset(selectedPath.get);
}

function addStyle() {
    const inputKey = document.getElementById('atributo');
    const inputValue = document.getElementById('atributo-value');

    if (selectedPath.get === 'root' || !inputKey.value || !inputKey.value) return;

    const nodeSelected = Node.nodeById(selectedPath.get);

    if (!nodeSelected.atributos.style) {
        nodeSelected.atributos.style = {};
    }

    nodeSelected.atributos.style[inputKey.value] = inputValue.value;
    Node.updateNode(selectedPath.get, nodeSelected);

    renderWorkArea();
    renderStyles(selectedPath.get);

    inputKey.value = '';
    inputValue.value = '';

    console.log(Node.nodeById(selectedPath.get).atributos);
}

function GuardarLocal() {
    const nodeToSave = Node.allNode;
    const arrayFromMap = Array.from(nodeToSave.entries());
    const jsonString = JSON.stringify(arrayFromMap);

    localStorage.setItem('Nodo', jsonString);
}

function newProject() {
    localStorage.removeItem('Nodo');
    Node.cleanNode();
    
    renderStart();
    renderStyles('');
}

document.addEventListener('DOMContentLoaded', function() {
    const sidebarTreeview = document.querySelector('.sidebar-treeview');
    const btnAddNode = document.getElementById('add-node');
    const btnAddStyle = document.getElementById('btn-add-style');

    renderStart();

    //Guardar y Nuevo
    const guardar = document.getElementById('btn-save');
    const nuevoProject = document.getElementById('btn-new');

    guardar.addEventListener('click', GuardarLocal)
    nuevoProject.addEventListener('click', newProject);
    
    // EVENTOS
    sidebarTreeview.addEventListener('click', (event) => { selectNode(event) });
    btnAddNode.addEventListener('click', addNode);
    btnAddStyle.addEventListener('click', addStyle);
});
