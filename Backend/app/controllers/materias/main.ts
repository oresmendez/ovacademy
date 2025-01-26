/**----------------------------------------------------------
 * @author          : Orestes Fleitas
 * @NameController  : SesioneController
 * @details         : Controlador para gestionar las operaciones relacionadas con materias, unidades y contenidos.
 */

import type { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db';
import MateriaService from '../../controllers/materias/service.js'

const MateriaService_ = new MateriaService();

export default class SesioneController {

    /**----------------------------------------------------------
     * @author      : Orestes Fleitas
     * @DateCreate  : 10 ene 2025
     * @DateUpdate  : 10 ene 2025
     * @Name        : index
     * @details     : Método que obtiene la lista de todas las materias disponibles.
     * @returnTrue  : Devuelve un arreglo de materias si existen registros.
     * @returnFalse : Devuelve un error si ocurre un problema al obtener las materias.
     */

    public async index({ request }: HttpContext) {
        return await MateriaService_.obtenerMaterias();
    }

    /**----------------------------------------------------------
     * @author      : Orestes Fleitas
     * @DateCreate  : 10 ene 2025
     * @DateUpdate  : 10 ene 2025
     * @Name        : show
     * @details     : Método que obtiene los detalles de una materia específica basada en su ID.
     * @returnTrue  : Devuelve los detalles de la materia si el ID es válido y existe la materia.
     * @returnFalse : Devuelve un error si no se encuentra la materia o si ocurre un problema.
     */

    public async show({ request }: HttpContext) {
        const { id } = request.only(['id']);
        return await MateriaService_.ObtenerDatosDeUnaMateria(id);
    }

    /**----------------------------------------------------------
     * @author      : Orestes Fleitas
     * @DateCreate  : 10 ene 2025
     * @DateUpdate  : 10 ene 2025
     * @Name        : store
     * @details     : Método que asocia nuevas unidades y contenidos a la primera materia en la base de datos.
     *                Valida el formato de los datos y realiza las inserciones en la base de datos utilizando
     *                transacciones para garantizar la consistencia.
     * @returnTrue  : Devuelve un mensaje de éxito si las unidades y contenidos se insertan correctamente.
     * @returnFalse : Devuelve un error si los datos enviados son inválidos o si ocurre un problema durante la transacción.
     */

    public async store({ request, response }: HttpContext) {
        const materiaData = request.body();

        if (!materiaData || !Array.isArray(materiaData.unidades)) {
            return response.status(400).json({
                message: 'El formato de datos es inválido. Se esperaban unidades asociadas.',
            });
        }

        const unidadesValidas = materiaData.unidades.filter(unidad =>
            unidad && typeof unidad.nombre === 'string' && unidad.nombre.trim() !== ''
        );

        if (unidadesValidas.length === 0) {
            return response.status(400).json({
                message: 'No se encontraron unidades válidas en los datos enviados.',
            });
        }

        const trx = await db.transaction();

        try {
            const materia = await db.from('materias.materia').select('id').orderBy('id', 'asc').first();

            if (!materia) {
                await trx.rollback();
                return response.status(404).json({
                    message: 'No se encontró ninguna materia en la base de datos.',
                });
            }

            const materiaId = materia.id;
            console.log(`Se utilizará la Materia con ID: ${materiaId}`);

            for (const unidad of unidadesValidas) {
                const unidadResult = await trx.table('materias.unidad').insert({
                    nombre: unidad.nombre,
                    descripcion: unidad.descripcion || null,
                    id_materia: materiaId,
                }).returning('id');

                const unidadId = unidadResult[0]?.id;
                console.log(`Unidad creada con ID: ${unidadId}, relacionada con Materia ID: ${materiaId}`);

                for (const contenido of unidad.contenidos || []) {
                    if (contenido && typeof contenido.nombre === 'string' && contenido.nombre.trim() !== '') {
                        const contenidoResult = await trx.table('materias.contenido').insert({
                            nombre: contenido.nombre,
                            descripcion: contenido.descripcion || null,
                            id_unidad: unidadId,
                        }).returning('id');

                        const contenidoId = contenidoResult[0]?.id;
                        console.log(`Contenido creado con ID: ${contenidoId}, relacionado con Unidad ID: ${unidadId}`);
                    } else {
                        console.warn(`Contenido inválido ignorado en Unidad ID: ${unidadId}`);
                    }
                }
            }

            await trx.commit();

            return response.status(201).json({
                message: 'Unidades y contenidos asociados correctamente a la primera materia.',
                materiaId,
            });
        } catch (error) {
            await trx.rollback();
            console.error('Error al insertar datos:', error);

            return response.status(500).json({
                message: 'Ocurrió un error al asociar unidades y contenidos.',
                error: error.message,
            });
        }
    }

    /**----------------------------------------------------------
     * @author      : Orestes Fleitas
     * @DateCreate  : 10 ene 2025
     * @DateUpdate  : 10 ene 2025
     * @Name        : edit
     * @details     : Método que permite editar los detalles de una materia específica.
     *                Busca la materia por ID, actualiza sus propiedades y guarda los cambios.
     * @returnTrue  : Devuelve un mensaje de éxito y la materia actualizada si la operación es exitosa.
     * @returnFalse : 
     *                - Devuelve un estado 404 si la materia no se encuentra.
     *                - Devuelve un estado 500 si ocurre un error al guardar los cambios.
     */

    public async edit({ request, response }: HttpContext) {
        try {
            const { id, nombre, descripcion } = request.only(['id', 'nombre', 'descripcion']);
            const materia = await MateriaService_.editar_materia(id);

            if (!materia) {
                return response.status(404).json({
                    message: 'Materia no encontrada',
                    success: false,
                });
            }

            try {
                materia.merge({ id, nombre, descripcion });
                await materia.save();

                return response.status(200).json({
                    message: 'Materia actualizada con éxito',
                    data: materia,
                });

            } catch (saveError) {
                console.error(`Error al guardar la materia: ${saveError.message}`);
                return response.status(500).json({
                    message: 'Error al guardar los cambios de la materia',
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