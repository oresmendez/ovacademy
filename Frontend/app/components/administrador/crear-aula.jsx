"use client";
import { styled, apiRest, useRouter, toast, InputField, PropTypes, ButtonSave, ModalField } from '@/app/components/utils/rutas';
import { Formik, Field, Form, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';

export default function CrearAula_({ setActiveTab }) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [formValues, setFormValues] = useState(null);

  const registrar = async (values) => {
    setVisible(false);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/aula`;
      const response = await apiRest.fetchPost(url, {
        nombre: values.nombre,
        ubicacion: values.ubicacion,
      });

      if (response.status === 201) {
        toast.success(response.data.message);
        setActiveTab(1);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error al crear el aula");
      console.error(error);
    }
  };

  const validationSchema = Yup.object({
    nombre: Yup.string().required("El nombre es obligatorio"),
    ubicacion: Yup.string().required("La ubicación es obligatoria"),
  });

  return (
    <Component>
      <div className="form-wrapper">
        <Formik
          initialValues={{ nombre: "", ubicacion: "" }}
          validationSchema={validationSchema}
        >
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

            <div className="center">
              <SubmitButton
                className="mt-10 mr-10"
                setVisible={setVisible}
                setFormValues={setFormValues}
              >
                Guardar
              </SubmitButton>
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
        </Formik>
      </div>

      <ModalField
        visible={visible}
        cerrarModal={() => setVisible(false)}
        onclick={() => registrar(formValues)}
        width={"700"}
        height={"100"}
        title={"¿Estás seguro?"}
        mensaje={
          <>
            ¿Deseas agregar este Sección? <br />
            <br />
          </>
        }
      />
    </Component>
  );
}

const SubmitButton = ({ children, setVisible, setFormValues, ...props }) => {
  const { values, validateForm, setTouched } = useFormikContext();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    await setTouched({ nombre: true, ubicacion: true });
    const errors = await validateForm();

    if (Object.keys(errors).length === 0) {
      setFormValues(values);
      setVisible(true);
    }

    setLoading(false);
  };

  return (
    <ButtonSave onClick={handleClick} disabled={loading} loading={loading} {...props}>
      {children}
    </ButtonSave>
  );
};


CrearAula_.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
};

const Component = styled.div``;
