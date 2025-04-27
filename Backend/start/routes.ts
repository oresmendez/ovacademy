
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

import InicializacionController from '#controllers/inicializacion/main'

import TokenController from '#controllers/token/main'
import UsersController from '#controllers/users/main'
import SesioneController from '#controllers/sesiones/main'

import MateriasController from '#controllers/materia/main'
import UnidadesController from '#controllers/unidades/main'
import ContenidosController from '#controllers/contenidos/main'

import EvaluacionesController from '#controllers/evaluaciones/main'
import SopaDeLetrasController from '#controllers/sopa_de_letras/main'
import RespuestasSopaDeLetrasController from '#controllers/respuestas_sopa_letras/main'
import CuestionariosController from '#controllers/cuestionarios/main'
import RespuestasCuestionarioController from '#controllers/respuestas_cuestionarios/main'
import PreguntasAbiertasController from '#controllers/preguntas_abiertas/main'
import RespuestasPreguntasAbiertasController from '#controllers/respuestas_preguntas_abiertas/main'
import TypeEvaluacionesController from '#controllers/type_evaluaciones/main'
import TypeEscalaApreciacionController from '#controllers/type_escala_apreciacion/main'

import NotaEstudianteController from '#controllers/notas_estudiante/main'

import SemestreController from '#controllers/semestre/main'
import AulaController from '#controllers/aula/main'
import SemestreProfesorAulController from '#controllers/semestre_profesor_aula/main'
import EstudianteAulaController from '#controllers/estudiante_aula/main'

