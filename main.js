const nodeIndex = new Map([]);
const listItem = new Map([]);

let selectedPath = 'root';

function addChildByIdentifierFast(parentId, newChild) {
    console.log(parentId);
    
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

        
        console.log("selectedNode", selectedNode);
        
        
        selectedPath = selectedNode.dataset.item;
        document.getElementById('selected-path').textContent = selectedPath;

        console.log("selectedNode: ", selectedNode.tagName);
        

        if(selectedNode.tagName === "SUMMARY") {
            const node = selectedNode.parentNode;
            console.log("nodo: ", node.open);
            
            nodeIndex.get(selectedPath).atributos.open = !node.open;
        }
        console.log("Añade donde debe ser");        
    }
}

// Función para generar un nuevo nodo
function generateNewNode(tagName) {
    const id = `${tagName}-${Date.now()}`;
    const UUID = uuidv4()
    return [
        {
            item: tagName,
            identifier: UUID,
            atributos: {
                id: id,
                class: ['default-class']
            },
            propiedades: {
                [id]: {
                    background: '#fff',
                    color: '#000'
                }
            },
            children: []
        },
        
        UUID
    ];
}

// Función para generar el HTML de un nodo
function generateNodeHTML(nodeIndex) {

    // 🔹 recolectar todas las keys que son hijos
    const allChildrenKeys = new Set();
    for (const [_, value] of nodeIndex) {
        if (value.children && value.children.length > 0) {
            for (const childKey of value.children) {
                allChildrenKeys.add(childKey);
            }
        }
    }
    
    for (const [key, value] of nodeIndex) {
        if (allChildrenKeys.has(key)) continue;

        const isSelected = selectedPath === key ? ' active' : '';

        if(value.children.length != 0) {
            console.log(value);
            const newChildren = nodeChildren(value, isSelected, nodeIndex);
            listItem.set(key, newChildren);
            continue;
        }

        const html = nodeHtml(value, isSelected);
        listItem.set(key, html);
    }
}

function nodeHtml(element, isSelected) {
    const container = document.createElement("div");
    container.className = `treeview-item indented${isSelected}`;
    container.style.marginLeft = "20px";
    container.dataset.item = element.identifier;

    const nameSpan = document.createElement("span");
    nameSpan.className = "treeview-name";
    nameSpan.textContent = element.item;

    const deleteSpan = document.createElement("span");
    deleteSpan.className = "delete-icon";
    deleteSpan.style.cursor = "pointer";
    deleteSpan.style.color = "red";
    deleteSpan.textContent = "🗑";

    container.appendChild(nameSpan);
    container.appendChild(deleteSpan);

    return container;
}

function nodeChildren(element, isSelected, nodeIndex) {
    // Crear el elemento <details>
    const details = document.createElement("details");
    details.className = "treeview-details indented";
    
    details.open = element.atributos.open ?? true;

    // Crear el <summary>
    const summary = document.createElement("summary");
    summary.className = `treeview-item${isSelected}`;
    summary.dataset.item = element.identifier;

    // Span con el nombre
    const nameSpan = document.createElement("span");
    nameSpan.className = "treeview-name";
    nameSpan.textContent = element.item;

    // Armar el summary
    summary.appendChild(nameSpan);

    // Armar el details
    details.appendChild(summary);

    if (element.children && element.children.length > 0) {
        for (const childKey of element.children) {
            const childValue = nodeIndex.get(childKey); // obtener el nodo real
            if (!childValue) continue;

            const childIsSelected = selectedPath === childKey ? ' active' : '';
            let childNode;

            if (childValue.children && childValue.children.length > 0) {
                // Recursividad: si el hijo tiene hijos
                childNode = nodeChildren(childValue, childIsSelected, nodeIndex);
            } else {
                childNode = nodeHtml(childValue, childIsSelected);
            }

            details.appendChild(childNode); // agregar dentro del <details>
        }
    }

    return details;
}

// Función para agregar un nodo
function addNode() {
    const tagName = document.getElementById('input-node').value.trim();
    if (tagName) {
        const [newNode, UUID] = generateNewNode(tagName);

        addChildByIdentifierFast(selectedPath, newNode);

        const rootDetailsContent = document.querySelector('.treeview-details-content');
        const detailsElement = rootDetailsContent.querySelector('details');  // El elemento <details>

        generateNodeHTML(nodeIndex);
        updateTree(detailsElement, listItem);

        // Limpiar el input
        document.getElementById('input-node').value = '';

        console.log("selected path: ", selectedPath);
        
        console.log("treeView", nodeIndex);
        
    }
}

function getAllChildren(element) {
    const map = new Map();
    
    function traverse(node) {
        if (node.dataset && node.dataset.item) {
            map.set(node.dataset.item, node);
        }
        node.childNodes.forEach(child => traverse(child));
    }
    
    traverse(element);
    return map;
}

function updateTree(detailsElement, listItem) {
    console.log("listItem", listItem);
    
    const existingChildren = getAllChildren(detailsElement);

    // Agregar o reemplazar
    for (const [key, node] of listItem) {
        console.log(key, node);
        const findDataSet = existingChildren.get(key);
        const existingNode = findDataSet?.tagName === "SUMMARY" ? findDataSet.parentNode : findDataSet;

        console.log("existe", existingNode);
        
        
        if (!existingNode) {
            detailsElement.appendChild(node);
        } else if (existingNode.outerHTML !== node.outerHTML) {
            console.log("reemplazamos todo");
            
            existingNode.replaceWith(node);
        }
    }

    // Quitar lo que sobra
    for (const [key, el] of existingChildren) {
        if (!listItem.has(key) && key != 'root') {
            el.remove();
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const sidebarTreeview = document.querySelector('.sidebar-treeview');
    const btnAddNode = document.getElementById('add-node');
    
    // EVENTOS
    sidebarTreeview.addEventListener('click', (event) => { selectNode(event) });
    btnAddNode.addEventListener('click', addNode);
});
