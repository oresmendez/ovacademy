import Cuestionarios from '../../models/universidad/cuestionarios.js';

export default class CuestionariosService {

    async create_cuestionarios(evaluacion_id: number, pregunta: string, opciones: string, respuesta_correcta: string): Promise<Cuestionarios | null> {
        try {
            const user = await Cuestionarios.create({
                evaluacion_id,
                pregunta,
                opciones,
                respuesta_correcta,
            });
            return user;
        } catch (error) {
            console.error('Error creando el cuestionario:', error.message);
            return null;
        }
    }

    async obtener_cuestionario(evaluacion_id: number): Promise<Array<Cuestionarios> | null> {
        try {
            const cuestionario = await Cuestionarios.query().where('evaluacion_id', evaluacion_id).orderBy('evaluacion_id', 'asc').orderBy('id', 'asc');
            return cuestionario.length > 0 ? cuestionario : null;
        } catch (error) {
            console.error('Error obteniendo todas el cuestionario:', error);
            return null;
        }
    }

    async obtener_cuestionario_id(id: number): Promise<Array<Cuestionarios> | null> {
        try {
            const cuestionario = await Cuestionarios.query().where('id', id);
            return cuestionario.length > 0 ? cuestionario : null;
        } catch (error) {
            console.error('Error obteniendo todas el cuestionario:', error);
            return null;
        }
    }

}