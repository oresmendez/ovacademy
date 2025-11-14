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

		// Obtener IDs enviados desde el frontend
		const idsDesdeFrontend = cuestionario
			.map((item) => item.id)
			.filter((id) => id && id !== 0);

		// Obtener todas las preguntas existentes en la BD
		const preguntasExistentes = await CuestionariosService_.obtener_cuestionario(evaluacion_id);

		// Eliminar las que ya no están en el frontend
		if (preguntasExistentes) {
			for (const pregunta of preguntasExistentes) {
				if (!idsDesdeFrontend.includes(pregunta.id)) {
					await pregunta.delete();
				}
			}
		}

		// Procesar creación y actualización
		for (const item of cuestionario) {
			const { id, pregunta, opciones, respuesta: respuesta_correcta } = item;

			const cuestionarioExistente = await CuestionariosService_.obtener_cuestionario_id(id);

			if (!cuestionarioExistente) {
				// Crear nueva
				const creado = await this.create_cuestionario(
					evaluacion_id,
					pregunta,
					opciones,
					respuesta_correcta
				);

				if (!creado) {
					return response.status(400).send({
						message: 'Error en la creación del cuestionario',
						success: false,
					});
				}
				continue;
			}

			// Actualizar existente
			const cuestionario_ = cuestionarioExistente[0];
			cuestionario_.merge({ pregunta, opciones, respuesta_correcta });
			await cuestionario_.save();
		}

		return response.status(200).json({
			message: 'Cuestionario actualizado con éxito',
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