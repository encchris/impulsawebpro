import { Children, useEffect, useState } from "react"


function addChildByPath(tree: any[], path: string, newItem: any): any[] {
  const parts = path.split('.').map(p => parseInt(p, 10) - 1);

  // Clonamos todo el árbol para mantener inmutabilidad
  const newTree = structuredClone(tree); // o JSON.parse(JSON.stringify(tree))

  let node = newTree;
  for (let i = 0; i < parts.length; i++) {
    if (i === parts.length - 1) {
      node[parts[i]].children = [
        ...(node[parts[i]].children || []),
        newItem
      ];
    } else {
      node = node[parts[i]].children;
    }
  }
  return newTree;
}

function renderTree(
  items: any[],
  parentPath = "",
  onSelect?: (path: string) => void,
  selectedPath?: string,
  onDelete?: (path: string) => void
) {
  return items.map((item, idx) => {
    const currentPath = parentPath ? `${parentPath}.${idx + 1}` : `${idx + 1}`;
    const isActive = selectedPath === currentPath;

    if (item.children && item.children.length > 0) {
      return (
        <details
          className="treeview-details"
          key={item.atributos.id + idx}
          open
          data-item={currentPath}
        >
          <summary
            className={`treeview-item ${isActive ? "active" : ""}`}
            onClick={e => {
              e.stopPropagation();
              onSelect?.(currentPath);
            }}
          >
            <span className="treeview-toggle">▼</span>
            <span className="treeview-name">{item.item}</span>
            <span
              className="delete-icon"
              onClick={e => {
                e.stopPropagation();
                onDelete?.(currentPath);
              }}
              style={{ marginLeft: "auto", cursor: "pointer", color: "red" }}
            >
              🗑
            </span>
          </summary>
          <div style={{ marginLeft: 20 }}>
            {renderTree(item.children, currentPath, onSelect, selectedPath, onDelete)}
          </div>
        </details>
      );
    } else {
      return (
        <div
          className={`treeview-item indented ${isActive ? "active" : ""}`}
          key={item.atributos.id + idx}
          data-item={currentPath}
          onClick={e => {
            e.stopPropagation();
            onSelect?.(currentPath);
          }}
        >
          <span className="treeview-icon">#</span>
          <span className="treeview-name">{item.item}</span>
          <span
            className="delete-icon"
            onClick={e => {
              e.stopPropagation();
              onDelete?.(currentPath);
            }}
            style={{ marginLeft: "auto", cursor: "pointer", color: "red" }}
          >
            🗑
          </span>
        </div>
      );
    }
  });
}

function removeItemByPath(tree: any[], path: string): any[] {
  const parts = path.split('.').map(p => parseInt(p, 10) - 1);
  const newTree = structuredClone(tree);

  let node = newTree;
  for (let i = 0; i < parts.length - 1; i++) {
    node = node[parts[i]].children;
  }
  node.splice(parts[parts.length - 1], 1);

  return newTree;
}

function App() {

  const [mainRoot, setMainRoot] = useState({ mainRoot: [] });
  const [tagName, setTagName] = useState("");
  const [selectedPath, setSelectedPath] = useState<string>("root");

  function handleDelete(path: string) {
    setMainRoot(prev => ({
      ...prev,
      mainRoot: removeItemByPath(prev.mainRoot, path)
    }));
    if (selectedPath === path) {
      setSelectedPath(null);
    }
  }

  useEffect(() => {
    console.log(mainRoot);
  }, [mainRoot]);

  function addHTML() {
    if (!tagName) return;

    const newItem = {
      item: tagName,
      atributos: {
        id: `${tagName}ID`,
        class: ["primera-clase", "active"]
      },
      propiedades: {
        [`${tagName}ID`]: {
          background: "#fff",
          color: "#eee"
        }
      },
      children: []
    };

    if (selectedPath && selectedPath !== "root") {
      setMainRoot(prev => {
        // Clonamos el árbol para calcular el nuevo path
        const parts = selectedPath.split('.').map(p => parseInt(p, 10) - 1);
        const newTree = structuredClone(prev.mainRoot);
        let node = newTree;

        for (let i = 0; i < parts.length; i++) {
          node = node[parts[i]].children;
        }

        const newChildIndex = (node?.length || 0) + 1; // nuevo índice
        const newChildPath = `${selectedPath}.${newChildIndex}`;

        const updatedTree = addChildByPath(prev.mainRoot, selectedPath, newItem);

        // seleccionamos el nuevo hijo
        setSelectedPath(newChildPath);

        return {
          ...prev,
          mainRoot: updatedTree
        };
      });
    } else {
      setMainRoot(prev => {
        const newIndex = prev.mainRoot.length + 1;
        const newPath = `${newIndex}`;

        const updatedTree = [...prev.mainRoot, newItem];

        // seleccionamos el nuevo hijo en root
        setSelectedPath(newPath);

        return {
          ...prev,
          mainRoot: updatedTree
        };
      });
    }

    setTagName("");
  }

  return (
    <>
        <aside className="sidebar">
          <section className="sidebar-header">
              <div className="header-project">
                  <span className="icon">📄</span>
                  <div className="project-info">
                      <span className="project-title">Project Name</span>
                  </div>
              </div>
              <span className="icon">☰</span>
          </section>
          
          <section className="sidebar-nav">
              <button className="nav-button active">Archivos</button>
              <button className="nav-button">Componentes</button>
              <span className="search-icon">🔍</span>
          </section>

          <section className="sidebar-pages">
              <div className="pages-header">
                  <h3>Pages</h3>
                  <span className="add-page">+</span>
              </div>
              <div className="page-item active">
                  <p>Page 1</p>
              </div>
              <div className="page-limit-info">
                  <p>2 free pages left.</p>
                  <a href="#">See plans that offer more</a>
              </div>
          </section>

          <section className="custom-html">
            <div>
              <input
                type="text"
                placeholder="Add tag HTML"
                value={tagName}
                onChange={e => setTagName(e.target.value)}
              />
              <button
                type="button"
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  addHTML();
                }}
              >
                Add
              </button>
            </div>
            {selectedPath && (
              <div style={{ color: "#aaa", fontSize: 12 }}>
                Añadiendo hijo a: {selectedPath}
              </div>
            )}
          </section>

          <section className="sidebar-treeview">
              <div className="treeview-header">
                  <h3>Tree View</h3>
                  <span className="treeview-icon">☰</span>
              </div>
              <div className="treeview-group">  
                <details className="treeview-details" open>
                  <summary
                    className={`treeview-item ${selectedPath === "root" ? "active" : ""}`}
                    data-item="root"
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedPath("root");
                    }}
                  >
                    <span className="treeview-toggle">▼</span>
                    <span className="treeview-name">Main-Root</span>
                  </summary>
                  <div style={{ marginLeft: 20 }}>
                    {renderTree(mainRoot.mainRoot, "", setSelectedPath, selectedPath, handleDelete)}
                  </div>
                </details>
              </div>
          </section>
      </aside>
        <main>
          <div id="main-root">

          </div>
          <h1>main</h1>
        </main>
        <div>
          <h1>panel</h1>
        </div>
    </>
  )
}

export default App
