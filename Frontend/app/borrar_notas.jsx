- areglar el bug cuando el estudiante completa una evaluacion, buscar si darle un reload o algo
- ponerle el loading a todas las peticiones get post put delete
- ver el tema de los contenidos
- validar el carrusel cuando sea una unidad o dos o 3, como se comporta menos de 5 unidades, validarlo OJO
- quitar static route
- colocar numeración en los tab del perfil estudiante
- crear todo el tema de nota final de los estudiantes

mejoras:
- Listado de todos los estudiantes y a qué profesor está asignado, perfil administrador
- También el administrador puede desmatricularlos
- colocar que el administrador también vea el modulo del componente

- agregarle los propTypes a todos los componentes
PropTypes.string.isRequired	Cadena
PropTypes.number	Número
PropTypes.bool	Booleano
PropTypes.array	Arreglo
PropTypes.object	Objeto
PropTypes.func	Función
PropTypes.node	Cualquier cosa que se pueda renderizar
PropTypes.element	Un elemento React
PropTypes.oneOf([...])	Uno de un conjunto de valores
PropTypes.shape({})	Forma específica de un objeto

PropTypes
CrearUnidades.propTypes = {
TabClick: PropTypes.func.isRequired,
};

const url = `http://localhost:3333/ovacademy/unidades`
ButtonAccion, InputSearch

npm install @tiptap/react @tiptap/starter-kit
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-text-style @tiptap/extension-color

<div className='center'>
    <ButtonSave type="submit" className="mt-10 mr-10">Guardar</ButtonSave>
    <ButtonSave onClick={() => console.log("Cancelar")} bgColor="#e74c3c" hoverColor="#c0392b" className="mt-10"> Cancelar </ButtonSave>
    <ButtonSave bgColor="#d5dbdb" hoverColor="#bfc9ca" className="mt-10" onClick={() => router.push('/ovacademy/administrador/dashboard')}>Regresar</ButtonSave>
</div>

	useEffect(() => {
		setHeaderText(
			<>
				<Link href={`/ovacademy/administrador/dashboard`}>Inicio</Link>
				<span className="separator"> &gt; </span>
				<span> Materia </span>
			</>
		);
	}, []);

	----------------------------------------------------
	
	await new Promise(resolve => setTimeout(resolve, 10000));
	Spinner,		

	const [showSpinner, setShowSpinner] = useState(false);
	const [isLoadingRespuestas, setIsLoadingRespuestas] = useState(true);

	let timeout; try { timeout = setTimeout(() => setShowSpinner(true), 300);

	}finally { clearTimeout(timeout); setShowSpinner(false);}
	}finally { clearTimeout(timeout); setShowSpinner(false);setIsLoadingRespuestas(false);}

	-----------------------------------------------------


	

	let contenido;

    if (showSpinner || isLoadingRespuestas) {
        contenido = <Spinner show={showSpinner} />;
    } else {
        contenido = (
            <GenerarPreguntasAbiertas
                idEvaluacion={idEvaluacion}
                id_estudiante={id_estudiante}
                preguntas={preguntas}
                respuestasPrevias={respuestasPrevias}
                notaEvaluacion={notaEvaluacion}
                isProfesor={isProfesor}
            />
        );
    }

	return contenido;	

    return <Component>{contenido}</Component>;

	-----------------------------------------------------

	const recargar = async () => {
		toast.success('se activo el recargar');
    };

- areglar el bug cuando el estudiante completa una evaluacion, buscar si darle un reload o algo
- ponerle el loading a todas las peticiones get post put delete
- ver el tema de los contenidos
- validar el carrusel cuando sea una unidad o dos o 3, como se comporta menos de 5 unidades, validarlo OJO
- quitar static route
- colocar numeración en los tab del perfil estudiante
- crear todo el tema de nota final de los estudiantes

mejoras:
- Listado de todos los estudiantes y a qué profesor está asignado, perfil administrador
- También el administrador puede desmatricularlos
- colocar que el administrador también vea el modulo del componente

- agregarle los propTypes a todos los componentes
PropTypes.string.isRequired	Cadena
PropTypes.number	Número
PropTypes.bool	Booleano
PropTypes.array	Arreglo
PropTypes.object	Objeto
PropTypes.func	Función
PropTypes.node	Cualquier cosa que se pueda renderizar
PropTypes.element	Un elemento React
PropTypes.oneOf([...])	Uno de un conjunto de valores
PropTypes.shape({})	Forma específica de un objeto

PropTypes
CrearUnidades.propTypes = {
TabClick: PropTypes.func.isRequired,
};

const url = `${process.env.NEXT_PUBLIC_API_URL}/materia`
ButtonAccion, InputSearch

Footer
<Footer />

console.log(`Función: %c${editar_semestre.name}`, 'color: #7DBAE9; font-weight: bold;', 'Response:', response);