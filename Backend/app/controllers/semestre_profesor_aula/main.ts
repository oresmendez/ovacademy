import type { HttpContext } from '@adonisjs/core/http'
import SemestreProfesorAulaService from '../../controllers/semestre_profesor_aula/service.js'
import SemestreController from '../semestre/main.js';
import TokenController from '../token/main.js';
import EstudianteAulaController from '../estudiante_aula/main.js';

export default class SemestreProfesorAulaController {

    private readonly EstudianteAulaController_: EstudianteAulaController;
    private readonly TokenController_: TokenController;
    private readonly SemestreController_: SemestreController;
    private readonly SemestreProfesorAulaService_: SemestreProfesorAulaService;

    constructor() {
        this.EstudianteAulaController_ = new EstudianteAulaController();
        this.TokenController_ = new TokenController();
        this.SemestreController_ = new SemestreController();
        this.SemestreProfesorAulaService_ = new SemestreProfesorAulaService();
    }

    obtener_datos_aula = async (id: number) => {
        
        const aula = await this.SemestreProfesorAulaService_.obtenerAulaByID(id);

        if (!aula) {
            return false
        }

        return aula
    }

    get_todas_aulas_con_profesor = async (semestre: number) => {
        
        return  await this.SemestreProfesorAulaService_.obtener_todas_aulas_con_profesor(semestre);
    }

    public async asociar_profesor_aula({ request, response }: HttpContext) {

        try {

            const { aula, profesor} = request.only(['aula', 'profesor']);

            const semestre = await this.SemestreController_.obtenerSemestreActivo();
            if (!semestre) {return response.status(404).json({message: 'Semestre no encontrado'});}

            await this.SemestreProfesorAulaService_.crear_asociacion_profesorAulaSemestre(semestre.id, profesor, aula);

            return response.status(200).json({
                message: 'Profesor asignado a la sección correctamente',
                success: true,
            });


        } catch (error) {
            console.error('Error al asociar profesor y aula:', error);
            return response.status(500).json({
                message: 'Error interno del servidor',
                success: false
            });
        }
    }

    public async obtener_aula_asoaciada_profesor({ request, response }: HttpContext) {

        try {

            const token = request.header('token');
            if (!token) {return response.unauthorized({ message: 'Token requerido' });}

            const userByToken = await this.TokenController_.obtenerUserByToken(token);

            if (!(userByToken && userByToken.length > 0)) {
                return response.notFound({ message: 'No se encontro un token valido de usuario' });
            }

            const semestre = await this.SemestreController_.obtenerSemestreActivo();
            
            if (!semestre) {return response.status(404).json({message: 'Semestre no encontrado'});}

            const AulasByProfesor = await this.SemestreProfesorAulaService_.obtenerAulaAsociadaProfesor(semestre.id, userByToken[0].user_id);
    
            if (!AulasByProfesor) {
                return response.notFound({ message: 'No se encontro ningun aula asociada' });
            }

            return response.ok({ message: 'aulas', data: AulasByProfesor });

        } catch (error) {return response.internalServerError({ message: 'Error interno del servidor' });}
        
    }

    public async obtener_todas_aulas_con_profesor({ request, response }: HttpContext) {
        
        try {

            const semestre = await this.SemestreController_.obtenerSemestreActivo();
            
            if (!semestre) {return response.status(404).json({message: 'Semestre no encontrado'});}
            
            const AulasByProfesor = await this.get_todas_aulas_con_profesor(semestre.id);
            console.log(AulasByProfesor)
            if (!AulasByProfesor) {
                return response.notFound({ message: 'No se encontro ningun aula asociada' });
            }

            return response.ok({ message: 'aulas', data: AulasByProfesor });

        } catch (error) {return response.internalServerError({ message: 'Error interno del servidor' });}
        
    }

    public async desasociar_profesor_aula({ request, response }: HttpContext) {
        
        try {

            const semestre = await this.SemestreController_.obtenerSemestreActivo();
            
            if (!semestre) {return response.status(404).json({message: 'Semestre no encontrado'});}

            const { aula, profesor} = request.only(['aula', 'profesor']);

            const aulaProfesor = await this.SemestreProfesorAulaService_.obtener_detalles_profesor_aula(semestre.id, profesor, aula);

            if (!aulaProfesor) {
                return response.status(404).json({ message: 'Estudiante no encontrado' })
            }

            await aulaProfesor.delete()

            return response.status(200).json({ message: 'Registro eliminado correctamente' })
            
        } catch (error) {
            console.error(error);
            return response.internalServerError({ message: 'Error interno del servidor ' });}
    }

    public async habilitar_or_deshabilitar_seccion({ request, params, response }: HttpContext) {
            
        try {

            const semestre = await this.SemestreController_.obtenerSemestreActivo();
            
            if (!semestre) {return response.status(404).json({message: 'Semestre no encontrado'});}

            const token = request.header('token');
            if (!token) {return response.unauthorized({ message: 'Token requerido' });}

            const userByToken = await this.TokenController_.obtenerUserByToken(token);

            if (!(userByToken && userByToken.length > 0)) {
                return response.notFound({ message: 'No se encontro un token valido de usuario' });
            }
            
            const aulaProfesor = await this.SemestreProfesorAulaService_.obtener_detalles_profesor_aula(semestre.id, userByToken[0].user_id, params.aula_id);
    
            if (!aulaProfesor) {
                return response.status(404).json({
                    message: 'Unidad no encontrada',
                });
            }
            
            const estudiante_aula = await this.EstudianteAulaController_.obtener_detalles_del_aula(aulaProfesor.id);

            if (!estudiante_aula || !Array.isArray(estudiante_aula)) {
                return response.status(404).json({
                    message: 'No se encontraron estudiantes en el aula',
                });
            }
            
            const estudiantesConNotaPendiente = estudiante_aula.some(est => est.$attributes.nota_final === null);

            if (estudiantesConNotaPendiente) {
                return response.status(400).json({
                    message: 'Hay estudiantes con nota final pendiente.',
                });
            }

            aulaProfesor.habilitado = !aulaProfesor.habilitado
    
            await aulaProfesor.save();
    
            return response.status(200).json({
                success: true,
            });

        } catch (error) {
            console.error(error);
            return response.status(500)
        }
    }

    public async obtenerAulaProfesorByID_Aula({ request, params, response }: HttpContext) {
        
        try {

            const semestre = await this.SemestreController_.obtenerSemestreActivo();
            
            if (!semestre) {return response.status(404).json({message: 'Semestre no encontrado'});}

            const token = request.header('token');
            if (!token) {return response.unauthorized({ message: 'Token requerido' });}

            const userByToken = await this.TokenController_.obtenerUserByToken(token);

            if (!(userByToken && userByToken.length > 0)) {
                return response.notFound({ message: 'No se encontro un token valido de usuario' });
            }

            const aulaProfesor = await this.SemestreProfesorAulaService_.obtener_detalles_profesor_aula(semestre.id, userByToken[0].user_id, params.aula_id);

            if (!aulaProfesor) {
                return response.notFound({ message: 'No se encontro ningun aula' });
            }
            return response.ok({ message: 'aula', data: aulaProfesor });
        } catch (error) {
            console.error(error);
            return response.internalServerError({ message: 'Error interno del servidor' });
        }
    }

}