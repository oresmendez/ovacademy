"use client";
import React, { useRef, useState, useEffect } from "react";
import { styled } from "@/app/components/utils/rutas";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaImage,
  FaListUl,
} from "react-icons/fa";
import { MdFormatAlignJustify } from "react-icons/md";

export default function EditarContenido({ descripcion, setDescripcion, readOnly = false }) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const prevDescripcionRef = useRef("");

    useEffect(() => {
  const handleKeyDown = (e) => {
    if (!selectedImage) return;

    if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      selectedImage.remove();
      setSelectedImage(null);
      updateHtml();
    }
  };

  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, [selectedImage]);

  useEffect(() => {
  const handlePaste = (e) => {
    e.preventDefault(); // Evita el comportamiento por defecto

    const text = e.clipboardData.getData("text/plain"); // Solo texto
    const selection = window.getSelection();

    if (!selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    range.deleteContents();

    const textNode = document.createTextNode(text);
    range.insertNode(textNode);

    // Mover el cursor al final del texto pegado
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);

    updateHtml(); // Actualiza la descripción sin estilos
  };




  const editor = editorRef.current;
  if (editor) {
    editor.addEventListener("paste", handlePaste);
  }

  return () => {
    if (editor) {
      editor.removeEventListener("paste", handlePaste);
    }
  };
}, []);


