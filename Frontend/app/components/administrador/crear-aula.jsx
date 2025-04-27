"use client";
import { styled, apiRest, toast, InputField, PropTypes, ButtonSave } from '@/app/components/utils/rutas';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

export default function CrearAula_({ setActiveTab }) {

	const registrar = async (values) => {
		try {

		const url = `http://localhost:3333/ovacademy/aula`
		const response = await apiRest.fetchPost(url, {
			nombre: values.nombre,
			ubicacion: values.ubicacion
		});

		if (response.status === 201) {
			toast.success(response.data.message);
			setActiveTab(1);
		} else {
			toast.error(response.data.message);
		}
		} catch (error) {
			toast.error("Error al crear el aula");
		}
	};

	const validationSchema = Yup.object({
		nombre: Yup.string().required("El nombre es obligatorio"),
		ubicacion: Yup.string().required("La ubicación es obligatoria")
	});

	return (
		<Component>
		<div className="form-wrapper">
			<Formik
			initialValues={{ nombre: "", ubicacion: "" }}
			validationSchema={validationSchema}
			onSubmit={registrar}
			>
			{({ isSubmitting }) => (
				<Form className="formulario">
				<Field
					label="Nombre"
					name="nombre"
					component={InputField}
					placeholder="Nombre"
				/>

				<Field
					label="Ubicación"
					name="ubicacion"
					component={InputField}
					placeholder="Ubicación"
				/>

		
					<ButtonSave type="submit" className="mt-10" classFather="center" disabled={isSubmitting}>
					Guardar
					</ButtonSave>
	
				</Form>
			)}
			</Formik>
		</div>
		</Component>
	);
}

CrearAula_.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
};

const Component = styled.div`

`;
