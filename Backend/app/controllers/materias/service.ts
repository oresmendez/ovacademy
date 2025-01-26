import Materia from '../../models/materia/materia.js'

export default class MateriaService {

    /**----------------------------------------------------------
     * @author      : Orestes Fleitas
     * @DateCreate  : 10 ene 2025
     * @DateUpdate  : 10 ene 2025
     * @Name        : obtenerMaterias
     * @details     : Método para obtener todas las materias registradas en la base de datos.
     * @returnTrue  : Devuelve un arreglo de objetos de tipo Materia si existen registros.
     * @returnFalse : Devuelve `false` si ocurre un error durante la consulta.
     */
    async obtenerMaterias(): Promise<Array<Materia> | false> {
        try {
            return await Materia.all();
        } catch (error) {
            console.error('Error obteniendo materias:', error);
            return false; // Retorna false si ocurre algún error
        }
    }

    /**----------------------------------------------------------
     * @author      : Orestes Fleitas
     * @DateCreate  : 10 ene 2025
     * @DateUpdate  : 10 ene 2025
     * @Name        : ObtenerDatosDeUnaMateria
     * @details     : Método que obtiene los detalles de una materia específica por su ID.
     * @returnTrue  : Devuelve un objeto con el nombre y la descripción de la materia si el ID es válido.
     * @returnFalse : Devuelve `null` si no se encuentra la materia o si ocurre un error durante la consulta.
     */
    async ObtenerDatosDeUnaMateria(id: number): Promise<{ nombre: string; descripcion: string } | null> {
        try {
            const response = await Materia.query().where('id', id).first();

            if (!response) {
                return null;
            }

            return {
                nombre: response.nombre,
                descripcion: response.descripcion,
            };
        } catch (error) {
            console.error('Error al obtener los datos de la materia:', error);
            return null; // Devuelve null en caso de error
        }
    }

    /**----------------------------------------------------------
     * @author      : Orestes Fleitas
     * @DateCreate  : 10 ene 2025
     * @DateUpdate  : 10 ene 2025
     * @Name        : editar_materia
     * @details     : Método que busca y obtiene una materia específica por su ID para editarla.
     * @returnTrue  : Devuelve el objeto Materia si el ID es válido y existe la materia.
     * @returnFalse : Devuelve `null` si no se encuentra la materia o si ocurre un error durante la consulta.
     */
    async editar_materia(id: number): Promise<Materia | null> {
        try {
            return await Materia.findByOrFail('id', id);
        } catch (error) {
            console.error('Error al editar una materia:', error.message);
            return null;
        }
    }
}