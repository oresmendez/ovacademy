"use client"; import { styled, apiRest, useState, toast, PropTypes, ButtonSave, ModalField } from '@/app/components/utils/rutas';

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import TextField from "@mui/material/TextField";

export default function CrearSemestre_({ setActiveTab }) {

	const [visible, setVisible] = useState(false);

	const [nombre, setNombre] = useState("");
	const [fechaInicio, setFechaInicio] = useState(null);

	const registrar = async () => {
		setVisible(false)
		try {

			const url = `${process.env.NEXT_PUBLIC_API_URL}/semestre`
			const response = await apiRest.fetchPost(
				url,
				{
				nombre,
				fecha_inicio: fechaInicio ? fechaInicio.toISOString().split("T")[0] : "",
				}
			);

			if (response.status === 200) {
				toast.success(response.data.message);
				setActiveTab(1);
			} else if (response.status === 403) {
				toast.error(response.data.message);
			} else {
				toast.error(response.data.message);
			}

		} catch (error) {
			console.error("Error capturado en catch:", error);
      toast.error("Error al crear el semestre");
		}
	};

	return (

		<Component className=''>
		<div className="form-wrapper">
			<form
			id="formSemestre"
			onSubmit={(e) => {
				e.preventDefault();
			}}
				className="space-y-4"
				>
				<InputField label="Nombre del Semestre" value={nombre} onChange={setNombre} placeholder="Nombre" required />
				<LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
					<div className="form-group">
					<label className="form-label">Fecha de Inicio</label>
					<DatePicker
						value={fechaInicio}
						onChange={(newValue) => setFechaInicio(newValue)}
						slots={{ textField: (params) => <TextField {...params} fullWidth /> }}
					/>
					</div>
				</LocalizationProvider>
				<div className='center'>
					<ButtonSave className="mt-10 mr-10" animation={false} onClick={() => setVisible(true)}>Guardar</ButtonSave>
					<ButtonSave bgColor="#d5dbdb" hoverColor="#bfc9ca" className="mt-10" onClick={() => router.push('/ovacademy/administrador/dashboard')}>Regresar</ButtonSave>
				</div>
			</form>
		</div>
		<ModalField 
			visible={visible} 
			cerrarModal={() => setVisible(false)} 
			onclick={() => registrar()}
			width={"700"}
			height={"100"}
			title={"¿Estas seguro?"}
			mensaje={
				<>
					¿Que deseas registrar un nuevo semestre? <br /><br />
				</>
			}
		/>
		</Component>
	);
}

const InputField = ({ label, type = "text", value, onChange, placeholder, required = false }) => (
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

InputField.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string,             
    value: PropTypes.oneOfType([        
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    required: PropTypes.bool
};

CrearSemestre_.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
};


const Component = styled.div`
  .form-wrapper {
    
    background: #fff;
    border-radius: 12px;
    width:100%;
  }

  .form-title {
    text-align: center;
    font-size: 1.8rem;
    margin-bottom: 20px;
    color: #333;
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

  .form-input {
    width: 100%;
    padding: 10px 14px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s, box-shadow 0.3s;
  }

  .form-input:focus {
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
