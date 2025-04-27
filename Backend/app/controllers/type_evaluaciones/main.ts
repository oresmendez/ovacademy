import type { HttpContext } from '@adonisjs/core/http'

import TypeEvaluacionesService from './service.js';
const TypeEvaluacionesService_ = new TypeEvaluacionesService();

export default class TypeEvaluacionesController {

    public async get_TypeEvaluaciones({ response }: HttpContext) {
    
        try {

            const Types = await TypeEvaluacionesService_.obtenerTypes();
    
            if (!Types) {
                return response.status(404).json({ message: 'Types no encontrada' });
            }
    
            return response.status(200).json({
                message: '',
                data: Types
            });
        } catch (error) {
            console.error('Error obteniendo la unidad:', error);
            return response.status(500).json({ message: 'Error interno del servidor', error });
        }
    }

}