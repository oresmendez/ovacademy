"use client";
import { styled, apiRest, toast, ButtonSave, InputField, TextAreaField, PropTypes } from '@/app/components/utils/rutas';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
	modulo: Yup.string().required("El módulo es obligatorio"),
	nombre: Yup.string().required("El nombre es obligatorio"),
	nota_unidad: Yup.number()
		.positive("El valor evaluativo debe ser mayor que 0")
		.required("El valor evaluativo es obligatorio"),
	descripcion: Yup.string().required("La descripción es obligatoria")
});

export default function CrearUnidades({ TabClick }) {

  
	const initialValues = {
		modulo: "",
		nombre: "",
		nota_unidad: "",
		descripcion: ""
	};

  
	const crear_unidad = async (values) => {
		try {
		const url = `${process.env.NEXT_PUBLIC_API_URL}/unidades`
		const response = await apiRest.fetchPost(url, values);

		if (response.status === 200) {
			toast.success(response.data.message);
			TabClick(1);
		} else {
			toast.error(response.data.message);
		}
		} catch (error) {
		console.error(error);
		}
	};

	return (
		<Component>
		<div className="form-wrapper">
			<Formik
			initialValues={initialValues}
			validationSchema={validationSchema}
			onSubmit={(values) => crear_unidad(values)}
			>
			{({ values, handleChange, handleBlur, isSubmitting }) => (
				<Form className="space-y-4">
				<Field
					label="Módulo de la unidad"
					name="modulo"
					component={InputField}
					value={values.modulo}
					onChange={handleChange}
					onBlur={handleBlur}
					placeholder="Módulo de la unidad"
				/>

				<Field
					label="Nombre de la unidad"
					name="nombre"
					component={InputField}
					value={values.nombre}
					onChange={handleChange}
					onBlur={handleBlur}
					placeholder="Nombre de la unidad"
				/>

				<Field
					label="Valor Evaluativo"
					name="nota_unidad"
					component={InputField}
					type="number"
					value={values.nota_unidad}
					onChange={handleChange}
					onBlur={handleBlur}
					placeholder="Valor evaluativo"
				/>

				<Field
					label="Descripción"
					name="descripcion"
					component={TextAreaField}
					value={values.descripcion}
					onChange={handleChange}
					onBlur={handleBlur}
					placeholder="Descripción"
				/>

				<ButtonSave type="submit" className="mt-20" classFather="center" disabled={isSubmitting}>
					Guardar
				</ButtonSave>
				</Form>
			)}
			</Formik>
		</div>
		</Component>
	);
}

const Component = styled.div``;

CrearUnidades.propTypes = {
  	TabClick: PropTypes.func.isRequired,
};
