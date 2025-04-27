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

    // public async edit_sopa_de_letras({ request, response }: HttpContext) {
    //     try {
            
    //         const { evaluacion_id, palabras} = request.only(['evaluacion_id', 'palabras']);
            
    //         const sopadeletras = await SopaDeLetrasService_.obtener_SopaDeLetras(evaluacion_id);
    
    //         if (!sopadeletras) {
    //             return response.status(404).json({ message: 'sopadeletras no encontrada' });
    //         }
            
    //         try {
    //             const sopa = sopadeletras[0];

    //             sopa.merge({ palabras });
    //             await sopa.save();

    //             return response.status(200).json({
    //                 message: 'sopa de letras actualizada con éxito',
    //                 data: sopadeletras,
    //             });
    
    //         } catch (saveError) {
    //             console.error(`Error al guardar el contenido: ${saveError.message}`);
    //             return response.status(500).json({
    //                 message: 'Error al guardar los cambios del Contenido',
    //                 success: false,
    //                 error: saveError.message,
    //             });
    //         }
    
    //     } catch (error) {
    //         console.error(`Error en edit: ${error.message}`);
    //         return response.status(500).json({
    //             message: 'Error interno del servidor',
    //             success: false,
    //             error: error.message,
    //         });
    //     }
    // }

}