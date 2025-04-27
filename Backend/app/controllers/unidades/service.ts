
/**----------------------------------------------------------
 * @author          : Orestes Fleitas
 * @NameController  : UnidadesService
 * @details         : Servicio encargado de gestionar las operaciones relacionadas con las unidades.
 */

import Unidad from '../../models/universidad/unidad.js';

export default class UnidadService {


    // public async listarUnidades(id: number): Promise<Unidad[] | false> {
    //     try {
    //         const resultado = await Unidad.query().where('id_materia', id).orderBy('id', 'asc');
    //         if (!Array.isArray(resultado)) {
    //             return false;
    //         }

    //         return resultado;
    //     } catch (error) {
    //         console.error('Error al obtener materias:', error);
    //         return false;
    //     }
    // }



    // public async editarUnidad(id: number): Promise<Unidad | null> {
        //     try {
            //         return await Unidad.findByOrFail('id', id);
            //     } catch (error) {
    //         console.error('Error al editar una materia', error.message);
    //         return null;
    //     }
    // }

    // async obtenerUnidades(): Promise<Array<Unidad> | false> {
        //     try {
            //         return await Unidad.query().orderBy('id', 'asc'); // Ordena por nombre ascendente
            //     } catch (error) {
                //         console.error('Error obteniendo materias:', error);
                //         return false; // Retorna false si ocurre algún error
                //     }
                // }


    async crear_unidad(modulo: string, nombre: string, descripcion: string, profesor_id: number, nota_unidad: number): Promise<Unidad | null> {
        try {
            return await Unidad.create({
                profesor_id,
                modulo,
                nombre,
                descripcion,
                nota_unidad
            })
        } catch (error) {
            console.error('Error creando semestre en SemestreService:', error.message)
            return null
        }
    }

    async obtenerUnidades(profesor_id: number): Promise<Array<Unidad> | null> {
        try {
            const unidades = await Unidad.query().orderBy('id', 'asc').where('profesor_id', profesor_id);
            return unidades.length > 0 ? unidades : null;
        } catch (error) {
            console.error('Error obteniendo todos los semestres:', error);
            return null;
        }
    }

    async obtenerUnidadesByID(id: number): Promise<Unidad | false> {
        try {
            const unidad = await Unidad.find(id); 
            if (!unidad) return false;
            return unidad;
        } catch (error) {
                console.error('Error obteniendo una unidad:', error);
                return false; // Retorna false si ocurre un error
        }
    }


}