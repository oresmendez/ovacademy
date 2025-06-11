import RespuestasPreguntasAbiertas from '../../models/universidad/respuestas_preguntas_abiertas.js';

export default class RespuestasPreguntasAbiertasService {

    async create_respuesta_preguntas_abiertas(estudiante_id: number, preguntas_abiertas_id: number, semestre_id:number, respuesta:string): Promise<RespuestasPreguntasAbiertas | null> {
        const nombreFuncion = this.create_respuesta_preguntas_abiertas.name;
        try {
            const user = await RespuestasPreguntasAbiertas.create({
                estudiante_id,
                preguntas_abiertas_id,
                semestre_id,
                respuesta
            });
            return user;
        } catch (error) {
            console.error(`Error en la función ${nombreFuncion}:`, error.message);
            return null;
        }
    }

    async obtener_Respuestas_preguntas(ids: number[], estudiante_id: number, semestre_id: number): Promise<Array<RespuestasPreguntasAbiertas> | null> {
        try {
            const respuestas_preguntas= await RespuestasPreguntasAbiertas.query()
                .whereIn('preguntas_abiertas_id', ids)
                .where('estudiante_id', estudiante_id)
                .where('semestre_id', semestre_id);
    
            return respuestas_preguntas.length > 0 ? respuestas_preguntas : null;
        } catch (error) {
            console.error('Error obteniendo las respuestas del cuestionario:', error);
            return null;
        }
    }

    async obtener_respuestas_preguntas_id(id: number): Promise<Array<RespuestasPreguntasAbiertas> | null> {
        try {
            const respuestasPreguntasAbiertas = await RespuestasPreguntasAbiertas.query().where('preguntas_abiertas_id', id);
            return respuestasPreguntasAbiertas.length > 0 ? respuestasPreguntasAbiertas : null;
        } catch (error) {
            console.error('Error obteniendo todas el cuestionario:', error);
            return null;
        }
    }

}