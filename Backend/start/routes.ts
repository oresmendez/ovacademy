
import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

import UsersController from '#controllers/users/main'
import SesioneController from '#controllers/authentication/main'
import MateriasController from '#controllers/materias/main'
import UnidadesController from '#controllers/unidades/main'
import ContentsController from '#controllers/contents/main'

// http://localhost:3333/ovacademy/user/estudianteHabilitar
router.group(() => {

    router.group(() => {
        router.post('/login', [SesioneController, 'authorize']) //Loggeo de un usuario
    }).prefix('/auth')

    router.group(() => {
        router.get('/', [UsersController, 'index']) //VER LISTADO DE UN USUARIO O PROFESOR
        router.get('/:id', [UsersController, 'show_id']) //VER USUARIO O PROFESOR ESPECÍFICAMENTE
        router.get('/show', [UsersController, 'show']) //VALIDAR TOKEN DE UN USUARIO
        router.post('', [UsersController, 'store']) // CREAR UN USUARIO
        router.put('', [UsersController, 'edit']) // EDITAR UN USUARIO
        router.put('estudianteHabilitar', [UsersController, 'habilitarEstudiante']) // HABILITAR UN USUARIO
        router.delete('', [UsersController, 'delete']) // ACTIVAR O DESHABILITAR UN USUARIO
    }).prefix('/user')

    router.group(() => {
        router.get('/', async () => {
            return { hello: 'world' }
        })
    }).prefix('/teacher').use(middleware.auth_teacher())

    router.group(() => {
        router.get('/index', [MateriasController, 'index']) // MUESTRA TODAS LAS MATERIAS DISPONIBLES
        router.post('/store', [MateriasController, 'store'])
        router.post('/obtenerUnaMateria', [MateriasController, 'show']) //OBTIENE UNA MATERIA
        router.put('', [MateriasController, 'edit']) //EDITAR EL NOMBRE DE LA MATERIA
    }).prefix('/subject')

    router.group(() => {
        router.post('/obtenerTodasLasUnidades', [UnidadesController, 'index'])
        router.post('/show', [UnidadesController, 'show'])
        router.put('', [UnidadesController, 'edit']) //EDITAR UNIDAD DE UNA MATERIA
    }).prefix('/subject/unidades')

    router.group(() => {
        router.post('/index', [ContentsController, 'index']) // muestra todo el contenido de una unidad y de una materia en especifico
        router.post('/show', [ContentsController, 'show'])
    }).prefix('/subject/unidades/contents')

}).prefix('ovacademy')




// Ruta de prueba
// router.get('/test', async () => {
//     return { hello: 'world' }
// })
