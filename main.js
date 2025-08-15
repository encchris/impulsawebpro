let objectTree = {
    mainRoot: []
};

let selectedPath = 'root'; // Guarda la ruta del nodo seleccionado.

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
    }
}

// Función para generar un nuevo nodo
function generateNewNode(tagName) {
    const id = `${tagName}-${Date.now()}`;
    return {
        item: tagName,
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
    };
}

// Función para generar el HTML de un nodo
function generateNodeHTML(node, path) {
    const isSelected = selectedPath === path ? 'active' : '';
    return `
        <div style="margin-left: 20px" class="treeview-item indented ${isSelected}" data-item="${path}">
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
        const newNode = generateNewNode(tagName);
        objectTree.mainRoot.push(newNode);  // Añadimos al objeto

        // Ahora renderizamos el nodo hijo dentro de Main-Root
        const rootDetailsContent = document.querySelector('.treeview-details-content');
        const detailsElement = rootDetailsContent.querySelector('details');  // El elemento <details>

        // Obtén la nueva posición del nodo hijo
        const nodePath = objectTree.mainRoot.length;  // Usamos el índice de los nodos como path

        // Crear el HTML para el nuevo nodo y agregarlo dentro de <details>
        detailsElement.innerHTML += generateNodeHTML(newNode, nodePath);

        // Limpiar el input
        document.getElementById('input-node').value = '';
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
