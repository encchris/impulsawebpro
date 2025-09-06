import { MapApi } from "../../api/nodeMap.js";
import { renderWorkArea } from "../workArea/workArea.js";
const Node = new MapApi();

export function renderToolset(selectedPath) {
    
}

export function renderStyles(selectedPath) {
    
    const nodeSelected = Node.nodeById(selectedPath);
    console.log("entramos", nodeSelected);
    const styleContainer = document.getElementById('styles');
    styleContainer.innerHTML = '';

    if(!nodeSelected.atributos.style) return;

    const keys = Object.keys(nodeSelected.atributos.style);

    keys.forEach(key => {
        const value = nodeSelected.atributos.style[key];
        const div = document.createElement('div');
        const label = document.createElement('label');
        const input = document.createElement('input');
        div.className = 'tool';
        label.htmlFor = `input-${key}`;
        input.dataset.item = key;
        input.onblur = (event) => updateAttr(event, selectedPath);
        input.id = `input-${key}`;

        label.textContent = key;
        input.value = value;

        div.appendChild(label);
        div.appendChild(input);

        styleContainer.appendChild(div);
    })
}

function updateAttr(event, selectedPath) {
    const input = event.target

    const nodeSelected = Node.nodeById(selectedPath);
    nodeSelected.atributos.style[input.dataset.item] = input.value;
    Node.updateNode(selectedPath, nodeSelected);

    renderWorkArea();
}