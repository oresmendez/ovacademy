"use client";
import {
  styled,
  apiRest,
  useState,
  useRouter,
  toast,
  PropTypes,
  ButtonSave,
  ModalField
} from "@/app/components/utils/rutas";
import { Formik, Form, Field, useFormikContext } from "formik";
import * as Yup from "yup";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import TextField from "@mui/material/TextField";

export default function CrearSemestre_({ setActiveTab }) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [formValues, setFormValues] = useState(null);

  const validationSchema = Yup.object({
    nombre: Yup.string().required("El nombre es obligatorio"),
    fechaInicio: Yup.date()
      .nullable()
      .required("La fecha de inicio es obligatoria"),
  });

  const registrar = async (values) => {
    setVisible(false);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/semestre`;
      const response = await apiRest.fetchPost(url, {
        nombre: values.nombre,
        fecha_inicio: values.fechaInicio.toISOString().split("T")[0],
      });

      if (response.status === 200) {
        toast.success(response.data.message);
        setActiveTab(1);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error capturado en catch:", error);
      toast.error("Error al crear el semestre");
    }
  };

  const SubmitButton = ({ children, setVisible, setFormValues, ...props }) => {
    const { values, validateForm, setTouched } = useFormikContext();
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
      setLoading(true);
      await setTouched({ nombre: true, fechaInicio: true });
      const errors = await validateForm();

      if (Object.keys(errors).length === 0) {
        setFormValues(values);
        setVisible(true);
      }

      setLoading(false);
    };

    return (
      <ButtonSave
        onClick={handleClick}
        disabled={loading}
        loading={loading}
        {...props}
      >
        {children}
      </ButtonSave>
    );
  };

  return (
    <Component>
      <div className="form-wrapper">
        <Formik
          initialValues={{ nombre: "", fechaInicio: null }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            setFormValues(values);
            setVisible(true);
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form className="space-y-4">
              <div className="form-group">
                <label className="form-label">Nombre del Semestre</label>
                <Field
                  name="nombre"
                  as="input"
                  className="form-input"
                  placeholder="Nombre"
                />
                {touched.nombre && errors.nombre && (
                  <div className="form-error">{errors.nombre}</div>
                )}
              </div>

              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <div className="form-group">
                  <label className="form-label">Fecha de Inicio</label>
                  <DatePicker
                    value={values.fechaInicio}
                    onChange={(date) => setFieldValue("fechaInicio", date)}
                    slots={{
                      textField: (params) => (
                        <TextField fullWidth {...params} />
                      ),
                    }}
                  />
                  {touched.fechaInicio && errors.fechaInicio && (
                    <div className="form-error">{errors.fechaInicio}</div>
                  )}
                </div>
              </LocalizationProvider>

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
                  onClick={() =>
                    router.push("/ovacademy/administrador/dashboard")
                  }
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
            ¿Deseas registrar un nuevo semestre? <br />
            <br />
          </>
        }
      />
    </Component>
  );
}

const Component = styled.div`
  .form-wrapper {
    background: #fff;
    border-radius: 12px;
    width: 100%;
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

  .form-input {
    width: 100%;
    padding: 10px 14px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s, box-shadow 0.3s;
  }

  .form-input:focus {
    border-color: #0465ac;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2);
    outline: none;
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

CrearSemestre_.propTypes = {
  setActiveTab: PropTypes.func.isRequired,
};
