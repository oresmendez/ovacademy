"use client";
import { useState, useEffect } from 'react';
import { styled, useRouter, apiRest, toast, gestorCookie, PropTypes, Spinner,ModalField } from '@/app/components/utils/rutas';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { type } from 'os';

export default function Profile({ email = '' }) {

	const [showSpinner, setShowSpinner] = useState(false);
	const [isLoadingRespuestas, setIsLoadingRespuestas] = useState(true);

	const router = useRouter();
	const cerrarModal = () => setVisible(false);
	const [visible, setVisible] = useState(false);

	const [userEmail, setUserEmail] = useState("");
	const [typeUser, setTypeUser] = useState(0);
	const [isEditing, setIsEditing] = useState(false);
	const [activeTab, setActiveTab] = useState("personal");

	const [initialValues, setInitialValues] = useState({ name: '', surname: '', phone: '' });

	useEffect(() => {
		fetchEmail(email, setUserEmail, setTypeUser, setShowSpinner, setIsLoadingRespuestas);
	}, [email]);

	useEffect(() => {
		if (userEmail) {
			get_user(userEmail, setInitialValues,setShowSpinner,setIsLoadingRespuestas);
		}
	}, [userEmail]);

	const abrirModal = () => {
        setVisible(true);
    };

	const handleDeleteClick = async (email) => {
		setVisible(false)
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/user/${userEmail}`;
            const response = await apiRest.fetchDelete(url);
    
            if (response.status === 200) {
                toast.success(
                    <span>
                      Profesor {email} eliminado
                    </span>
                  );

				  await new Promise(resolve => setTimeout(resolve, 1000));
				  setShowSpinner(true)
				  router.push('/ovacademy/administrador/profesores');
                  
            } else {
                toast.error('Ocurrió un error');
            }
        } catch (err) {
            console.log(err);
            toast.error('Error al conectar con el servidor.');
        }
    };

	let contenido;

    if (showSpinner || isLoadingRespuestas) {
        contenido = <Spinner show={showSpinner} />;
    } else {
        contenido = (
            <Component>
			<style jsx>{`
				.error {
					color: red;
					font-size: 0.875rem;
					margin-top: 5px;
				}
			`}</style>

			<div className="profile-header">
				<div className="profile-image">
					<img src="/profile-img.jpg" alt="Usuario" />
				</div>
				<div className="profile-info">
					<h1>{(initialValues.name || initialValues.surname) ? `${initialValues.name} ${initialValues.surname}` : 'Nombre y Apellido'}</h1>
					<p>{userEmail || 'Correo electrónico no disponible'}</p>
					{activeTab === "personal" && !isEditing && (
						<button className="edit-button mr-10 mt-10" onClick={() => setIsEditing(true)}>
							Editar
						</button>
					)}
					{isEditing && (
						<>
						<button type="button" className="cancel-button mr-10 mt-10" onClick={() => setIsEditing(false)}>
							Cancelar
						</button>
						{typeUser === 3 && email!='' && (
							<button className="delete-button" onClick={() => abrirModal()}>
								Eliminar Profesor
							</button>
						)}
						{typeUser === 2 && email!='' && (
							<button className="delete-button" onClick={() => abrirModal()}>
								Eliminar Estudiante
							</button>
						)}
						</>
					)}
				</div>
			</div>
			
			<div className='center'>
				<div className="profile-tabs">
					<button
						className={`tab-button ${activeTab === "personal" ? "active" : ""}`}
						onClick={() => setActiveTab("personal")}
					>
						Información Personal
					</button>
					{isEditing && (
						<button
							className={`tab-button ${activeTab === "changePassword" ? "active" : ""}`}
							onClick={() => setActiveTab("changePassword")}
						>
							Cambiar Contraseña
						</button>
					)}
				</div>
			</div>

			<div className="profile-content">
				{activeTab === "personal" && (
					<div className="tab-content personal-info">
						<div className="header-section">
						</div>
						<Formik
							enableReinitialize
							initialValues={initialValues}
							validationSchema={personalSchema}
							onSubmit={async (values, { setSubmitting }) => {
								try {
									const url = `${process.env.NEXT_PUBLIC_API_URL}/user`
									const response = await apiRest.fetchPut(url, {
										email: userEmail,
										...values
									});
									if (response.status === 200) {
										toast.success(response.data.message);
										get_user(userEmail, setInitialValues,setShowSpinner,setIsLoadingRespuestas);
										setIsEditing(false);
									} else {
										toast.error(response.data.message);
									}
								} catch (error) {
									toast.error("Error al guardar los datos personales");
								} finally {
									setSubmitting(false);
								}
							}}
						>
							{({ values, handleChange, handleBlur, errors, touched, isSubmitting }) => (
								<Form>
									<div className="info-row">
										<label htmlFor="name">Nombre:</label>
										<input
											type="text"
											name="name"
											id="name"
											disabled={!isEditing}
											value={values.name}
											onChange={handleChange}
											onBlur={handleBlur}
										/>
										{errors.name && touched.name && <div className="error">{errors.name}</div>}
									</div>
									<div className="info-row">
										<label htmlFor="surname">Apellido:</label>
										<input
											type="text"
											name="surname"
											id="surname"
											disabled={!isEditing}
											value={values.surname}
											onChange={handleChange}
											onBlur={handleBlur}
										/>
										{errors.surname && touched.surname && <div className="error">{errors.surname}</div>}
									</div>
									<div className="info-row">
										<label htmlFor="phone">Teléfono:</label>
										<input
											type="text"
											name="phone"
											id="phone"
											disabled={!isEditing}
											value={values.phone}
											onChange={handleChange}
											onBlur={handleBlur}
										/>
									</div>
									{isEditing && (
										<div className="button-row">
											<button type="submit" className="save-button" disabled={isSubmitting}>
												Guardar
											</button>
											<button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>
												Cancelar
											</button>
										</div>
									)}
								</Form>
							)}
						</Formik>
					</div>
				)}

				{activeTab === "changePassword" && isEditing && (
					<div className="tab-content change-password">
						<div className="header-section">
						</div>
						<Formik
							initialValues={{ password: "", verifyPassword: "" }}
							validationSchema={passwordSchema}
							onSubmit={async (values, { setSubmitting, resetForm }) => {
								try {
									const url = `${process.env.NEXT_PUBLIC_API_URL}/auth/changePassword`
									const response = await apiRest.fetchPut(
										url,
										{ email: userEmail, password: values.password }
									);
									if (response.status === 200) {
										toast.success(response.data.message);
										resetForm();
									} else {
										toast.error(response.data.message);
									}
								} catch (error) {
									toast.error("Ocurrió un error al cambiar la contraseña");
								} finally {
									setSubmitting(false);
								}
							}}
						>
							{({ isSubmitting, errors, touched, handleChange, handleBlur, values }) => (
								<Form>
									<div className="info-row">
										<label htmlFor="password">Nueva Contraseña:</label>
										<input
											type="password"
											name="password"
											id="password"
											value={values.password}
											onChange={handleChange}
											onBlur={handleBlur}
										/>
										{errors.password && touched.password && (
											<div className="error">{errors.password}</div>
										)}
									</div>
									<div className="info-row">
										<label htmlFor="verifyPassword">Verificar Contraseña:</label>
										<input
											type="password"
											name="verifyPassword"
											id="verifyPassword"
											value={values.verifyPassword}
											onChange={handleChange}
											onBlur={handleBlur}
										/>
										{errors.verifyPassword && touched.verifyPassword && (
											<div className="error">{errors.verifyPassword}</div>
										)}
									</div>
									<div className="button-row">
										<button type="submit" className="save-button" disabled={isSubmitting}>
											Guardar
										</button>
										<button
											type="button"
											className="cancel-button"
											onClick={() => resetForm()}
										>
											Cancelar
										</button>
									</div>
								</Form>
							)}
						</Formik>
					</div>
				)}
			</div>
			<ModalField 
                visible={visible} 
                cerrarModal={cerrarModal} 
                onclick={() => handleDeleteClick(email)}
                width={"700"}
                height={"300"}
                title={"¿Estas seguro?"}
                mensaje={
                    <>
                        ¿Estás seguro que deseas eliminar al profesor {email}? <br /><br />
                        Al confirmar, estarías eliminando{' '}
                        <span style={{ color: 'red', fontWeight: 'bold' }}>permanentemente</span> todo su acceso al sistema y{' '}
                        <strong>todo el avance</strong> de los estudiantes asociados.
                    </>
                }
            />
			</Component>
        );
    }



	return contenido;

}

Profile.propTypes = {
	email: PropTypes.string,
};

// #region Funciones

const get_user = async (userEmail, setInitialValues, setShowSpinner,setIsLoadingRespuestas) => {
	let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
		const url = `${process.env.NEXT_PUBLIC_API_URL}/user/${userEmail}`
		const response = await apiRest.fetchGet(url);
		if (response.status !== 200) return toast.error(response.data.message);

		setInitialValues({
			name: response.data.nombre ?? '',
			surname: response.data.apellido ?? '',
			phone: response.data.telefono ?? ''
		});
	} catch (error) {
		toast.error("Ocurrió un error al obtener el usuario");
	}finally { await new Promise(resolve => setTimeout(resolve, 1000)); clearTimeout(timeout); setShowSpinner(false);setIsLoadingRespuestas(false);}
};

const fetchEmail = async (email, setUserEmail, setTypeUser, setShowSpinner, setIsLoadingRespuestas) => {
	
	let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);
		if (email) {
			setUserEmail(email);
		} else {
			setUserEmail(await gestorCookie.get_one_element_cookie("user-data", "correo"));
		}
		setTypeUser(await gestorCookie.get_one_element_cookie("user-data", "type"));
	} catch (error) {
		toast.error("Ocurrió un error al obtener el usuario");
	}finally { await new Promise(resolve => setTimeout(resolve, 1000)); clearTimeout(timeout); setShowSpinner(false);setIsLoadingRespuestas(false);}
};

const personalSchema = Yup.object({
	name: Yup.string().required("El nombre es obligatorio"),
	surname: Yup.string().required("El apellido es obligatorio"),
	phone: Yup.string(),
});

const passwordSchema = Yup.object({
	password: Yup.string()
		.min(6, "La contraseña debe tener al menos 6 caracteres")
		.required("La contraseña es obligatoria"),
	verifyPassword: Yup.string()
		.oneOf([Yup.ref("password"), null], "Las contraseñas no coinciden")
		.required("Debe repetir la contraseña"),
});

// #endregion

// #region Estilos
const Component = styled.div`
	--primary-color: #0465ac;
	--primary-light: #e6f0fa;
	--border-color: #ddd;
	--bg-light: #ffffff;
	--text-main: #333;
	--text-muted: #777;

	font-family: var(--font-lexend);

	.profile-header {
		display: flex;
		align-items: center;
		gap: 24px;
		padding: 24px;
		background: var(--bg-light);
		border-radius: 16px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
		margin-bottom: 32px;
	}

	.profile-image {
		width: 120px;
		height: 120px;
		border-radius: 50%;
		overflow: hidden;
		border: 3px solid var(--primary-color);
	}

	.profile-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.profile-info {
		flex: 1;
	}

	.profile-info h1 {
		font-size: 1.75rem;
		margin: 0;
		color: var(--text-main);
	}

	.profile-info p {
		color: var(--text-muted);
		margin-top: 8px;
		font-size: 1rem;
	}

	.edit-button, .delete-button {
		margin-top: 12px;
		background: linear-gradient(135deg, #0465ac, #039be5);
		color: #fff;
		padding: 10px 16px;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition: background 0.3s;
		margin-right: 10px;
	}

	.delete-button {
		background: #e53935;
	}

	.profile-tabs {
		width:80%;
		display: flex;
		gap: 16px;
		margin-bottom: 24px;
	}

	.tab-button {
		flex: 1;
		padding: 12px 0;
		border: none;
		background-color: var(--primary-light);
		color: var(--primary-color);
		cursor: pointer;
		border-radius: 10px;
		font-weight: bold;
		transition: background-color 0.3s, transform 0.2s;
	}

	.tab-button.active {
		background-color: var(--primary-color);
		color: white;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
	}

	.profile-content {
		padding: 24px;
		border-radius: 16px;
	}

	.header-section {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 24px;
	}

	.header-section h2 {
		font-size: 1.2rem;
		font-weight: 600;
		color: var(--text-main);
		margin: 0;
	}

	.info-row {
		display: flex;
		flex-direction: column;
		margin-bottom: 18px;
	}

	.info-row label {
		font-weight: 600;
		margin-bottom: 6px;
		color: var(--text-main);
	}

	.info-row input {
		padding: 12px;
		border: 1px solid var(--border-color);
		border-radius: 8px;
		transition: border-color 0.3s, box-shadow 0.3s;
	}

	.info-row input:focus {
		border-color: var(--primary-color);
		box-shadow: 0 0 0 2px rgba(4, 101, 172, 0.2);
		outline: none;
	}

	.info-row input:disabled {
		background-color: #f5f7fa;
		color: #aaa;
	}

	.button-row {
		margin-top: 24px;
		display: flex;
		justify-content: center;
		gap: 16px;
	}

	.save-button, .cancel-button {
		padding: 10px 20px;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		font-weight: bold;
		transition: background-color 0.3s;
	}

	.save-button {
		background-color: var(--primary-color);
		color: white;
	}

	.save-button:hover {
		background-color: #035d9c;
	}

	.cancel-button {
		background-color: #f0f0f0;
		color: var(--text-main);
	}

	.cancel-button:hover {
		background-color: #e0e0e0;
	}
`;
// #endregion
