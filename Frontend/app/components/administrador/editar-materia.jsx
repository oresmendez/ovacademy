"use client"; 
import { styled, apiRest, useState, useEffect, useRouter, toast, PropTypes, ButtonSave, Spinner, ModalField } from '@/app/components/utils/rutas';

export default function EditarMateria_() {

	const router = useRouter();

	const [showSpinner, setShowSpinner] = useState(false);
	const [isLoadingRespuestas, setIsLoadingRespuestas] = useState(true);

	const [visible, setVisible] = useState(false);

	const [nombre, setNombre] = useState("");
	const [objetivo, setObjetivo] = useState("");
	const [descripcion, setDescripcion] = useState("");

	useEffect(() => {
		obtener_materia();
	}, []);


	const obtener_materia = async () => {
		let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
			const url = `${process.env.NEXT_PUBLIC_API_URL}/materia`
			const response = await apiRest.fetchGet(url);
			setNombre(response.data.nombre);
			setObjetivo(response.data.objetivo);
			setDescripcion(response.data.descripcion);
			await new Promise(resolve => setTimeout(resolve, 800));
		} catch (error) {
			console.error(error);
		}finally { clearTimeout(timeout); setShowSpinner(false);setIsLoadingRespuestas(false);}
	};

	const editar_Materia = async () => {
		setVisible(false)
		let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
			const url = `${process.env.NEXT_PUBLIC_API_URL}/materia`
			const response = await apiRest.fetchPut(
				url,
				{ nombre, objetivo, descripcion }
			);

			if (response.status === 200) {
				toast.success(response.data.message);
				obtener_materia();
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			console.error(error);
		}finally { clearTimeout(timeout); setShowSpinner(false);}
	};

	let contenido;

    if (showSpinner || isLoadingRespuestas) {
        contenido = <Spinner show={showSpinner} />;
    } else {
        contenido = (
            <Component>
				<div className="form-wrapper">
					<form>
						<InputField label="Nombre de la materia" value={nombre} onChange={setNombre} placeholder="Nombre de la materia" required />
						<InputField label="Slogan / Objetivo" value={objetivo} onChange={setObjetivo} placeholder="Slogan / Objetivo" required />
						<TextAreaField label="Descripción" value={descripcion} onChange={setDescripcion} placeholder="Descripción" required />
						
						<div className='center'>
							<ButtonSave className="mt-10 mr-10" animation={false} onClick={() => setVisible(true)}>Guardar</ButtonSave>
							<ButtonSave bgColor="#d5dbdb" hoverColor="#bfc9ca" className="mt-10" onClick={() => router.push('/ovacademy/administrador/dashboard')}>Regresar</ButtonSave>
						</div>
					</form>
				</div>
				<ModalField 
					visible={visible} 
					cerrarModal={() => setVisible(false)} 
					onclick={() => editar_Materia()}
					width={"700"}
					height={"100"}
					title={"¿Estas seguro?"}
					mensaje={
						<>
							¿Que deseas editar el detalle de la materia? <br /><br />
						</>
					}
				/>
			</Component>
        );
    }


	return contenido;
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

