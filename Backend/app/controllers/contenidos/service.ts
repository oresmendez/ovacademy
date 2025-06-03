import Contenido from '../../models/universidad/contenido.js';
import { DateTime } from 'luxon';

export default class ContenidoService {  

    async crear_contenido(id_unidad: number, nombre: string, descripcion: string): Promise<Contenido | null> {
        try {
            return await Contenido.create({
                id_unidad,                
                nombre,
                descripcion
            })
        } catch (error) {
            console.error('Error creando contenido en SemestreService:', error.message)
            return null
        }
    }

    async obtenerContenidoDeUnaUnidad(id: number): Promise<Contenido[] | false> {
        try {
            const resultado = await Contenido.query().where('id_unidad', id).orderBy('id', 'asc').where('is_deleted', false);
            
            if (!Array.isArray(resultado)) {
                return false;
            }

            return resultado;
        } catch (error) {
            console.error('Error al obtener materias:', error);
            return false;
        }
    }

    async obtenerDetallesDeUnContenido(id: number): Promise<Contenido | null> {
        
        try {
            const response = await Contenido
                .query()
                .where('id', id)
                .first();
    
            // Verificar si se encontró un resultado
            if (!response) {
                return null;
            }
    
            // Devolver el contenido encontrado
            return response;

        } catch (error) {
            console.error('Error al obtener los datos del contenido:', error);
            return null;
        }
    }

    async soft_delete(id: number): Promise<Contenido | null> {
        
        try {
    
            const response = await this.obtenerDetallesDeUnContenido(id);
            if (!response) {
                console.error('Contenido no encontrada');
                return null;
            }
            
            const is_deleted = !response.is_deleted;
            response.is_deleted = is_deleted;
            response.deleted_at = is_deleted ? DateTime.now() : null;
            return response.save();

        } catch (error) {
            console.error('Error editando Contenido en soft_delete:', error.message);
            return null;
        }
    }

}
