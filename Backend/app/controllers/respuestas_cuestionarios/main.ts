import type { HttpContext } from '@adonisjs/core/http'

import RespuestasCuestionariosService from './service.js';
const RespuestasCuestionariosService_ = new RespuestasCuestionariosService();

import TokenController from '../token/main.js';
const TokenController_ = new TokenController();

import SemestreController from '../semestre/main.js';
const SemestreController_ = new SemestreController();

export default class RespuestasCuestionarioController {

    public async get_respuestas_cuestionario({ params, request, response }: HttpContext) {
        
        try {
            
            let id_estudiante = request.qs().id_estudiante;
            
            if (
                request.qs().id_estudiante == null ||
                request.qs().id_estudiante === '' ||
                request.qs().id_estudiante === 'null' ||
                request.qs().id_estudiante === 'undefined'
              ) {

                const token = request.header('token');

                if (!token) {return response.unauthorized({ message: 'Token requerido' });}
                const userByToken = await TokenController_.obtenerUserByToken(token);

                if (!(userByToken && userByToken.length > 0)) {
                    return response.notFound({ message: 'No se encontro un token valido de usuario' });
                }

                id_estudiante = userByToken[0].user_id
            }
            
            const ids = params.id.split(',').map(Number);
            const cuestionario = await RespuestasCuestionariosService_.obtener_RespuestasCuestionario(ids, id_estudiante);
    
            if (!cuestionario) {
                return response.status(404).json({ message: 'cuestionario no encontrada' });
            }
    
            return response.status(200).json({
                message: 'respuestas cuestionario',
                data: cuestionario
            });
        } catch (error) {
            console.error('Error obteniendo la cuestionario:', error);
            return response.status(500).json({ message: 'Error interno del servidor', error });
        }
    }

    public async save_respuestas_cuestionario({ request, response }: HttpContext) {
        
        try {
 
            const token = request.header('token');

            if (!token) {return response.unauthorized({ message: 'Token requerido' });}
            const userByToken = await TokenController_.obtenerUserByToken(token);

            if (!(userByToken && userByToken.length > 0)) {
                return response.notFound({ message: 'No se encontro un token valido de usuario' });
            }

            const semestreActivo = await SemestreController_.obtenerSemestreActivo();
            if (!(semestreActivo && semestreActivo.length > 0)) {
                return response.notFound({ message: 'No se encontro ningun semestre activo' });
            }

            const { cuestionario_id, respuesta} = request.only(['cuestionario_id', 'respuesta']) 

            const cuestionario = await RespuestasCuestionariosService_.create_respuesta_cuestionario(userByToken[0].user_id, cuestionario_id, semestreActivo[0].id, respuesta);
    
            if (!cuestionario) {
                return response.status(404).json({ message: 'sopadeletras no encontrada' });
            }
    
            return response.status(200).json({
                message: 'cuestionario guardado',
                data: cuestionario
            });
        } catch (error) {
            console.error('Error obteniendo el cuestionario:', error);
            return response.status(500).json({ message: 'Error interno del servidor', error });
        }
    }

}