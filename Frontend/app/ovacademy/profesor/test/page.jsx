'use client'; import { useEffect } from '@/app/components/utils/rutas';
import React, { useRef, useState } from 'react';
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaEraser,
  FaImage,
} from 'react-icons/fa';

export default function HtmlEditor() {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [htmlContent, setHtmlContent] = useState(null);

  // Ejecuta comandos execCommand
  const exec = (command, value = null) => {
    document.execCommand(command, false, value);
    updateHtml();
  };

  // Actualiza estado con contenido HTML actual
  const updateHtml = () => {
    if (editorRef.current) setHtmlContent(editorRef.current.innerHTML);
  };

  // Inicio redimensionamiento
  const startResize = (e, img, direction) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;

    const startWidth = img.offsetWidth;
    const startHeight = img.offsetHeight;

    function doResize(ev) {
      ev.preventDefault();
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes('right')) {
        newWidth = startWidth + (ev.clientX - startX);
      }
      if (direction.includes('left')) {
        newWidth = startWidth - (ev.clientX - startX);
      }
      if (direction.includes('bottom')) {
        newHeight = startHeight + (ev.clientY - startY);
      }
      if (direction.includes('top')) {
        newHeight = startHeight - (ev.clientY - startY);
      }

      newWidth = Math.max(50, newWidth);
      newHeight = Math.max(50, newHeight);

      img.style.width = newWidth + 'px';
      img.style.height = newHeight + 'px';
    }

    function stopResize(ev) {
      ev.preventDefault();
      document.removeEventListener('mousemove', doResize);
      document.removeEventListener('mouseup', stopResize);
      updateHtml();
    }

    document.addEventListener('mousemove', doResize);
    document.addEventListener('mouseup', stopResize);
  };

  // Inicio mover imagen
  const startDrag = (e, wrapper) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;

    // Posición actual relativa al offsetParent
    const style = window.getComputedStyle(wrapper);
    const matrix = new DOMMatrixReadOnly(style.transform);
    let currentX = matrix.m41;
    let currentY = matrix.m42;

    function doDrag(ev) {
      ev.preventDefault();

      const dx = ev.clientX - startX;
      const dy = ev.clientY - startY;

      wrapper.style.transform = `translate(${currentX + dx}px, ${currentY + dy}px)`;
    }

    function stopDrag(ev) {
      ev.preventDefault();
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);
      updateHtml();
    }

    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
  };

  // Crear imagen con handles y movimiento
  const createResizableImage = (src) => {
    const wrapper = document.createElement('span');
    wrapper.style.position = 'relative';
    wrapper.style.display = 'inline-block';
    wrapper.style.border = '1px dashed #aaa';
    wrapper.style.padding = '2px';
    wrapper.style.cursor = 'move'; // cursor para mover imagen

    const img = document.createElement('img');
    img.src = src;
    img.style.width = '300px';
    img.style.height = 'auto';
    img.style.display = 'block';
    img.style.userSelect = 'none';
    img.style.pointerEvents = 'none'; // evita que el img bloquee eventos al wrapper para mover

    wrapper.appendChild(img);

    // Manejar drag para mover imagen al hacer click en wrapper (no handles)
    wrapper.addEventListener('mousedown', (e) => {
      // Sólo drag si no se clickea en handles
      if (e.target === wrapper) {
        startDrag(e, wrapper);
      }
    });

    // Handles en 4 esquinas para redimensionar
    const handles = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];

    handles.forEach(pos => {
      const handle = document.createElement('div');
      handle.style.position = 'absolute';
      handle.style.width = '12px';
      handle.style.height = '12px';
      handle.style.background = '#007bff';
      handle.style.borderRadius = '50%';
      handle.style.zIndex = '10';
      handle.style.userSelect = 'none';

      // Cursor según handle (más preciso)
      switch (pos) {
        case 'top-left': handle.style.cursor = 'nwse-resize'; break;
        case 'top-right': handle.style.cursor = 'nesw-resize'; break;
        case 'bottom-left': handle.style.cursor = 'nesw-resize'; break;
        case 'bottom-right': handle.style.cursor = 'nwse-resize'; break;
      }

      // Posición handle
      if (pos.includes('top')) handle.style.top = '-6px';
      if (pos.includes('bottom')) handle.style.bottom = '-6px';
      if (pos.includes('left')) handle.style.left = '-6px';
      if (pos.includes('right')) handle.style.right = '-6px';

      // Impedir que el handle arrastre texto al seleccionarlo
      handle.style.userSelect = 'none';

      // Inicio redimensionar
      handle.addEventListener('mousedown', (e) => startResize(e, img, pos));

      wrapper.appendChild(handle);
    });

    return wrapper;
  };

  // Insertar imagen en cursor
  const insertImageAtCursor = (src) => {
    const wrapper = createResizableImage(src);

    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const range = sel.getRangeAt(0);
    range.deleteContents();
    range.insertNode(wrapper);

    // Mueve cursor después de la imagen
    range.setStartAfter(wrapper);
    range.setEndAfter(wrapper);
    sel.removeAllRanges();
    sel.addRange(range);

    updateHtml();
  };

  // Insertar imagen desde input
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

  // Limpiar editor
  const clearEditor = () => {
    if (editorRef.current) editorRef.current.innerHTML = '';
    updateHtml();
  };

  // Trigger input file
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    updateHtml();
  }, []);

  return (
    <div className="p-4 w-full max-w-7xl mx-auto" style={{ marginTop: '30rem' }}>
      <h2 className="text-2xl font-bold mb-4">Editor Visual WYSIWYG</h2>

      <div className="flex flex-wrap gap-2 mb-3">
        <button onClick={() => exec('bold')} className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700"><FaBold /></button>
        <button onClick={() => exec('italic')} className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700"><FaItalic /></button>
        <button onClick={() => exec('underline')} className="bg-gray-800 text-white p-2 rounded hover:bg-gray-700"><FaUnderline /></button>
        <button onClick={() => exec('justifyLeft')} className="bg-blue-700 text-white p-2 rounded hover:bg-blue-600"><FaAlignLeft /></button>
        <button onClick={() => exec('justifyCenter')} className="bg-blue-700 text-white p-2 rounded hover:bg-blue-600"><FaAlignCenter /></button>
        <button onClick={() => exec('justifyRight')} className="bg-blue-700 text-white p-2 rounded hover:bg-blue-600"><FaAlignRight /></button>
        <button onClick={clearEditor} className="bg-red-600 text-white p-2 rounded hover:bg-red-500"><FaEraser /></button>

        <button onClick={triggerFileInput} className="bg-green-700 text-white p-2 rounded hover:bg-green-600">
          <FaImage />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={insertImage}
          hidden
        />
      </div>

      <div
        ref={editorRef}
        contentEditable
        onInput={updateHtml}
        className="w-full min-h-[200px] p-4 border border-gray-400 rounded bg-white mb-6"
        style={{
          outline: 'none',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          minHeight: '200px',
          cursor: 'text',
        }}
      />

      <h3 className="text-xl font-semibold mb-2">Código HTHOLAGHOASDASKD;LSAKD;KSALML generado:</h3>
      <textarea
        value={htmlContent || ''}
        readOnly
        className="w-full h-60 p-3 border border-gray-300 rounded bg-gray-100 font-mono resize-none"
      />
    </div>
  );
}
