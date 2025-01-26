import Contenido from '../../models/materia/contenido.js';

export default class ContentService {

    /**
     * Obtiene una materia por su ID.
     * @returns {Promise<Unidad[] | false>} Retorna un arreglo de unidades o `false` en caso de error.
     */
    async obtenerContenidoDeUnaUnidad(id: number): Promise<Contenido[] | false> {
        try {
            const resultado = await Contenido.query().where('id_unidad', id)
            
            if (!Array.isArray(resultado)) {
                return false;
            }

            return resultado;
        } catch (error) {
            console.error('Error al obtener materias:', error);
            return false;
        }
    }

    async obtenerDetallesDeUnContenido(id: number): Promise<{ nombre: string; descripcion: string } | null> {
            try {
                
                const response = await Contenido.query().where('id', id).first();
        
                
                if (!response) {
                    return null;
                }
        
                
                return {
                    nombre: response.nombre,
                    descripcion: response.descripcion,
                };
            } catch (error) {
                console.error('Error al obtener los datos de la materia:', error);
                return null;
            }
        }
}
