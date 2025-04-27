"use client";
import {
    useRef,
    useState,
    useEffect,
    styled
} from '@/app/components/utils/rutas';

export default function CustomEditor() {
  const [content, setContent] = useState("");
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  const forceLTR = () => {
    if (editorRef.current) {
      editorRef.current.setAttribute("dir", "ltr");
      editorRef.current.style.direction = "ltr";
      editorRef.current.style.textAlign = "left";

      // Forzar la posición del cursor a la izquierda
      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(editorRef.current);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML = content;
      forceLTR();

      // Agregar estilos CSS para las tablas dentro del editor
      const style = document.createElement("style");
      style.innerHTML = `
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
          background-color: white;
        }
        th {
          background-color: #f4f4f4;
        }
      `;
      document.head.appendChild(style);
    }
  }, [content]);

  const handleInput = () => {
    if (editorRef.current) {
      forceLTR();
      setContent(editorRef.current.innerHTML);
    }
  };

  const formatText = (command) => {
    document.execCommand(command, false, "");
    handleInput();
  };

  const insertTable = () => {
    if (editorRef.current) {
      const tableHTML = `
        <table>
          <tr>
            <th>Encabezado 1</th>
            <th>Encabezado 2</th>
          </tr>
          <tr>
            <td>Dato 1</td>
            <td>Dato 2</td>
          </tr>
        </table>
      `;
      document.execCommand("insertHTML", false, tableHTML);
      handleInput();
    }
  };

  const insertImage = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
        const imageUrl = URL.createObjectURL(file);

        if (editorRef.current) {
            const imageContainer = document.createElement("div");
            imageContainer.style.display = "block";

            const img = document.createElement("img");
            img.src = imageUrl;
            img.alt = "Imagen subida";
            img.setAttribute("loading", "lazy");

            imageContainer.appendChild(img);

            const selection = document.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.insertNode(imageContainer);

                // Agregar espacio sin usar <br>
                const space = document.createElement("div");
                space.style.height = "10px";
                range.insertNode(space);

                // Colocar el cursor después de la imagen
                range.setStartAfter(imageContainer);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            }

            let newContent = editorRef.current.innerHTML;

            // Asegurar que las imágenes estén auto-cerradas
            newContent = newContent.replace(/<img([^>]+)>/g, (match, attrs) => {
                return `<img ${attrs.replace(/style="[^"]*"/g, "")} />`;
            });

            setContent(newContent);
        }
    }
};




  
  
  
  
  
  

  const insertList = (type) => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (!selection.rangeCount) return;
  
      const range = selection.getRangeAt(0);
      
      // Determinar el tipo de lista (ul para viñetas, ol para enumeración)
      const list = document.createElement(type === "insertUnorderedList" ? "ul" : "ol");
      
      // Crear un primer elemento vacío en la lista
      const listItem = document.createElement("li");
      listItem.innerHTML = "<br />"; // Corregido, cerrando correctamente la etiqueta en JSX
      list.appendChild(listItem);
  
      // Insertar la lista en la posición actual del cursor
      range.deleteContents();
      range.insertNode(list);
      
      // Coloca el cursor dentro del primer elemento de la lista para que el usuario pueda escribir
      const newRange = document.createRange();
      newRange.selectNodeContents(listItem);
      newRange.collapse(false);
  
      selection.removeAllRanges();
      selection.addRange(newRange);
  
      // Actualizar el estado del contenido
      setContent(editorRef.current.innerHTML);
    }
  };
  
  
  

  return (
    <Componente>
          <div className="editor-container">
            <div className="toolbar">
              <button onClick={() => formatText("bold")}>
                <b>B</b>
              </button>
              <button onClick={() => formatText("italic")}>
                <i>I</i>
              </button>
              <button onClick={() => formatText("underline")}>
                <u>U</u>
              </button>
              <button onClick={() => insertList("insertUnorderedList")}>
                • Lista
              </button>
              <button onClick={() => insertList("insertOrderedList")}>
                1. Lista
              </button>
              <button onClick={insertTable}>📊 Tabla</button>
              <button onClick={insertImage}>🖼 Imagen</button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>
            <div
              ref={editorRef}
              contentEditable
              className="editor"
              dir="ltr"
              onInput={handleInput}
              suppressContentEditableWarning={true}
            />

            <p className="content-text">{content}</p>
          </div>
    </Componente>
  );
}

const Componente = styled.div`
  /* Contenedor principal */
  .editor {
    direction: ltr !important;
    text-align: left !important;
    unicode-bidi: normal !important;
  }

  .editor-container {
    padding: 16px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    max-width: 600px;
    margin: auto;
    background-color: #ffffff;
    font-family: Arial, sans-serif;
  }

  /* Barra de herramientas */
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
  }

  .toolbar button {
    padding: 8px 12px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background-color: #f4f4f4;
    transition: background 0.3s, transform 0.1s;
    font-size: 14px;
    font-weight: bold;
  }

  .toolbar button:hover {
    background-color: #ddd;
    transform: scale(1.05);
  }

  .toolbar button:active {
    transform: scale(0.95);
  }

  /* Editor */
  .editor {
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    min-height: 150px;
    outline: none;
    font-size: 16px;
    line-height: 1.5;
    background-color: #fafafa;
    transition: border 0.3s, background 0.3s;
  }

  .editor:focus {
    border-color: #0465ac;
    background-color: #ffffff;
  }

  /* Tablas dentro del editor */
  .editor table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }

  .editor th,
  .editor td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    background-color: white;
  }

  .editor th {
    background-color: #f4f4f4;
    font-weight: bold;
  }

  /* Imagen dentro del editor */
  .editor img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 10px auto;
  }

  /* Texto de contenido */
  .content-text {
    font-size: 14px;
    color: #666;
    margin-top: 10px;
  }
`;