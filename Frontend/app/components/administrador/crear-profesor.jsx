"use client";
import { styled, apiRest, toast, InputField, ButtonSave, PropTypes } from "@/app/components/utils/rutas";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

export default function CrearProfesor_({ setActiveTab }) {

    const validationSchema = Yup.object({
        name: Yup.string().required("El nombre es obligatorio"),
        surname: Yup.string().required("El apellido es obligatorio"),
        email: Yup.string()
        .email("El correo electrónico no es válido")
        .required("El correo electrónico es obligatorio"),
        password: Yup.string()
        .min(6, "La contraseña debe tener al menos 6 caracteres")
        .required("La contraseña es obligatoria"),
        verifyPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden")
        .required("Debe repetir la contraseña"),
    });

    const registrar = async (values) => {
        try {
            const { email, password, name, surname } = values;
            const url = `http://localhost:3333/ovacademy/user`
            const response = await apiRest.fetchPost(url, {
                email,
                password,
                name,
                surname,
                type_id: 2,
            });

            if (response.status === 200) {
                toast.success(response.data.message);
                setActiveTab(1);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            toast.error("Error al crear profesor.");
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
                    type="email"
                    component={InputField}
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Correo electrónico"
                />
                <Field
                    label="Contraseña Temporal"
                    name="password"
                    type="password"
                    component={InputField}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Contraseña"
                />
                <Field
                    label="Repetir Contraseña"
                    name="verifyPassword"
                    type="password"
                    component={InputField}
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

CrearProfesor_.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
};
