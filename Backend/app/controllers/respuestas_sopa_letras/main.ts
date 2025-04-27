import type { HttpContext } from '@adonisjs/core/http'

import RespuestasSopaDeLetrasService from './service.js';
const RespuestasSopaDeLetrasService_ = new RespuestasSopaDeLetrasService();

import TokenController from '../token/main.js';
const TokenController_ = new TokenController();

import SemestreController from '../semestre/main.js';
const SemestreController_ = new SemestreController();

export default class RespuestasSopaDeLetrasController {

    public async get_respuestas_SopaDeLetras({ params, request, response }: HttpContext) {
        
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
            
            const idEstInt = Number(id_estudiante);
            if (isNaN(idEstInt)) {
              return response.badRequest({ message: 'ID del estudiante inválido' });
            }

            const sopadeletras = await RespuestasSopaDeLetrasService_.obtener_RespuestasSopaDeLetras(id_estudiante, params.id);
    
            if (!sopadeletras) {
                return response.status(404).json({ message: 'sopadeletras no encontrada' });
            }
    
            return response.status(200).json({
                message: 'sopa de letras guardada',
                data: sopadeletras
            });
        } catch (error) {
            console.error('Error obteniendo la sopadeletras:', error);
            return response.status(500).json({ message: 'Error interno del servidor', error });
        }
    }

    public async save_respuestas_SopaDeLetras({ request, response }: HttpContext) {
        
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

            const { sopa_id, matrix} = request.only(['sopa_id', 'matrix']) 

            const sopadeletras = await RespuestasSopaDeLetrasService_.create_respuesta_SopaDeLetras(userByToken[0].user_id, sopa_id, semestreActivo[0].id, matrix);
    
            if (!sopadeletras) {
                return response.status(404).json({ message: 'sopadeletras no encontrada' });
            }
    
            return response.status(200).json({
                message: 'sopa de letras guardada',
                data: sopadeletras
            });
        } catch (error) {
            console.error('Error obteniendo la sopadeletras:', error);
            return response.status(500).json({ message: 'Error interno del servidor', error });
        }
    }

}