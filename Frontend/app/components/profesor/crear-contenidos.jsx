"use client";
import {
  useState,
  useEffect,
  styled,
  apiRest,
  toast,
  InputField,
  TextAreaField,
  PropTypes,
  ButtonSave,
  SelectField,
  EditarContenido
} from "@/app/components/utils/rutas";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

export default function CrearContenido({ TabClick }) {
  const [unidades, setUnidades] = useState([]);

  useEffect(() => {
    obtenerUnidades();
  }, []);

  const obtenerUnidades = async () => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/unidades/profesor`;
      const response = await apiRest.fetchGet(url);
      if (response.status === 200) {
        const unidadesFormateadas = response.data.data.map((unidad) => ({
          value: unidad.id,
          label: `${unidad.modulo} - ${unidad.nombre}`,
        }));
        setUnidades(unidadesFormateadas);
      } else {
        console.error("Respuesta inválida de la API.");
        setUnidades([]);
      }
    } catch (err) {
      console.error("Error al obtener unidades:", err);
      setUnidades([]);
    }
  };

  const validationSchema = Yup.object({
    unidad: Yup.object({
      value: Yup.string().required(),
      label: Yup.string().required(),
    })
      .nullable()
      .required("Selecciona una unidad"),
    nombre: Yup.string().required("El nombre es obligatorio"),
    descripcion: Yup.string().required("La descripción es obligatoria"),
  });

  const crearContenido = async (values) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/contenido`;
      const { unidad, nombre, descripcion } = values;
      const response = await apiRest.fetchPost(url, {
        id_unidad: unidad.value,
        nombre,
        descripcion,
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        TabClick(1);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error al crear contenido:", error);
      toast.error("Error al crear contenido.");
    }
  };

  return (
    <Component>
      <div className="form-wrapper">
        <Formik
          initialValues={{
            unidad: null,
            nombre: "",
            descripcion: "",
          }}
          validationSchema={validationSchema}
          onSubmit={crearContenido}
        >
          {({ values, handleChange, handleBlur, setFieldValue, errors, touched }) => (
            <Form className="space-y-4">
              <Field name="unidad">
                {({ field, form }) => (
                  <SelectField
                    field={field}
                    form={form}
                    label="Selecciona una Unidad"
                    options={unidades}
                    value={values.unidad}
                    onChange={(selected) => setFieldValue("unidad", selected)}
                  />
                )}
              </Field>

              <Field
                label="Nombre del contenido"
                name="nombre"
                component={InputField}
                placeholder="Nombre del contenido"
              />

              {/* Descripción usando componente personalizado */}
              <EditarContenido
                descripcion={values.descripcion}
                setDescripcion={(val) => setFieldValue("descripcion", val)}
              />

              {touched.descripcion && errors.descripcion && (
                <div className="form-error">{errors.descripcion}</div>
              )}

              <div className="center">
                <ButtonSave type="submit" className="mt-10">
                  Guardar
                </ButtonSave>
                <ButtonSave
                  bgColor="#d5dbdb"
                  hoverColor="#bfc9ca"
                  className="mt-10 ml-10"
                  onClick={() => window.history.go(-1)}
                >
                  Regresar
                </ButtonSave>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Component>
  );
}

const Component = styled.div``;

CrearContenido.propTypes = {
  TabClick: PropTypes.func.isRequired,
};
