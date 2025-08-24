const nodeIndex = new Map([]);

let selectedPath = 'root';

function addChildByIdentifierFast(parentId, newChild) {
    if (parentId === 'root') {
        nodeIndex.set(newChild.identifier, newChild);
        return true;
    }

    const parent = nodeIndex.get(parentId);
    if (parent) {
        parent.children = parent.children || [];
        parent.children.push(newChild.identifier);
        nodeIndex.set(newChild.identifier, newChild);
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

function renderTree(rootContainer, nodeIndex) {

    rootContainer.innerHTML = '';

    const allChildrenIds = new Set(Array.from(nodeIndex.values()).flatMap(n => n.children || []));
    const rootNodes = Array.from(nodeIndex.values()).filter(node => !allChildrenIds.has(node.identifier));

    rootNodes.forEach(rootNode => {
        const renderedElement = renderNode(rootNode);
        if (renderedElement) {
            rootContainer.appendChild(renderedElement);
        }
    });
}

function renderNode(node) {
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
            const childNode = nodeIndex.get(childId);
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

// Función para agregar un nodo
function addNode() {
    const tagName = document.getElementById('input-node').value.trim();
    if (tagName) {
        const newNode = generateNewNode(tagName);

        addChildByIdentifierFast(selectedPath, newNode);

        const rootDetailsContent = document.querySelector('.treeview-details-content');
        const detailsElement = rootDetailsContent.querySelector('.treeview-root');  // El elemento <details>

        renderTree(detailsElement, nodeIndex);

        // Limpiar el input
        document.getElementById('input-node').value = '';
        console.log("treeView", nodeIndex);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const sidebarTreeview = document.querySelector('.sidebar-treeview');
    const btnAddNode = document.getElementById('add-node');
    
    // EVENTOS
    sidebarTreeview.addEventListener('click', (event) => { selectNode(event) });
    btnAddNode.addEventListener('click', addNode);
});
