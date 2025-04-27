import type { HttpContext } from '@adonisjs/core/http'

import TypeEscalaApreciacionService from './service.js';
const TypeEscalaApreciacionService_ = new TypeEscalaApreciacionService();

export default class TypeEscalaApreciacionController {

    public async get_TypeEscalaApreciacion({ response }: HttpContext) {
    
        try {

            const Types = await TypeEscalaApreciacionService_.obtenerTypes();
    
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