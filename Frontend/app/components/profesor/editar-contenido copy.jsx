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
} from "react-icons/fa";
import { MdFormatAlignJustify } from "react-icons/md";

export default function EditarContenido({ descripcion, setDescripcion }) {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const prevDescripcionRef = useRef("");

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

  const exec = (command, value = null) => {
    document.execCommand(command, false, value);
    updateHtml();
  };

const insertImageAtCursor = (src) => {
  const wrapper = document.createElement("div");
  wrapper.contentEditable = true;
  wrapper.dataset.imageWrapper = "true";
  wrapper.style.cssText = `
    display: inline-block;
    position: relative;
    width: 50%;
    max-width: 100%;
    margin: 8px 12px 8px 0;
  `;

  const img = document.createElement("img");
  img.src = src;
  img.style.cssText = `
    width: 100%;
    height: auto;
    display: block;
    cursor: pointer;
  `;

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
  const startWidth = wrapper.offsetWidth;
  const startHeight = wrapper.offsetHeight;

  const editorWidth = editorRef.current.offsetWidth;

  const onMouseMove = (moveEvent) => {
    const dx = moveEvent.clientX - startX;
    const dy = moveEvent.clientY - startY;

    let newWidth = startWidth;
    let newHeight = startHeight;

    if (corner.includes("e")) newWidth += dx;
    if (corner.includes("w")) newWidth -= dx;
    if (corner.includes("s")) newHeight += dy;
    if (corner.includes("n")) newHeight -= dy;

    // Limita el ancho entre 30px y el ancho del editor
    const limitedWidth = Math.min(Math.max(30, newWidth), editorWidth);

    wrapper.style.width = `${limitedWidth}px`;
    wrapper.style.height = "auto";

    img.style.width = "100%";
    img.style.maxWidth = "100%";
    img.style.height = "auto";
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

  const updateHtml = () => {
    const clone = editorRef.current.cloneNode(true);
    clone.querySelectorAll(".resize-handle").forEach(el => el.remove());
    const newHtml = clone.innerHTML;
    if (newHtml !== descripcion) {
      setDescripcion(newHtml);
      prevDescripcionRef.current = newHtml;
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <Wrapper>
      <Toolbar>
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

const IconButton = styled.button`
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

  /* NUEVO: limita y oculta contenido que se desborde */
  max-width: 100%;
  overflow: hidden;
  position: relative;
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

const FloatButton = styled.button`
  background: #f3f3f3;
  border: none;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 12px;
`;
