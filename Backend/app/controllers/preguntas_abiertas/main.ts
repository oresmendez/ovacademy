import type { HttpContext } from '@adonisjs/core/http'

import PreguntasAbiertasService from './service.js';
const PreguntasAbiertasService_ = new PreguntasAbiertasService();

export default class PreguntasAbiertasController {

    public async create_PreguntasAbiertas(evaluacion_id: number, pregunta: string ) {
        try {
            
            const evaluacion = await PreguntasAbiertasService_.create_PreguntasAbiertas(evaluacion_id, pregunta)

            if (!evaluacion) {
                return false;
            }

            return true;
            
        } catch (error) {
            return false
        }
    }

    public async get_preguntas({ params, response }: HttpContext) {
        
        try {

            const preguntas = await PreguntasAbiertasService_.obtener_PreguntasAbiertas(params.idEvaluacion);
    
            if (!preguntas) {
                return response.status(404).json({ message: 'preguntas no encontrada' });
            }
    
            return response.status(200).json({
                message: '',
                data: preguntas
            });
        } catch (error) {
            console.error('Error obteniendo la preguntas:', error);
            return response.status(500).json({ message: 'Error interno del servidor', error });
        }
    }

    public async edit_preguntas_abiertas({ request, response }: HttpContext) {
        try {
            
            const { evaluacion_id, palabras} = request.only(['evaluacion_id', 'palabras']);

            for (const item of palabras) {
                const { id, pregunta, eliminada } = item;

                if (id == null) {
                    await PreguntasAbiertasService_.create_PreguntasAbiertas(evaluacion_id, pregunta)
                }else{
                    const resultado = await PreguntasAbiertasService_.editar_pregunta(id, pregunta, eliminada);
    
                    if (!resultado) {
                        return response.status(400).json({
                            message: `Error al editar la pregunta con ID ${id}`,
                            success: false,
                        });
                    }
                }

            }

            return response.status(200).json({
                message: 'Preguntas actualizadas correctamente',
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