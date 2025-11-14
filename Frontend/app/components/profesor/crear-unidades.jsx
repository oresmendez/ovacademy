"use client";
import { styled, apiRest, useState, toast, ButtonSave, ModalField, InputField, TextAreaField, PropTypes } from '@/app/components/utils/rutas';
import { Formik, Field, Form, useFormikContext } from 'formik';
import * as Yup from 'yup';


const validationSchema = Yup.object({
  modulo: Yup.string().required("El módulo es obligatorio"),
  nombre: Yup.string().required("El nombre es obligatorio"),
  nota_unidad: Yup.number()
    .positive("El valor evaluativo debe ser mayor que 0")
    .required("El valor evaluativo es obligatorio"),
  descripcion: Yup.string().required("La descripción es obligatoria"),
});

export default function CrearUnidades({ TabClick }) {
  
  const [visible, setVisible] = useState(false);
  const [formValues, setFormValues] = useState(null);

  const registrar = async (values) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/unidades`;
      const response = await apiRest.fetchPost(url, values);

      setVisible(false);

      if (response.status === 200) {
        toast.success(response.data.message);
        await new Promise((resolve) => setTimeout(resolve, 800));
        TabClick(1);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error al crear unidad.");
    }
  };

const SubmitButton = ({ children, setVisible, setFormValues, ...props }) => {
  const { values, validateForm, setTouched } = useFormikContext();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);

    // Marca todos los campos como tocados
    await setTouched({
      modulo: true,
      nombre: true,
      nota_unidad: true,
      descripcion: true
    });

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


  return (
    <Component>
      <div className="form-wrapper">
        <Formik
          initialValues={{
            modulo: "",
            nombre: "",
            nota_unidad: "",
            descripcion: "",
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

              <div className="center">
                <SubmitButton className="mt-10 mr-10" setVisible={setVisible} setFormValues={setFormValues}>
                  Guardar
                </SubmitButton>

                <ButtonSave
                  bgColor="#d5dbdb"
                  hoverColor="#bfc9ca"
                  className="mt-10"
                  onClick={() => window.history.go(-1)}
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
        onclick={() => registrar(formValues)}
        width={"700"}
        height={"100"}
        title={"¿Estás seguro?"}
        mensaje={
          <>
            ¿Deseas registrar esta unidad? <br /><br />
          </>
        }
      />
    </Component>
  );
}

const Component = styled.div``;

CrearUnidades.propTypes = {
  TabClick: PropTypes.func.isRequired,
};
