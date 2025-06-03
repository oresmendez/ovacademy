"use client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import styled from "styled-components";
import { toast } from "@/app/components/utils/rutas";
import { ButtonSave } from "@/app/components/utils/rutas";

export default function CrearCuestionario() {
  const [preguntas, setPreguntas] = useState([
    {
      uid: uuidv4(),
      pregunta: "",
      opciones: [
        { id: uuidv4(), texto: "" },
        { id: uuidv4(), texto: "" },
      ],
    },
  ]);

  const agregarPregunta = () => {
    // Validar TODAS las preguntas existentes
    for (let i = 0; i < preguntas.length; i++) {
      const p = preguntas[i];
      if (!p.pregunta.trim()) {
        toast.error(`La pregunta ${i + 1} está vacía`);
        return;
      }
      const opcionesValidas = p.opciones.filter((op) => op.texto.trim() !== "");
      if (opcionesValidas.length < 2) {
        toast.error(`La pregunta ${i + 1} debe tener al menos 2 opciones no vacías`);
        return;
      }
    }

    // Si todo está OK, añadir nueva pregunta
    const nuevaPregunta = {
      uid: uuidv4(),
      pregunta: "",
      opciones: [
        { id: uuidv4(), texto: "" },
        { id: uuidv4(), texto: "" },
      ],
    };

    setPreguntas([...preguntas, nuevaPregunta]);
  };

  const actualizarTextoPregunta = (uid, texto) => {
    setPreguntas((prev) =>
      prev.map((p) =>
        p.uid === uid ? { ...p, pregunta: texto } : p
      )
    );
  };

  const actualizarOpcion = (preguntaUID, opcionID, nuevoTexto) => {
    setPreguntas((prev) =>
      prev.map((pregunta) =>
        pregunta.uid === preguntaUID
          ? {
              ...pregunta,
              opciones: pregunta.opciones.map((op) =>
                op.id === opcionID ? { ...op, texto: nuevoTexto } : op
              ),
            }
          : pregunta
      )
    );
  };

  const agregarOpcion = (preguntaUID) => {
    setPreguntas((prev) =>
      prev.map((pregunta) =>
        pregunta.uid === preguntaUID
          ? {
              ...pregunta,
              opciones: [...pregunta.opciones, { id: uuidv4(), texto: "" }],
            }
          : pregunta
      )
    );
  };

  return (
    <LayoutBody>
      <h2 className="titulo">Crear Cuestionario</h2>
      <form className="formulario">
        {preguntas.map((pregunta, index) => (
          <div key={pregunta.uid} className="card">
            <p className="pregunta">Pregunta {index + 1}</p>
            <input
              type="text"
              value={pregunta.pregunta}
              onChange={(e) =>
                actualizarTextoPregunta(pregunta.uid, e.target.value)
              }
              placeholder="Escribe la pregunta"
              className="input"
            />
            <p>Opciones:</p>
            {pregunta.opciones.map((opcion) => (
              <input
                key={opcion.id}
                type="text"
                value={opcion.texto}
                onChange={(e) =>
                  actualizarOpcion(pregunta.uid, opcion.id, e.target.value)
                }
                placeholder="Escribe una opción"
                className="input"
              />
            ))}
            <button
              type="button"
              className="boton"
              onClick={() => agregarOpcion(pregunta.uid)}
            >
              + Añadir opción
            </button>
          </div>
        ))}

        <div className="center">
          <button type="button" className="boton" onClick={agregarPregunta}>
            + Añadir pregunta
          </button>
        </div>
      </form>
    </LayoutBody>
  );
}

const LayoutBody = styled.div`
  max-width: 110rem;
  margin: 40px auto;
  padding: 20px;
  font-family: var(--font-lexend);

  .titulo {
    text-align: center;
    font-size: 2.5rem;
    margin-bottom: 2rem;
  }

  .formulario {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .card {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 12px;
    padding: 1.5rem;
  }

  .pregunta {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }

  .input {
    display: block;
    width: 100%;
    margin-bottom: 1rem;
    padding: 0.5rem;
    border-radius: 6px;
    border: 1px solid #ccc;
  }

  .boton {
    background-color: #0070f3;
    color: white;
    border: none;
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 1rem;
  }

  .center {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }
`;
