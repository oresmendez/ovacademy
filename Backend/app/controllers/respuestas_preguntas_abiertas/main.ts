import type { HttpContext } from '@adonisjs/core/http'

import RespuestasPreguntasAbiertasService from './service.js';
const RespuestasPreguntasAbiertasService_ = new RespuestasPreguntasAbiertasService();

import TokenController from '../token/main.js';
const TokenController_ = new TokenController();

import SemestreController from '../semestre/main.js';
const SemestreController_ = new SemestreController();

export default class RespuestasPreguntasAbiertasController {

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
            const preguntas = await RespuestasPreguntasAbiertasService_.obtener_Respuestas_preguntas(ids, id_estudiante);
    
            if (!preguntas) {
                return response.status(404).json({ message: 'preguntas no encontrada' });
            }
    
            return response.status(200).json({
                message: 'respuestas preguntas',
                data: preguntas
            });
        } catch (error) {
            console.error('Error obteniendo la preguntas:', error);
            return response.status(500).json({ message: 'Error interno del servidor', error });
        }
    }

    public async save_respuestas_preguntas_abiertas({ request, response }: HttpContext) {
        
        try {
 
            const token = request.header('token');

            if (!token) {return response.unauthorized({ message: 'Token requerido' });}
            const userByToken = await TokenController_.obtenerUserByToken(token);

            if (!(userByToken && userByToken.length > 0)) {
                return response.notFound({ message: 'No se encontro un token valido de usuario' });
            }

            const semestre = await SemestreController_.obtenerSemestreActivo();
            if (!semestre) {return response.status(404).json({message: 'Semestre no encontrado'});}

            const { respuestas } = request.only(['respuestas']);

            if (!Array.isArray(respuestas)) {
                return response.status(400).json({ message: 'respuestas debe ser un arreglo' });
            }

            for (const item of respuestas) {
                const { preguntaId, respuesta } = item;

                await RespuestasPreguntasAbiertasService_.create_respuesta_preguntas_abiertas(
                    userByToken[0].user_id,
                    preguntaId,
                    semestre.id,
                    respuesta
                );
            }

            return response.status(200).json({
                message: 'Respuestas guardadas correctamente'
            });


        } catch (error) {
            console.error('Error obteniendo la sopadeletras:', error);
            return response.status(500).json({ message: 'Error interno del servidor', error });
        }
    }

    public async edit_respuestas_preguntas_abiertas({ request, response }: HttpContext) {
        try {
            const { calificacion } = request.only(['calificacion']);
    
            for (const item of calificacion) {
                const id_escala_apreciacion = item.calificacion;
                const preguntaId = item.preguntaId;

                // Obtener las respuestas del cuestionario
                const cuestionarios = await RespuestasPreguntasAbiertasService_.obtener_respuestas_preguntas_id(preguntaId);
                console.log(cuestionarios)
                // Verificar si el cuestionario existe
                if (!cuestionarios || cuestionarios.length === 0) {
                    return response.status(404).json({
                        message: `No se encontró el cuestionario para la pregunta con ID ${preguntaId}`,
                        success: false,
                    });
                }
    
                // Tomar el primer cuestionario (asumiendo que es el único)
                const cuestionario = cuestionarios[0];
    
                // Actualizar el cuestionario con el nuevo valor
                cuestionario.id_escala_apreciacion = id_escala_apreciacion;
                await cuestionario.save();
            }
    
            return response.status(200).json({
                message: 'Actualizada con éxito',
                success: true,
            });
    
        } catch (error) {
            console.error(`Error en edit: ${error.message}`);
            return response.status(500).json({
                message: 'Error interno del servidor',
                success: false,
                error: error.message,
            });
        }
    }
    

}