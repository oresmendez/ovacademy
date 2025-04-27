import TypeEvaluaciones from '../../models/universidad/type_evaluaciones.js';


export default class TypeEvaluacionesService {

    async obtenerTypes(): Promise<Array<TypeEvaluaciones> | null> {
        try {
            const types = await TypeEvaluaciones.query().orderBy('id', 'asc');
            return types.length > 0 ? types : null;
        } catch (error) {
            console.error('Error obteniendo todos los types:', error);
            return null;
        }
    }

}