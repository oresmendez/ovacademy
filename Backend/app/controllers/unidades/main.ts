/**----------------------------------------------------------
 * @author          : Orestes Fleitas
 * @NameController  : UnidadesController
 * @details         : Controlador que gestiona las operaciones relacionadas con las unidades.
 *                    Permite listar, mostrar y editar unidades utilizando los servicios correspondientes.
 */

import type { HttpContext } from '@adonisjs/core/http'
import UnidadService from '../../controllers/unidades/service.js'

const UnidadService_ = new UnidadService();

export default class UnidadesController {

    /**----------------------------------------------------------
     * @author      : Orestes Fleitas
     * @DateCreate  : 10 ene 2025
     * @DateUpdate  : 10 ene 2025
     * @Name        : index
     * @details     : Método que lista las unidades relacionadas con el ID proporcionado en la solicitud.
     * @returnTrue  : Devuelve una lista de unidades asociadas al ID, si el ID es válido y se encuentran resultados.
     * @returnFalse : Puede lanzar una excepción o devolver un error si ocurre algún problema en la obtención de las unidades.
    */
    
    public async index({ request }: HttpContext) {
    
        const { id } = request.only(['id']);
    
        return await UnidadService_.listarUnidades(id);
    
    }

    /**----------------------------------------------------------
     * @author      : Orestes Fleitas
     * @DateCreate  : 10 ene 2025
     * @DateUpdate  : 10 ene 2025
     * @Name        : show
     * @details     : Método que devuelve los detalles de una unidad específica, basada en el ID proporcionado.
     * @returnTrue  : Devuelve la información de la unidad si el ID es válido y la unidad existe.
     * @returnFalse : Puede lanzar una excepción o devolver un error si no se encuentra la unidad.
    */

    public async show({ request }: HttpContext) {
    
        const { id } = request.only(['id']);
    
        return await UnidadService_.verUnidad(id);
    
    }

    /**----------------------------------------------------------
     * @author      : Orestes Fleitas
     * @DateCreate  : 10 ene 2025
     * @DateUpdate  : 10 ene 2025
     * @Name        : edit
     * @details     : Método que permite editar los detalles de una unidad específica. 
     *                Busca la unidad por ID, actualiza sus propiedades y guarda los cambios.
     * @returnTrue  : Devuelve la unidad actualizada si la operación es exitosa.
     * @returnFalse : 
     *                - Devuelve un estado 404 si la unidad no se encuentra.
     *                - Devuelve un estado 500 si ocurre un error al guardar los cambios o durante la ejecución.
    */

    public async edit({ request, response }: HttpContext) {
        try {
            
            const { id, nombre, descripcion } = request.only(['id', 'nombre', 'descripcion']);
            const unidad = await UnidadService_.editarUnidad(id);
            
            if (!unidad) {
                return response.status(404).json({
                    message: 'Unidad no encontrada',
                    success: false,
                });
            }
            
            try {
                unidad.merge({ id, nombre, descripcion });
                await unidad.save();
    
                return response.status(200).json({
                    message: 'Unidad actualizada con éxito',
                    data: unidad,
                });
    
            } catch (saveError) {
                console.error(`Error al guardar la Unidad: ${saveError.message}`);
                return response.status(500).json({
                    message: 'Error al guardar los cambios de la Unidad',
                    success: false,
                    error: saveError.message,
                });
            }
    
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
