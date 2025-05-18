"use client";
import { styled, apiRest, toast, ButtonSave, InputField, PropTypes } from '@/app/components/utils/rutas';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

export default function CrearEstudiante ({ TabClick }) {

	const validationSchema = Yup.object({
		name: Yup.string().required("El nombre es obligatorio"),
		surname: Yup.string().required("El apellido es obligatorio"),
		email: Yup.string().email("El correo electrónico no es válido").required("El correo electrónico es obligatorio"),
		password: Yup.string().min(6, "La contraseña debe tener al menos 6 caracteres").required("La contraseña es obligatoria"),
		verifyPassword: Yup.string()
		.oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden')
		.required('Debe repetir la contraseña')
	});

	const registrar = async (values) => {
		try {
			const { email, password, name, surname } = values;

			
			const url = `${process.env.NEXT_PUBLIC_API_URL}/user`
			const response = await apiRest.fetchPost( url,
				{
					email,
					password,
					name,
					surname,
					type_id: 1,
				}
			);

			if (response.status === 200) {
				toast.success(response.data.message);
				TabClick(1);
			} else {
				toast.error(response.data.message);
			}
		} catch (error) {
			toast.error("Error al crear estudiante");
		}
	};

	return (
		<Component>
		<div className="form-wrapper">
			<Formik
				initialValues={{
					name: "",
					surname: "",
					email: "",
					password: "",
					verifyPassword: "",
				}}
				validationSchema={validationSchema}
				onSubmit={registrar}
			>
			{({ values, handleChange, handleBlur, isSubmitting }) => (
				<Form className="space-y-4">
				<Field
					label="Nombre"
					name="name"
					component={InputField}
					value={values.name}
					onChange={handleChange}
					onBlur={handleBlur}
					placeholder="Nombre"
				/>
				<Field
					label="Apellido"
					name="surname"
					component={InputField}
					value={values.surname}
					onChange={handleChange}
					onBlur={handleBlur}
					placeholder="Apellido"
				/>
				<Field
					label="Correo Electrónico"
					name="email"
					component={InputField}
					type="email"
					value={values.email}
					onChange={handleChange}
					onBlur={handleBlur}
					placeholder="Correo electrónico"
				/>
				<Field
					label="Contraseña Temporal"
					name="password"
					component={InputField}
					type="password"
					value={values.password}
					onChange={handleChange}
					onBlur={handleBlur}
					placeholder="Contraseña"
				/>
				<Field
					label="Repetir Contraseña"
					name="verifyPassword"
					component={InputField}
					type="password"
					value={values.verifyPassword}
					onChange={handleChange}
					onBlur={handleBlur}
					placeholder="Repetir contraseña"
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

CrearEstudiante.propTypes = {
  TabClick: PropTypes.func.isRequired,
};
