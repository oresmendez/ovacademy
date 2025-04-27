import Contenido from '../../models/universidad/contenido.js';

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
            const resultado = await Contenido.query().where('id_unidad', id).orderBy('id', 'asc');
            
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

}
