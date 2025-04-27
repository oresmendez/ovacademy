import type { HttpContext } from '@adonisjs/core/http'

import CuestionariosService from './service.js';
const CuestionariosService_ = new CuestionariosService();

export default class CuestionariosController {

    public async create_cuestionario(evaluacion_id: number, pregunta: string, opciones: string, respuesta_correcta: string ) {
        
        try {
            
            const cuestionario = await CuestionariosService_.create_cuestionarios(evaluacion_id, pregunta, opciones, respuesta_correcta)

            if (!cuestionario) {
                return false;
            }

            return true;
            
        } catch (error) {
            console.error('Error obteniendo el cuestionario:', error);
            return false
        }
    }

    public async get_cuestionario({ params, response }: HttpContext) {
        
        try {
            
            const cuestionario = await CuestionariosService_.obtener_cuestionario(params.id);
    
            if (!cuestionario) {
                return response.status(404).json({ message: 'cuestionario no encontrado' });
            }
    
            return response.status(200).json({
                message: '',
                data: cuestionario
            });
        } catch (error) {
            console.error('Error obteniendo el cuestionario:', error);
            return response.status(500).json({ message: 'Error interno del servidor', error });
        }
    }

    public async edit_cuestionario({ request, response }: HttpContext) {
        try {
            
            const { evaluacion_id, cuestionario } = request.only(['evaluacion_id', 'cuestionario']);

            for (const item of cuestionario) {
                const id = item.id;
                const pregunta = item.pregunta;
                const opciones = item.opciones;
                const respuesta_correcta = item.respuesta;

                const cuestionario = await CuestionariosService_.obtener_cuestionario_id(id);
    
                if (!cuestionario) {

                    const creado = await this.create_cuestionario(
                        evaluacion_id,
                        pregunta,
                        opciones,
                        respuesta_correcta
                    );
            
                    if (!creado) {
                        
                        return response.status(400).send({ 
                            message: 'Error en la creación del cuestionario', 
                            success: false 
                        });
                    }

                    continue
                }

                const cuestionario_ = cuestionario[0];

                cuestionario_.merge({ pregunta, opciones, respuesta_correcta });
                await cuestionario_.save();

            }

            return response.status(200).json({
                message: 'cuestionario de letras actualizada con éxito'
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