"use client";

import { useState } from 'react'

const preguntasJson = [
  {
    id: 1,
    pregunta: "¿Qué día es hoy?",
    respuesta: "lunes"
  },
  {
    id: 2,
    pregunta: "¿Cuál es la capital de Francia?",
    respuesta: "parís"
  },
  {
    id: 3,
    pregunta: "¿Qué lenguaje se usa en el navegador para la interactividad?",
    respuesta: "javascript"
  }
]

export default function CompletarEspacios() {
  const [respuestas, setRespuestas] = useState({})
  const [guardado, setGuardado] = useState(false)

  const handleChange = (e, id) => {
    setRespuestas({ ...respuestas, [id]: e.target.value })
  }

  const guardarRespuestas = () => {
    setGuardado(true)
  }

  return (
    <div className="contenedor">
      <h2>Actividad: Responde las siguientes preguntas</h2>
      {preguntasJson.map(p => (
        <div key={p.id} className="pregunta">
          <p>{p.pregunta}</p>
          <textarea
            value={respuestas[p.id] || ''}
            onChange={(e) => handleChange(e, p.id)}
            className="area"
            rows="4"
          />
        </div>
      ))}
      <button onClick={guardarRespuestas} className="boton">Guardar respuestas</button>
      {guardado && <p className="mensaje">Respuestas guardadas correctamente ✅</p>}

      <style jsx>{`
        .contenedor {
          max-width: 600px;
          margin: auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }
        h2 {
          color: #333;
        }
        .pregunta {
          margin-bottom: 20px;
        }
        .area {
          width: 100%;
          padding: 10px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
          resize: none;
        }
        .boton {
          padding: 10px 20px;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .boton:hover {
          background-color: #005bb5;
        }
        .mensaje {
          margin-top: 15px;
          color: green;
          font-weight: bold;
        }
      `}</style>
    </div>
  )
}