"use client";
import { styled, apiRest, toast, useRouter, InputField, ButtonSave, PropTypes, ModalField } from "@/app/components/utils/rutas";
import { Formik, Field, Form, useFormikContext } from "formik";
import * as Yup from "yup";
import { useState } from "react";

export default function CrearProfesor_({ TabClick }) {
    const router = useRouter();
    const [visible, setVisible] = useState(false);
    const [formValues, setFormValues] = useState(null);

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
            const url = `${process.env.NEXT_PUBLIC_API_URL}/user`;
            const { email, password, name, surname } = values;
            const response = await apiRest.fetchPost(url, {
                email,
                password,
                name,
                surname,
                type_id: 2,
            });
            if (response.status === 200) {
                toast.success(response.data.message);
                await new Promise(resolve => setTimeout(resolve, 800));
                TabClick(1);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error al crear profesor.");
        }
    };

    const SubmitButton = ({ children, setVisible, setFormValues, ...props }) => {
        const { submitForm, values } = useFormikContext();
        const [loading, setLoading] = useState(false);

        const handleClick = async () => {
            setLoading(true);

            await submitForm(); // ejecuta validación
            setFormValues(values); // guarda valores si son válidos
            setVisible(true); // muestra el modal

            setLoading(false);
        };

        return (
            <ButtonSave onClick={handleClick} disabled={loading} loading={loading} {...props}>
                {children}
            </ButtonSave>
        );
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
                    onSubmit={(values) => {
                        setFormValues(values);
                        setVisible(true);
                    }}
                >

                    {({ values, handleChange, handleBlur }) => (
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

                            <div className="center">
                                <SubmitButton className="mt-10 mr-10" setVisible={setVisible} setFormValues={setFormValues}>
                                    Guardar
                                </SubmitButton>

                                <ButtonSave
                                    bgColor="#d5dbdb"
                                    hoverColor="#bfc9ca"
                                    className="mt-10"
                                    onClick={() => router.push('/ovacademy/administrador/dashboard')}
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
                onclick={() => registrar(formValues)} // <-- aquí está el fix
                width={"700"}
                height={"100"}
                title={"¿Estas seguro?"}
                mensaje={
                    <>
                        ¿Que deseas registrar a este profesor? <br /><br />
                    </>
                }
            />

        </Component>
    );
}

const SubmitButton = ({ children, ...props }) => {
    const { submitForm } = useFormikContext();
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);

        // Esperar envío y mínimo 1 segundo
        await Promise.all([
            submitForm(),
            new Promise(resolve => setTimeout(resolve, 1000))
        ]);

        setLoading(false);
    };

    return (
        <ButtonSave onClick={handleClick} disabled={loading} loading={loading} {...props}>
            {children}
        </ButtonSave>
    );
};

const Component = styled.div``;

CrearProfesor_.propTypes = {
    setActiveTab: PropTypes.func.isRequired,
};
