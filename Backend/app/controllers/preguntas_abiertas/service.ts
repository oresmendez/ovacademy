import PreguntasAbiertas from '../../models/universidad/preguntas_abiertas.js';

export default class PreguntasAbiertasService {

    async create_PreguntasAbiertas(evaluacion_id: number, pregunta: string): Promise<PreguntasAbiertas | null> {
        try {
            const user = await PreguntasAbiertas.create({
                evaluacion_id,
                pregunta,
            });
            return user;
        } catch (error) {
            console.error('Error creando las preguntas abiertas:', error.message);
            return null;
        }
    }

    async obtener_PreguntasAbiertas(evaluacion_id: number): Promise<Array<PreguntasAbiertas> | null> {
        try {
            const sopadeletras = await PreguntasAbiertas.query().where('evaluacion_id', evaluacion_id);
            return sopadeletras.length > 0 ? sopadeletras : null;
        } catch (error) {
            console.error('Error obteniendo todas las sopadeletras:', error);
            return null;
        }
    }

}