const nodeIndex = new Map();

let objectTree = {
    mainRoot: []
};

let selectedPath = 'root'; // Guarda la ruta del nodo seleccionado.

buildNodeIndex(objectTree.mainRoot);

function buildNodeIndex(nodes) {
  for (const node of nodes) {
    nodeIndex.set(node.identifier, node);
    if (node.children && node.children.length > 0) {
      buildNodeIndex(node.children);
    }
  }
}

function addChildByIdentifierFast(parentId, newChild) {
    console.log(parentId);
    
    if (parentId === 'root') {
        nodeIndex.set(newChild.identifier, newChild); // registrar el nodo raíz
        return true;
    }

    const parent = nodeIndex.get(parentId);
    if (parent) {
        parent.children = parent.children || [];
        parent.children.push(newChild);
        nodeIndex.set(newChild.identifier, newChild); // registrar el hijo
        return true;
    }
    return false;
}



// Función para manejar la selección de un nodo
function selectNode(event) {
    if (event.target.classList.contains('treeview-item')) {
        // Quitar 'active' de todos los nodos
        const treeviewItems = document.querySelectorAll('.treeview-item');
        treeviewItems.forEach(item => item.classList.remove('active'));

        // Añadir 'active' al nodo seleccionado
        const selectedNode = event.target;
        selectedNode.classList.add('active');

        // Actualizar la ruta seleccionada
        selectedPath = selectedNode.dataset.item;
        document.getElementById('selected-path').textContent = selectedPath;

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
function generateNodeHTML(node, path) {
    const isSelected = selectedPath === path ? ' active' : '';
    return `
        <div style="margin-left: 20px" class="treeview-item indented${isSelected}" data-item="${path}">
            <span class="treeview-name">${node.item}</span>
            <span class="delete-icon" style="cursor: pointer; color: red;">🗑</span>
        </div>
    `;
}

// Función para eliminar un nodo
function deleteNode(event) {
    event.stopPropagation();  // Prevenir que se seleccione el nodo al hacer click en eliminar
    const itemToDelete = event.target.closest('.treeview-item');
    const itemIndex = Array.from(itemToDelete.parentNode.children).indexOf(itemToDelete);

    // Eliminar el nodo del array
    objectTree.mainRoot.splice(itemIndex, 1);
    
    // Volver a renderizar los hijos
    renderTreeView();
}

// Función para agregar un nodo
function addNode() {
    const tagName = document.getElementById('input-node').value.trim();
    if (tagName) {
        const [newNode, UUID] = generateNewNode(tagName);
        // if(selectedPath === "root") objectTree.mainRoot.push(newNode);  // Añadimos al objeto
        // else objectTree.mainRoot[selectedPath - 1].children.push(newNode);

        addChildByIdentifierFast(selectedPath, newNode);

        
        // Ahora renderizamos el nodo hijo dentro de Main-Root
        const rootDetailsContent = document.querySelector('.treeview-details-content');
        const detailsElement = rootDetailsContent.querySelector('details');  // El elemento <details>

        // Crear el HTML para el nuevo nodo y agregarlo dentro de <details>
        detailsElement.innerHTML += generateNodeHTML(newNode, UUID);

        // Limpiar el input
        document.getElementById('input-node').value = '';

        console.log("selected path: ", selectedPath);
        
        console.log("treeView", nodeIndex);
        
    }
}

// Función para renderizar los nodos hijos dentro de Main-Root
function renderTreeView() {
    const rootDetailsContent = document.querySelector('.treeview-details-content');
    const detailsElement = rootDetailsContent.querySelector('details');  // El elemento <details>
    detailsElement.innerHTML = '';  // Limpiar los hijos actuales

    // Crear los nuevos nodos hijos
    objectTree.mainRoot.forEach((node, index) => {
        const nodePath = `${index + 1}`;
        detailsElement.innerHTML += generateNodeHTML(node, nodePath);
    });

    // Asignamos el evento de eliminación a los nodos renderizados
    handleDeleteNode();
}

// Función para manejar la eliminación de los nodos
function handleDeleteNode() {
    const deleteIcons = document.querySelectorAll('.delete-icon');
    deleteIcons.forEach(icon => {
        icon.addEventListener('click', deleteNode);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const sidebarTreeview = document.querySelector('.sidebar-treeview');
    const btnAddNode = document.getElementById('add-node');
    
    // EVENTOS
    sidebarTreeview.addEventListener('click', (event) => { selectNode(event) });
    btnAddNode.addEventListener('click', addNode);
});