useEffect(() => {
  if (
    editorRef.current &&
    descripcion &&
    descripcion !== prevDescripcionRef.current
  ) {
    editorRef.current.innerHTML = descripcion.trim();
    prevDescripcionRef.current = descripcion;

    const wrappers = editorRef.current.querySelectorAll('[data-image-wrapper]');

    wrappers.forEach(wrapper => {
      const img = wrapper.querySelector("img");
      if (!img) return;

      // Asegura que siempre se pueda hacer clic para mostrar los handles
img.addEventListener("dblclick", (e) => {
  e.stopPropagation();
  setSelectedImage(wrapper);

  const handles = wrapper.querySelectorAll(".resize-handle");
  handles.forEach((handle) => {
    handle.style.display = "block";
  });
});


      // Elimina handles viejos (si los hay) para evitar duplicados
      wrapper.querySelectorAll(".resize-handle").forEach(h => h.remove());

      // Vuelve a agregar los handles
      const corners = ["nw", "ne", "sw", "se"];
      corners.forEach((corner) => {
        const handle = document.createElement("div");
        handle.className = "resize-handle";
        handle.style.cssText = `
          display: none;
          position: absolute;
          width: 12px;
          height: 12px;
          background: #000;
          border-radius: 50%;
          cursor: ${corner}-resize;
          z-index: 10;
          ${corner.includes("n") ? "top: -6px;" : "bottom: -6px;"}
          ${corner.includes("w") ? "left: -6px;" : "right: -6px;"}
        `;
        handle.addEventListener("mousedown", (e) =>
          startResizing(e, wrapper, img, corner)
        );
        wrapper.appendChild(handle);
      });
    });
  }
}, [descripcion]);


  useEffect(() => {
    const handleClickOutside = () => {
      if (selectedImage) {
        const handles = selectedImage.querySelectorAll(".resize-handle");
        handles.forEach((handle) => {
          handle.style.display = "none";
        });
      }
      setSelectedImage(null);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [selectedImage]);

const updateHtml = () => {
  const clone = editorRef.current.cloneNode(true);
  clone.querySelectorAll(".resize-handle").forEach(el => el.remove());
  const newHtml = clone.innerHTML.trim();

  if (newHtml !== prevDescripcionRef.current) {
    setDescripcion(newHtml);
    prevDescripcionRef.current = newHtml;
  }

};

if (readOnly) {
  return (
    <Wrapper>
      <EditorArea
        ref={editorRef}
        contentEditable={false}
        suppressContentEditableWarning={true}
        dangerouslySetInnerHTML={{ __html: descripcion }}
          onInput={updateHtml}
  onDragStart={(e) => e.preventDefault()}
  onDrop={(e) => e.preventDefault()}
  onDragOver={(e) => e.preventDefault()}
        style={{
          border: "none",
          background: "none",
          padding: "1rem",
          width: "100%",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      />
    </Wrapper>
  );
}




  const exec = (command, value = null) => {
  const sel = window.getSelection();
  const editor = editorRef.current;

  if (!sel.rangeCount || !editor.contains(sel.anchorNode)) {
    editor.focus();
    return;
  }

  const range = sel.getRangeAt(0);

  document.execCommand(command, false, value);


    updateHtml();
  };

const insertImageAtCursor = (src) => {
  const wrapper = document.createElement("div");
wrapper.contentEditable = false; // 🔒 evita que el wrapper se pueda arrastrar o editar
  wrapper.dataset.imageWrapper = "true";
  wrapper.style.cssText = `
    display: inline-block;
    position: relative;
    width: 50%;
    max-width: 100%;
    margin: 8px 12px 8px 0;
  box-sizing: border-box;
  user-select: none;
  -webkit-user-drag: none;
  pointer-events: auto;
  `;

  const img = document.createElement("img");
  img.src = src;
img.draggable = false; // 🚫 impide arrastre
  img.style.cssText = `
    width: 100%;
    height: auto;
    display: block;
    cursor: pointer;
  user-select: none;
  -webkit-user-drag: none;
  `;
img.addEventListener("dragstart", (e) => e.preventDefault());

  // 🔁 Mostrar handles en click o doble click
  const showHandles = (e) => {
    e.stopPropagation();
    setSelectedImage(wrapper);

    const handles = wrapper.querySelectorAll(".resize-handle");
    handles.forEach((handle) => {
      handle.style.display = "block";
    });
  };

  img.addEventListener("click", showHandles);
  img.addEventListener("dblclick", showHandles);

  wrapper.appendChild(img);

  // 📌 Agregar handles de redimensionamiento
  const corners = ["nw", "ne", "sw", "se"];
  corners.forEach((corner) => {
    const handle = document.createElement("div");
    handle.className = "resize-handle";
    handle.style.cssText = `
      display: none;
      position: absolute;
      width: 12px;
      height: 12px;
      background: #000;
      border-radius: 50%;
      cursor: ${corner}-resize;
      z-index: 10;
      ${corner.includes("n") ? "top: -6px;" : "bottom: -6px;"}
      ${corner.includes("w") ? "left: -6px;" : "right: -6px;"}
    `;
    handle.addEventListener("mousedown", (e) =>
      startResizing(e, wrapper, img, corner)
    );
    wrapper.appendChild(handle);
  });

  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const range = sel.getRangeAt(0);
  range.deleteContents();
  range.insertNode(wrapper);

  range.setStartAfter(wrapper);
  range.setEndAfter(wrapper);
  sel.removeAllRanges();
  sel.addRange(range);

  updateHtml();
};


const startResizing = (e, wrapper, img, corner) => {
  e.preventDefault();
  e.stopPropagation();

  const startX = e.clientX;
  const startY = e.clientY;
  const rect = wrapper.getBoundingClientRect();
  const startWidth = rect.width;
  const startHeight = rect.height;

  const aspectRatio = startWidth / startHeight;
  const editorWidth = editorRef.current.offsetWidth;

  const minSize = 50;
  const maxSize = editorWidth - 20; // margen de seguridad

  const onMouseMove = (moveEvent) => {
    const dx = moveEvent.clientX - startX;
    const dy = moveEvent.clientY - startY;

    let newWidth = startWidth;
    let newHeight = startHeight;

    if (corner.includes("e")) newWidth += dx;
    if (corner.includes("w")) newWidth -= dx;

    // 🔒 Limita el tamaño dentro de los márgenes del editor
    if (newWidth > maxSize) newWidth = maxSize;
    if (newWidth < minSize) newWidth = minSize;

    newHeight = newWidth / aspectRatio;

    wrapper.style.width = `${newWidth}px`;
    wrapper.style.height = `${newHeight}px`;

    img.style.width = "100%";
    img.style.height = "100%";
    img.style.objectFit = "contain";
  };

  const onMouseUp = () => {
    updateHtml();
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};






  const insertImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      insertImageAtCursor(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };



const applyFontSize = (size) => {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const range = sel.getRangeAt(0);
  if (range.collapsed) return;

  // 1️⃣ Aplica tamaño usando execCommand (usa 1–7, no px)
  document.execCommand("fontSize", false, 7);

  // 2️⃣ Convierte los <font> generados a <span style="font-size:Xpx">
  const editor = editorRef.current;
  editor.querySelectorAll("font[size]").forEach((font) => {
    font.removeAttribute("size");
    font.style.fontSize = `${size}px`;
  });

  const select = document.querySelector("#fontSizeSelect");
  if (select) select.value = "";

  updateHtml();
};




  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <Wrapper>
      <Toolbar>
<select
  id="fontSizeSelect"
  onChange={(e) => applyFontSize(e.target.value)}
  defaultValue=""
  style={{
    padding: "0.4rem",
    borderRadius: "0.375rem",
    border: "1px solid #9ca3af",
  }}
>
  <option value="" disabled>Tamaño</option>
  <option value="12">12px</option>
  <option value="14">14px</option>
  <option value="16">16px</option>
  <option value="18">18px</option>
  <option value="20">20px</option>
  <option value="24">24px</option>
</select>




        <IconButton onClick={() => exec("bold")}>
          <FaBold />
        </IconButton>
        <IconButton onClick={() => exec("italic")}>
          <FaItalic />
        </IconButton>
        <IconButton onClick={() => exec("underline")}>
          <FaUnderline />
        </IconButton>
        <IconButton onClick={() => exec("justifyLeft")} bg="blue">
          <FaAlignLeft />
        </IconButton>
        <IconButton onClick={() => exec("justifyCenter")} bg="blue">
          <FaAlignCenter />
        </IconButton>
        <IconButton onClick={() => exec("justifyRight")} bg="blue">
          <FaAlignRight />
        </IconButton>
        <IconButton onClick={() => exec("justifyFull")} bg="blue">
          <MdFormatAlignJustify />
        </IconButton>
        <IconButton onClick={() => exec("insertUnorderedList")} bg="gray">
          <FaListUl />
        </IconButton>
        <IconButton onClick={triggerFileInput} bg="green">
          <FaImage />
        </IconButton>
        <HiddenInput
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={insertImage}
        />
      </Toolbar>

      <EditorArea ref={editorRef} contentEditable dir="ltr" onInput={updateHtml} />

      {selectedImage && (
        <ImageToolbar
          style={{
            top:
              selectedImage.getBoundingClientRect().top + window.scrollY - 40,
            left: selectedImage.getBoundingClientRect().left + window.scrollX,
          }}
        >
          <FloatButton
            onClick={() => {
              selectedImage.style.cssText =
                selectedImage.style.cssText.replace(/float:\s*right;/, "") +
                "float: left; margin: 8px 12px 8px 0;";
              setSelectedImage(null);
              updateHtml();
            }}
          >
            Izquierda
          </FloatButton>
          <FloatButton
            onClick={() => {
              selectedImage.style.cssText = selectedImage.style.cssText
                .replace(/float:\s*(left|right);/, "")
                .replace(/margin:[^;]+;/, "") +
                "display: block; margin: 0 auto 16px auto; float: none;";
              setSelectedImage(null);
              updateHtml();
            }}
          >
            Centro
          </FloatButton>
          <FloatButton
            onClick={() => {
              selectedImage.style.cssText =
                selectedImage.style.cssText.replace(/float:\s*left;/, "") +
                "float: right; margin: 8px 0 8px 12px;";
              setSelectedImage(null);
              updateHtml();
            }}
          >
            Derecha
          </FloatButton>
        </ImageToolbar>
      )}
    </Wrapper>
  );
}

// ==============================
// Estilos con styled-components
// ==============================

const Wrapper = styled.div`
  padding: 1rem;
  width: 100%;
`;

const Toolbar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const IconButton = styled.button.attrs(() => ({
  type: "button", // ⚠️ evita que dispare submit
}))`
  background-color: ${({ bg }) =>
    bg === "blue"
      ? "#2563eb"
      : bg === "red"
      ? "#dc2626"
      : bg === "green"
      ? "#16a34a"
      : "#1f2937"};
  color: white;
  padding: 0.5rem;
  border-radius: 0.375rem;
  border: none;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;


const HiddenInput = styled.input`
  display: none;
`;

const EditorArea = styled.div`
  width: 100%;
  min-height: 200px;
  padding: 1rem;
  border: 1px solid #9ca3af;
  border-radius: 0.375rem;
  background-color: white;
  margin-bottom: 1.5rem;
  outline: none;
  white-space: pre-wrap;
  word-wrap: break-word;
  display: block;
  overflow-wrap: break-word;
  word-break: break-word;
  text-align: justify; /* 👈 añade esto para justificar correctamente */

  /* NUEVO: limita y oculta contenido que se desborde */
  max-width: 100%;
  overflow: hidden;
  position: relative;

  ul, ol {
    padding-left: 1.5rem;
    margin: 0.5rem 0;
    list-style-type: disc; /* 👈 muestra viñetas */
  }

  ol {
    list-style-type: decimal; /* para listas numeradas */
  }

  li {
    margin-bottom: 0.25rem;
  }
  &::after {
    content: "";
    display: block;
    clear: both;
  }

img,
[data-image-wrapper] {
  user-select: none !important;
  -webkit-user-drag: none !important; /* ✅ evita arrastre real */
  pointer-events: auto;
}

`;


const ImageToolbar = styled.div`
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  padding: 4px;
  border-radius: 4px;
  z-index: 100;
  display: flex;
  gap: 4px;
`;

const FloatButton = styled.button.attrs(() => ({
  type: "button", // ✅ también evita submit
}))`
  background: #f3f3f3;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
`;
