"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import { ResizableImage } from "@/app/components/utils/ResizableImage";
import { styled } from "@/app/components/utils/rutas";
import { useCallback, useEffect, useRef, useState } from "react";

export default function ComponenteTest() {
    const [imagenActivaSrc, setImagenActivaSrc] = useState(null);
    const [contenidoHTML, setContenidoHTML] = useState("");
    const editorRef = useRef(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: false,
                listItem: false,
            }),
            TextStyle,
            Color,
            ResizableImage,
            BulletList,
            ListItem,
        ],
        content: "<p>Haz clic en una imagen para seleccionarla</p>",
    });

    useEffect(() => {
        const handleClick = (e) => {
            if (e.target.tagName === "IMG" && e.target.classList.contains("selectable-image")) {
                const src = e.target.getAttribute("src");
                setImagenActivaSrc(src);
            } else {
                setImagenActivaSrc(null);
            }
        };

        const container = editorRef.current;
        if (container) {
            container.addEventListener("click", handleClick);
        }

        return () => {
            if (container) {
                container.removeEventListener("click", handleClick);
            }
        };
    }, []);

    const insertarImagen = useCallback(() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = () => {
            const file = input.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    editor?.chain().focus().setImage({
                        src: reader.result,
                        width: "300",
                    }).run();
                };
                reader.readAsDataURL(file);
            }
        };
        input.click();
    }, [editor]);

    const cambiarTamañoImagen = () => {
        if (!imagenActivaSrc) return;
        const nuevoAncho = prompt("Nuevo ancho en px:", "300");
        if (!nuevoAncho) return;

        const transaction = editor.state.tr;
        const { doc } = editor.state;

        doc.descendants((node, pos) => {
            if (node.type.name === "image" && node.attrs.src === imagenActivaSrc) {
                transaction.setNodeMarkup(pos, undefined, {
                    ...node.attrs,
                    width: nuevoAncho,
                });
            }
        });

        editor.view.dispatch(transaction);
        editor.commands.focus();
    };

    const verContenido = () => {
        const html = editor?.getHTML();
        setContenidoHTML(html);
        console.log("Contenido HTML:", html);
    };

    const guardarContenido = async () => {
        const html = editor?.getHTML();
        if (!html) return;

        console.log("Contenido a guardar:", html);

        // Descomenta para guardar en base de datos:
        // try {
        //     const res = await fetch("/api/guardar", {
        //         method: "POST",
        //         headers: { "Content-Type": "application/json" },
        //         body: JSON.stringify({ contenido: html }),
        //     });

        //     if (res.ok) {
        //         alert("✅ Contenido guardado correctamente");
        //     } else {
        //         alert("❌ Error al guardar");
        //     }
        // } catch (error) {
        //     console.error(error);
        //     alert("Error al conectar con el servidor");
        // }
    };

    return (
        <Container>
            <Toolbar>
                <button onClick={() => editor?.chain().focus().toggleBold().run()}>Negrita</button>
                <button onClick={() => editor?.chain().focus().toggleItalic().run()}>Cursiva</button>
                <button onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>Título</button>
                <button onClick={() => editor?.chain().focus().toggleBulletList().run()}>
                    Lista
                </button>
                <input
                    type="color"
                    onChange={(e) =>
                        editor?.chain().focus().setColor(e.target.value).run()
                    }
                />
                <button onClick={insertarImagen}>Insertar imagen</button>
                <button onClick={cambiarTamañoImagen} disabled={!imagenActivaSrc}>
                    Cambiar tamaño imagen
                </button>
            </Toolbar>

            <EditorBox ref={editorRef}>
                <EditorContent editor={editor} />
            </EditorBox>

            <BotonesExtras>
                <button onClick={verContenido}>Ver contenido HTML</button>
                <button onClick={guardarContenido}>Guardar en base de datos</button>
            </BotonesExtras>

            {contenidoHTML && (
                <VistaPrevia>
                    <h3>Vista previa</h3>
                    <div dangerouslySetInnerHTML={{ __html: contenidoHTML }} />
                </VistaPrevia>
            )}
        </Container>
    );
}

// Estilos

const Container = styled.div`
    padding: 2rem;
    margin-top: 20rem;
`;

const Toolbar = styled.div`
    margin-bottom: 1rem;

    button,
    input[type="color"] {
        margin-right: 0.5rem;
        padding: 0.4rem 0.8rem;
        border: none;
        background: #eee;
        cursor: pointer;
    }

    button:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
`;

const EditorBox = styled.div`
    border: 1px solid #ccc;
    background: white;
    padding: 1rem;
    min-height: 200px;

    img.selectable-image {
        outline: 2px solid transparent;
        transition: outline 0.2s;
    }

    img.selectable-image:hover {
        outline: 2px dashed #888;
    }
`;

const BotonesExtras = styled.div`
    margin-top: 1rem;

    button {
        margin-right: 1rem;
        padding: 0.5rem 1rem;
        background: #0e76a8;
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 4px;
    }
`;

const VistaPrevia = styled.div`
    margin-top: 2rem;
    border-top: 1px solid #ccc;
    padding-top: 1rem;

    img {
        max-width: 100%;
    }
`;
