"use client";
import { styled, toast, apiRest, ButtonSave } from '@/app/components/utils/rutas';
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import { ResizableImage } from "@/app/components/utils/ResizableImage";
import { useEffect } from "react";

export default function EditarContenido({ descripcion, setDescripcion, idContenido, nombre, volverAlListado }) {
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
        content: descripcion || "<p>Escribe algo aquí...</p>",
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            setDescripcion(html); // actualiza el estado externo
        },
    });

    useEffect(() => {
        if (editor && descripcion !== editor.getHTML()) {
            editor.commands.setContent(descripcion || "<p></p>");
        }
    }, [descripcion]);

    const editar_contenido = async () => {
        const html = editor?.getHTML();
        console.log("Contenido HTML:", html);
        console.log("Nombre:", nombre);
        console.log("ID Contenido:", idContenido);

        
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/contenido`
            const response = await apiRest.fetchPut(url, {
                id: idContenido, 
                nombre, 
                descripcion: html
            });
            console.log("Respuesta de la API:", response);
            if (response.status === 200) {
                toast.success(response.data.message);
                volverAlListado();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error al editar una unidad.");
        }
    };

    return (
        <Component>
            <Toolbar>
                <button onClick={() => editor?.chain().focus().toggleBold().run()}>Negrita</button>
                <button onClick={() => editor?.chain().focus().toggleItalic().run()}>Cursiva</button>
                <button onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>Título</button>
                <button onClick={() => editor?.chain().focus().toggleBulletList().run()}>Lista</button>
                <input
                    type="color"
                    onChange={(e) =>
                        editor?.chain().focus().setColor(e.target.value).run()
                    }
                />
            </Toolbar>

            <EditorBox>
                <EditorContent editor={editor} />
            </EditorBox>
                    <ButtonSave onClick={() => editar_contenido()} className="mt-10" classFather="center" >
                                        Guardar
					</ButtonSave>

        </Component>
    );
}

// Estilos

const Component = styled.div`
    padding: 1rem;
`;

const Toolbar = styled.div`
    margin-bottom: 1rem;
    button, input[type="color"] {
        margin-right: 0.5rem;
        padding: 0.4rem 0.8rem;
        border: none;
        background: #eee;
        cursor: pointer;
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
