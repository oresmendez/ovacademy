import Evaluaciones from '../../models/universidad/evaluaciones.js';

export default class EvaluacionesService {

    async create_evaluacion(id_unidad: number, type_id: number, nota_evaluacion: number): Promise<Evaluaciones | null> {
        try {
            const user = await Evaluaciones.create({
                id_unidad,
                type_id,
                nota_evaluacion
            });
            return user;
        } catch (error) {
            console.error('Error creando la evaluacion:', error.message);
            return null;
        }
    }

    async eliminar_evaluacion(id: number): Promise<Evaluaciones | null> {
        try {
            const evaluacion = await Evaluaciones.findOrFail(id)
            await evaluacion.delete()
            return evaluacion
        } catch (error) {
            console.error('Error al eliminar la evaluacion:', error.message);
            return null;
        }
    }

    async obtenerEvaluacionesByID(id: number): Promise<Evaluaciones[] | false> {
        try {
            const resultado = await Evaluaciones.query().where('id', id).orderBy('id', 'asc')
            
            if (!Array.isArray(resultado)) {
                return false;
            }

            return resultado;
        } catch (error) {
            console.error('Error al obtener materias:', error);
            return false;
        }
    }

    async obtenerEvaluacionesByID_Unidad(id: number): Promise<Evaluaciones[] | false> {
        try {
            const resultado = await Evaluaciones.query().where('id_unidad', id).orderBy('id', 'asc')
            
            if (!Array.isArray(resultado)) {
                return false;
            }

            return resultado;
        } catch (error) {
            console.error('Error al obtener materias:', error);
            return false;
        }
    }

}