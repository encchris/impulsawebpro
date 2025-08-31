//main-root
import { MapApi } from "../../api/nodeMap.js";
const Node = new MapApi;

export function renderWorkArea() {
    const main = document.querySelector('#main-root');
    main.innerHTML = "";
    
    Node.getParents.forEach(value => {
        main.appendChild(createHTML(value));
    })

    function createHTML(value) {
        //Generación del código HTML
        const element = document.createElement(value.item);
        element.dataset.item = value.identifier;

        if (value.children && value.children.length > 0) { // Si tiene hijos
            // Agrega todos los hijos
            value.children.forEach(childId => {
                const childNode = Node.nodeById(childId);
                const childElement = createHTML(childNode);
                if (childElement) {
                    element.appendChild(childElement);
                }
            });
            
        } else {
            element.textContent = "Modificar valor";
        }
        return element;
    }
}