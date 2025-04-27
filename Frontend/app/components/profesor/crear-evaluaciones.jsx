"use client"; 
import { styled, apiRest, useState, useEffect, CrearSopaDeLetras, CrearCuestionario, CrearPreguntasAbiertas, PropTypes, Select } from '@/app/components/utils/rutas';


export default function CrearEvaluaciones_({ TabClick }) {

	const [unidades, setUnidades] = useState("");
	const [unidadSeleccionada, setUnidadSeleccionada] = useState(null);
	const [nota_evaluacion, setNota_evaluacion] = useState("");

	const [typeEvaluaciones, setTypeEvaluaciones] = useState("");
	const [typeEvaluacionesSeleccionada, setTypeEvaluacionesSeleccionada] = useState(null);

	const [nombre, setNombre] = useState("");
	const [descripcion, setDescripcion] = useState("");

	useEffect(() => {
        obtenerUnidades();
        obtenerTypeEvaluaciones();
    }, []);

	const obtenerUnidades = async () => {
        try {
            const response = await apiRest.fetchGet('http://localhost:3333/ovacademy/unidades/profesor');
            if (response.status === 200) {
                const unidadesFormateadas = response.data.data.map((unidades) => ({
					value: unidades.id,
					label: `${unidades.modulo} - ${unidades.nombre}`,
				}));

				if (unidadesFormateadas.length > 0) {
                    setUnidadSeleccionada(unidadesFormateadas[0]);
                }

				setUnidades(unidadesFormateadas);
            } else {
                console.error('La respuesta de la API no contiene datos válidos.');
                setData([]);
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
            setData([]);
        }
    };

	const obtenerTypeEvaluaciones = async () => {
        try {
            const response = await apiRest.fetchGet('http://localhost:3333/ovacademy/evaluaciones/TypeEvaluaciones');
            if (response.status === 200) {
                const TypeEvaluacionesFormateadas = response.data.data.map((typeEvaluaciones) => ({
					value: typeEvaluaciones.id,
					label: `${typeEvaluaciones.type}`,
				}));

				if (TypeEvaluacionesFormateadas.length > 0) {
                    setTypeEvaluacionesSeleccionada(TypeEvaluacionesFormateadas[0]);
                }

				setTypeEvaluaciones(TypeEvaluacionesFormateadas);
            } else {
                console.error('La respuesta de la API no contiene datos válidos.');
                setTypeEvaluaciones([]);
            }
        } catch (err) {
            console.error('Error al conectar con el servidor:', err);
            setTypeEvaluaciones([]);
        }
    };

	return (
		<Component>
		  <div className="form-wrapper">
			<label className="label">Selecciona una Unidad</label>
			<Select
			  options={unidades}
			  placeholder="Selecciona una Unidad..."
			  value={unidadSeleccionada}
			  onChange={setUnidadSeleccionada}
			  styles={customStyles}
			  isClearable
			/>
	  
			<div className="mt-20 mb-20">
			  <label className="label">Selecciona un tipo de Evaluación</label>
			  <Select
				options={typeEvaluaciones}
				placeholder="Selecciona un tipo de Evaluación..."
				value={typeEvaluacionesSeleccionada}
				onChange={setTypeEvaluacionesSeleccionada}
				styles={customStyles}
				isClearable
			  />
			</div>
	  
			<InputFieldNumber
			  label="Valor Evaluativo"
			  value={nota_evaluacion}
			  onChange={setNota_evaluacion}
			  placeholder="Valor evaluativo"
			  required
			/>
	  
			{typeEvaluacionesSeleccionada?.value === 1 && unidadSeleccionada?.value && (
			  <CrearSopaDeLetras
				id_unidad={unidadSeleccionada.value}
				type_id={typeEvaluacionesSeleccionada.value}
				nota_evaluacion={nota_evaluacion}
				TabClick={TabClick}
			  />
			)}
	  
			{typeEvaluacionesSeleccionada?.value === 2 && unidadSeleccionada?.value && (
			  <CrearCuestionario
				id_unidad={unidadSeleccionada.value}
				type_id={typeEvaluacionesSeleccionada.value}
				nota_evaluacion={nota_evaluacion}
				TabClick={TabClick}
			  />
			)}

			{typeEvaluacionesSeleccionada?.value === 3 && unidadSeleccionada?.value && (
			  <CrearPreguntasAbiertas
				id_unidad={unidadSeleccionada.value}
				type_id={typeEvaluacionesSeleccionada.value}
				nota_evaluacion={nota_evaluacion}
				TabClick={TabClick}
			  />
			)}
		  </div>
		</Component>
	  );
	  
}

const InputField = ({ label, type = "text", value, onChange, placeholder, required = false }) => (
	<div className="form-group mt-10">
		<label className="form-label">{label}</label>
		<input
			type={type}
			className="form-input"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder={placeholder}
			required={required}
		/>
	</div>
);

const InputFieldNumber = ({ label, type = "number", value, onChange, placeholder, required = false }) => (
	<div className="form-group">
		<label className="form-label">{label}</label>
		<input
			type={type}
			className="form-input"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder={placeholder}
			required={required}
		/>
	</div>
);

const TextAreaField = ({ label, value, onChange, placeholder, required = false }) => (
	<div className="form-group">
		<label className="form-label">{label}</label>
		<textarea
			className="form-textarea"
			value={value}
			onChange={(e) => onChange(e.target.value)}
			placeholder={placeholder}
			required={required}
			rows="4"
		/>
	</div>
);


InputField.propTypes = {
	label: PropTypes.string.isRequired,
	type: PropTypes.string,
	value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	required: PropTypes.bool
};

TextAreaField.propTypes = {
	label: PropTypes.string.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	placeholder: PropTypes.string,
	required: PropTypes.bool
};

const customStyles = {
	control: (styles) => ({
		...styles,
		backgroundColor: "white",
		borderColor: "#ccc",
		borderRadius: "4px",
		padding: "5px",
		fontSize: "16px",
	}),
	option: (styles, { isFocused, isSelected }) => ({
		...styles,
		backgroundColor: isSelected ? "#0465ac" : isFocused ? "#e0e0e0" : "white",
		color: isSelected ? "white" : "#333",
	}),
	multiValue: (styles) => ({
		...styles,
		backgroundColor: "#0465ac",
		color: "white",
	}),
	multiValueLabel: (styles) => ({
		...styles,
		color: "white",
	}),
	multiValueRemove: (styles) => ({
		...styles,
		color: "white",
		":hover": { backgroundColor: "red", color: "white" },
	}),
};

const Component = styled.div`
  .form-wrapper {
    margin: 50px 0;
    background: #fff;
    border-radius: 12px;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .form-label {
    display: block;
    margin-bottom: 6px;
    color: #555;
    font-weight: 600;
  }

  .form-input,
  .form-textarea {
    width: 100%;
    padding: 10px 14px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s, box-shadow 0.3s;
  }

  .form-textarea {
    resize: none; /* Evita que se pueda redimensionar */
    overflow-y: auto; /* Barra de desplazamiento si se pasa el contenido */
    height: 150px; /* Tamaño fijo */
  }

  .form-input:focus,
  .form-textarea:focus {
    border-color: #0465ac;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
    outline: none;
  }

  .btn-primary {
    width: 20%;
    padding: 12px;
    background: #0465ac;
    color: white;
    font-size: 1.1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s;
  }

  .btn-primary:hover {
    background: #0056b3;
  }

  @media (max-width: 500px) {
    .form-wrapper {
      padding: 20px;
    }
  }

`;

