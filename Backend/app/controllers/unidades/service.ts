
import Unidad from '../../models/universidad/unidad.js';

export default class UnidadService {

    private readonly unidadModel = Unidad;

    async crear_unidad(modulo: string, nombre: string, descripcion: string, profesor_id: number, nota_unidad: number): Promise<Unidad | null> {
        try {
            return await this.unidadModel.create({
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
            const unidades = await this.unidadModel.query().orderBy('id', 'asc').where('profesor_id', profesor_id);
            return unidades.length > 0 ? unidades : null;
        } catch (error) {
            console.error('Error obteniendo todos los semestres:', error);
            return null;
        }
    }

    async obtenerUnidadesByID(id: number): Promise<Unidad | false> {
        try {
            const unidad = await this.unidadModel.find(id); 
            if (!unidad) return false;
            return unidad;
        } catch (error) {
                console.error('Error obteniendo una unidad:', error);
                return false; // Retorna false si ocurre un error
        }
    }


}