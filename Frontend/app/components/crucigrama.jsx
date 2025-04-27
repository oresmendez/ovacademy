import React, { useState } from "react";

const Crossword = () => {
  const [answers, setAnswers] = useState({
    1: "",
    2: "",
    3: "",
  });

  const correctAnswers = {
    1: "PROYECTO",
    2: "INVERSION",
    3: "VIABILIDAD",
  };

  const handleChange = (e, number) => {
    setAnswers({ ...answers, [number]: e.target.value.toUpperCase() });
  };

  const checkAnswers = () => {
    let correct = true;
    Object.keys(correctAnswers).forEach((key) => {
      if (answers[key] !== correctAnswers[key]) {
        correct = false;
      }
    });
    alert(correct ? "¡Correcto! 🎉" : "Algunas respuestas son incorrectas ❌");
  };

  return (
    <div>
      <h2>Crucigrama: Formulación y Evaluación de Proyectos</h2>
      <table border="1">
        <tbody>
          <tr>
            <td>1</td>
            <td>
              <input
                type="text"
                maxLength="9"
                onChange={(e) => handleChange(e, 1)}
              />
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>
              <input
                type="text"
                maxLength="9"
                onChange={(e) => handleChange(e, 2)}
              />
            </td>
          </tr>
          <tr>
            <td>3</td>
            <td>
              <input
                type="text"
                maxLength="10"
                onChange={(e) => handleChange(e, 3)}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <button onClick={checkAnswers}>Verificar respuestas</button>

      <h3>Pistas:</h3>
      <ul>
        <li>1. Es la búsqueda de una solución a un problema. (9 letras)</li>
        <li>2. Es el acto de asignar recursos para obtener beneficios. (9 letras)</li>
        <li>3. Se analiza para saber si un proyecto es factible. (10 letras)</li>
      </ul>
    </div>
  );
};

export default Crossword;
