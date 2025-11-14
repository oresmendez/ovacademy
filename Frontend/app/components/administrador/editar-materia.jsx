"use client"; 
import { styled, apiRest, useState, useEffect, useRouter, toast, PropTypes, ButtonSave, Spinner, ModalField } from '@/app/components/utils/rutas';
import * as Yup from "yup";
import { Formik, Field, Form, useFormikContext } from "formik";

export default function EditarMateria_() {

	const router = useRouter();

	const [formValues, setFormValues] = useState(null);

	const [showSpinner, setShowSpinner] = useState(false);
	const [isLoadingRespuestas, setIsLoadingRespuestas] = useState(true);

	const [visible, setVisible] = useState(false);

	const [nombre, setNombre] = useState("");
	const [objetivo, setObjetivo] = useState("");
	const [descripcion, setDescripcion] = useState("");

	useEffect(() => {
		obtener_materia();
	}, []);

	const validationSchema = Yup.object({
		nombre: Yup.string().required("El nombre de la materia es obligatorio"),
		objetivo: Yup.string().required("El slogan de la materia es obligatorio"),
		descripcion: Yup.string().required("La descripcion de la materia es obligatorio")

	});


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

	const editar_Materia = async ({ nombre, objetivo, descripcion }) => {
		setVisible(false);
		let timeout;
		try {
			timeout = setTimeout(() => setShowSpinner(true), 300);
			const url = `${process.env.NEXT_PUBLIC_API_URL}/materia`;
			const response = await apiRest.fetchPut(url, {
				nombre,
				objetivo,
				descripcion,
			});

			if (response.status === 200) {
				toast.success(response.data.message);
				obtener_materia();
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			console.error(error);
		} finally {
			clearTimeout(timeout);
			setShowSpinner(false);
		}
	};


	let contenido;

    if (showSpinner || isLoadingRespuestas) {
        contenido = <Spinner show={showSpinner} />;
    } else {
        contenido = (
            <Component>
				<div className="form-wrapper">
					<Formik
					enableReinitialize
					initialValues={{ nombre, objetivo, descripcion }}
					validationSchema={validationSchema}
					onSubmit={(values) => {
						setVisible(true);
						setFormValues(values); // Guarda los valores para el modal
					}}
					>
					{({ errors, touched, handleChange, handleBlur, values }) => (
						<Form>
						<div className="form-group">
							<label className="form-label">
								Nombre de la materia
							</label>
							<input
								type="text"
								name="nombre"
								className="form-input"
								value={values.nombre}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
							{touched.nombre && errors.nombre && (
							<div className="form-error">{errors.nombre}</div>
							)}
						</div>

						<div className="form-group">
							<label className="form-label">
								Slogan / Objetivo
							</label>
							<input
								type="text"
								name="objetivo"
								className="form-input"
								value={values.objetivo}
								onChange={handleChange}
								onBlur={handleBlur}
							/>
							{touched.objetivo && errors.objetivo && (
								<div className="form-error">{errors.objetivo}</div>
							)}
						</div>

						<div className="form-group">
							<label className="form-label">
								Descripción
							</label>
							<textarea
							name="descripcion"
							className="form-textarea"
							value={values.descripcion}
							onChange={handleChange}
							onBlur={handleBlur}
							/>
							{touched.descripcion && errors.descripcion && (
							<div className="form-error">{errors.descripcion}</div>
							)}
						</div>

						<div className="center">
							<ButtonSave type="submit" className="mt-10 mr-10">
							Guardar
							</ButtonSave>
							<ButtonSave
							bgColor="#d5dbdb"
							hoverColor="#bfc9ca"
							className="mt-10"
							onClick={() => router.push("/ovacademy/administrador/dashboard")}
							>
							Regresar
							</ButtonSave>
						</div>
						</Form>
					)}
					</Formik>					
				</div>
					<ModalField 
						visible={visible} 
						cerrarModal={() => setVisible(false)} 
						onclick={() => editar_Materia(formValues)}
						width={"700"}
						height={"100"}
						title={"¿Estas seguro?"}
						mensaje={
							<>
							¿Deseas editar el detalle de la materia? <br /><br />
							</>
					}
					/>
			</Component>
        );
    }


	return contenido;
}

const InputField = ({ label, name, type = "text", value, onChange, onBlur, placeholder, required = false, form: { errors, touched } }) => {
    const hasError = touched[name] && errors[name];

    return (
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
			{hasError && <div className="form-error">{errors[name]}</div>}
		</div>
    );
};


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
		margin: 10px 0;
		background: #fff;
		border-radius: 12px;
	}

	.form-group {
		margin-bottom: 1rem;
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
		resize: none; 
		overflow-y: auto;
		height: 150px;
	}

	.form-input:focus,
	.form-textarea:focus {
		border-color: #0465ac;
		box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
		outline: none;
	}

	.form-label.error {
		color: red;
		text-decoration: underline;
		font-weight: bold;
	}

	.form-error {
		color: red;
		font-size: 0.9rem;
		margin-top: 5px;
	}


	@media (max-width: 500px) {
		.form-wrapper {
			padding: 20px;
		}
	}
`;