router.group(() => {

    router.group(() => {
        router.get('/', [InicializacionController, 'inicializar_ova']) //inicializar la aplicacion cargando datos base
    }).prefix('/inicializacion')

    router.group(() => {
        router.get('/verifytoken', [TokenController, 'verifyToken']) //inicializar la aplicacion cargando datos base
        router.post('/login', [SesioneController, 'iniciar_session']) //Loggeo de un usuario
        router.put('changePassword', [SesioneController, 'cambiar_contrasena']) // CAMBIAR CONTRASENA DE UN USUARIO
    }).prefix('/auth')

    router.group(() => {       
        router.get('/', [UsersController, 'listar_usuarios']) // VER LISTADO DE ESTUDIANTES O PROFESORES
        router.get(':email', [UsersController, 'ver_usuario']) // VER USUARIO
        router.post('', [UsersController, 'create_usuario']) // CREAR UN USUARIO
        router.put('', [UsersController, 'editar_usuario']) // EDITAR UN USUARIO
        router.delete('', [UsersController, 'habilitar_or_deshabilitar_user']) // ACTIVAR O DESHABILITAR UN USUARIO
        
    }).prefix('/user')

    router.group(() => {
        router.get('/', async () => {
            return { hello: 'world' }
        })
    }).prefix('/teacher').use(middleware.auth_teacher())

    router.group(() => {
        router.get('', [SemestreController, 'get_Semestres']) // MUESTRA TODOS LOS SEMESTRES
        router.get('activo', [SemestreController, 'get_SemestreActivo']) // MUESTRA EL SEMESTRE ACTUAL
        router.post('', [SemestreController, 'create_semestre']) // CREAR UN SEMESTRE
        router.post('aula', [SemestreProfesorAulController, 'asociar_profesor_aula']) // 
        router.delete('aula', [SemestreProfesorAulController, 'desasociar_profesor_aula']) // 
        router.delete('/aula/:aula_id', [SemestreProfesorAulController, 'habilitar_or_deshabilitar_seccion']); // DESMATRICULAR AULA
    }).prefix('/semestre')
    
    router.group(() => {
        router.get('', [AulaController, 'list_aulas']) // MUESTRA TODOS LAS AULAS DISPONIBLES
        router.get('profesor', [SemestreProfesorAulController, 'obtener_aula_asoaciada_profesor']) // MUESTRA TODOS LAS AULAS DISPONIBLES
        router.get('estudiantesInscritos', [EstudianteAulaController, 'obtener_estudiantes_inscritos_aula_general']) // 
        router.get('profesorWithAula', [SemestreProfesorAulController, 'obtener_todas_aulas_con_profesor']) // 
        router.post('estudiantesByAula', [EstudianteAulaController, 'obtener_estudiantes_inscritos_by_aula']) // 
        router.get('obtenerAulabyaulaID/:aula_id', [SemestreProfesorAulController, 'obtenerAulaProfesorByID_Aula']) // 
        router.post('', [AulaController, 'create_aula']) // CREAR UN AULA
        router.post('asociarEstudiante', [EstudianteAulaController, 'registrar_estudiante_a_aula']) // ASOCIA UN ESTUDIANTE A UN AULA
        router.delete('/desmatricular/:id', [EstudianteAulaController, 'desmatricular_estudiante']); // DESMATRICULAR ESTUDIANTE
    }).prefix('/aula')

    router.group(() => {

        router.get('', [MateriasController, 'get_Materia']) // MUESTRA LA MATERIA DISPONIBLE
        router.put('', [MateriasController, 'edit_Materia']) // EDITAR LA MATERIA

    }).prefix('/materia')

    router.group(() => {
        router.get('/profesor', [UnidadesController, 'get_unidades_by_profesor']); // MUESTRA TODAS LAS UNIDADES DISPONIBLES DE UN PROFESOR
        router.get('/estudiante', [UnidadesController, 'get_unidades_by_estudiante']); // MUESTRA TODAS LAS UNIDADES DISPONIBLES DE UN ESTUDIANTE
        router.get('/:id', [UnidadesController, 'get_UnidadById']); // MUESTRA UNA UNIDAD
        router.post('', [UnidadesController, 'create_unidad']); // CREAR UNA UNIDAD
        router.put('', [UnidadesController, 'edit_unidad_by_Id']); // EDITA UNA UNIDAD
        router.delete('/:id', [UnidadesController, 'habilitar_or_deshabilitar_unidad']); // DESAHIBILITA UNA UNIDAD
    }).prefix('/unidades')

    router.group(() => {
        router.get('/contenidoDetalles/:id', [ContenidosController, 'get_ContenidoDetails']); // MUESTRA EL DETALLE DE UN CONTENIDO
        router.get('/:unidad', [ContenidosController, 'get_ContenidoByUnidad']); // MUESTRA LOS CONTENIDOS POR UNIDAD
        router.post('', [ContenidosController, 'create_contenido']); // CREAR UN CONTENIDO ASOCIADO A UNA UNIDAD
        router.put('', [ContenidosController, 'edit_contenido_by_Id']); // EDITA UNA CONTENIDO
        router.delete('/:id', [ContenidosController, 'habilitar_or_deshabilitar_contenido']); // DESAHIBILITA UNA UNIDAD
    }).prefix('/contenido')

    router.group(() => {
        
        router.get('/SopaDeLetras/:id', [SopaDeLetrasController, 'get_SopaDeLetras']); // MUESTRA EL ARRAY DE LA SOPA DE LETRAS
        router.put('/SopaDeLetras', [SopaDeLetrasController, 'edit_sopa_de_letras']); // EDITA UNA SOPA DE LETRAS
        router.get('/RespuestaSopaDeLetras/:id', [RespuestasSopaDeLetrasController, 'get_respuestas_SopaDeLetras']); // OBTENER LAS RESPUESTAS DE UNA SOPA DE LETRAS
        router.post('/SaveSopaDeLetras', [RespuestasSopaDeLetrasController, 'save_respuestas_SopaDeLetras']); // GUARDAR EL RESULTADO DE UNA SOPA DE LETRAS

        router.get('/cuestionario/:id', [CuestionariosController, 'get_cuestionario']); // MUESTRA LAS PREGUNTAS Y RESPUESTAS DE UN CUESTIONARIO
        router.put('/cuestionario', [CuestionariosController, 'edit_cuestionario']); // EDITA UNA SOPA DE LETRAS
        router.post('/SaveCuestionario', [RespuestasCuestionarioController, 'save_respuestas_cuestionario']); // GUARDAR EL RESULTADO DE UN CUESTIONARIO
        router.get('/RespuestaCuestionario/:id', [RespuestasCuestionarioController, 'get_respuestas_cuestionario']); // OBTENER LAS RESPUESTAS DE UN CUESTIONARIO
        
        router.get('/preguntasAbiertas/:idEvaluacion', [PreguntasAbiertasController, 'get_preguntas']); 
        router.post('/SavePreguntasAbiertas', [RespuestasPreguntasAbiertasController, 'save_respuestas_preguntas_abiertas']);
        router.get('/RespuestaPreguntasAbiertas/:id', [RespuestasPreguntasAbiertasController, 'get_respuestas_cuestionario']); // 
        router.put('/preguntasAbiertas', [RespuestasPreguntasAbiertasController, 'edit_respuestas_preguntas_abiertas']); 


        router.get('/NotaEstudiante/:estudiante_id', [NotaEstudianteController, 'get_notas_estudiante']); //
        router.get('/NotaEstudiante/:estudiante_id/:id_unidad', [NotaEstudianteController, 'get_notas_estudiante_by_unidad']); // 
        router.get('/NotaEstudiante/nota/:estudiante_id/:evaluacion_id', [NotaEstudianteController, 'get_notas_estudiante_by_evaluacion']); // 
        router.post('/SaveNotaEstudiante', [NotaEstudianteController, 'crear_nota_estudiante']); // GUARDAR NOTA DE UN ESTUDIANTE
        router.put('/NotaEstudiante', [NotaEstudianteController, 'edit_nota']); // EDITA UNA SOPA DE LETRAS

        router.get('/TypeEvaluaciones', [TypeEvaluacionesController, 'get_TypeEvaluaciones']); // MUESTRA EL DETALLE DE UN CONTENIDO
        router.get('/TypeEscalaApreciacion', [TypeEscalaApreciacionController, 'get_TypeEscalaApreciacion']); 
        router.get('/:id', [EvaluacionesController, 'obtener_evaluacionesByUnidad']); // MUESTRA TODAS LAS EVALUACIONES ASOCIADAS A UNA UNIDAD
        router.post('', [EvaluacionesController, 'create_evaluacion']); // CREAR UNA EVALUACION
    }).prefix('/evaluaciones')

}).prefix('ovacademy')




// Ruta de prueba
// router.get('/test', async () => {
//     return { hello: 'world' }
// })
