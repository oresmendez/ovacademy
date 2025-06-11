import Evaluaciones from '../../models/universidad/evaluaciones.js';
import { DateTime } from 'luxon';

export default class EvaluacionesService {

    private readonly evaluacionesModel = Evaluaciones;

    async create_evaluacion(id_unidad: number, type_id: number, nota_evaluacion: number): Promise<Evaluaciones | null> {
        try {
            const user = await this.evaluacionesModel.create({
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
            const evaluacion = await this.evaluacionesModel.findOrFail(id)
            await evaluacion.delete()
            return evaluacion
        } catch (error) {
            console.error('Error al eliminar la evaluacion:', error.message);
            return null;
        }
    }

    async obtenerEvaluacionPorID(id: number): Promise<Evaluaciones | false> {
        try {
            const evaluacion = await this.evaluacionesModel.find(id);
            if (evaluacion === null) {
                return false;
            }
            return evaluacion;
        } catch (error) {
            console.error('Error al obtener la evaluación por ID:', error);
            return false;
        }
    }


    async obtenerEvaluacionesByID_Unidad(id: number, status: string): Promise<Evaluaciones[] | false> {
        try {
            let resultado;
            if (status === 'true') {
                resultado = await this.evaluacionesModel
                    .query()
                    .where('id_unidad', id)
                    .where('status', true)
                    .where('is_deleted', false)
                    .orderBy('id', 'asc');
            } else {
                resultado = await this.evaluacionesModel
                    .query()
                    .where('id_unidad', id)
                    .where('is_deleted', false)
                    .orderBy('id', 'asc');
            }

            if (!Array.isArray(resultado)) {
                return false;
            }

            return resultado;
        } catch (error) {
            console.error('Error al obtener evaluaciones por unidad:', error);
            return false;
        }
    }


    async soft_delete(id: number): Promise<Evaluaciones | null> {
        
        try {
    
            const response = await this.obtenerEvaluacionPorID(id);
            if (!response) {
                console.error('Evaluacion no encontrada');
                return null;
            }
            
            const is_deleted = !response.is_deleted;
            response.is_deleted = is_deleted;
            response.deleted_at = is_deleted ? DateTime.now() : null;
            return response.save();

        } catch (error) {
            console.error('Error editando Evaluacion en soft_delete:', error.message);
            return null;
        }
    }

}