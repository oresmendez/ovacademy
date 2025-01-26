
/**----------------------------------------------------------
 * @author          : Orestes Fleitas
 * @NameController  : UnidadesService
 * @details         : Servicio encargado de gestionar las operaciones relacionadas con las unidades. 
 */

import Unidad from '../../models/materia/unidad.js';

export default class UnidadService {

    /**----------------------------------------------------------
     * @author      : Orestes Fleitas
     * @DateCreate  : 10 ene 2025
     * @DateUpdate  : 10 ene 2025
     * @Name        : listarUnidades
     * @details     : Método que obtiene una lista de unidades relacionadas con un ID de materia específico.
     * @returnTrue  : Devuelve un arreglo de objetos de tipo Unidad si existen registros asociados al ID.
     * @returnFalse : Devuelve `false` si ocurre un error o si el resultado no es un arreglo válido.
    */

    public async listarUnidades(id: number): Promise<Unidad[] | false> {
        try {
            const resultado = await Unidad.query().where('id_materia', id).orderBy('id', 'asc');
            if (!Array.isArray(resultado)) {
                return false;
            }

            return resultado;
        } catch (error) {
            console.error('Error al obtener materias:', error);
            return false;
        }
    }

    /**----------------------------------------------------------
     * @author      : Orestes Fleitas
     * @DateCreate  : 10 ene 2025
     * @DateUpdate  : 10 ene 2025
     * @Name        : verUnidad
     * @details     : Método que obtiene los detalles de una unidad específica por su ID.
     * @returnTrue  : Devuelve un objeto con el nombre y la descripción de la unidad si el ID es válido y existe la unidad.
     * @returnFalse : Devuelve `null` si no se encuentra la unidad o si ocurre un error.
    */

    public async verUnidad(id: number): Promise<{ nombre: string; descripcion: string } | null> {
        try {
            const response = await Unidad.query().where('id', id).first();

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

    /**----------------------------------------------------------
     * @author      : Orestes Fleitas
     * @DateCreate  : 10 ene 2025
     * @DateUpdate  : 10 ene 2025
     * @Name        : editarUnidad
     * @details     : Método que busca una unidad específica por su ID para ser editada.
     * @returnTrue  : Devuelve el objeto de la unidad si se encuentra el ID.
     * @returnFalse : Devuelve `null` si no se encuentra la unidad o si ocurre un error durante la operación.
    */

    public async editarUnidad(id: number): Promise<Unidad | null> {
        try {
            return await Unidad.findByOrFail('id', id);
        } catch (error) {
            console.error('Error al editar una materia', error.message);
            return null;
        }
    }



}