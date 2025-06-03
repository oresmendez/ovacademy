import PreguntasAbiertas from '../../models/universidad/preguntas_abiertas.js';
import { DateTime } from 'luxon';

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
            const sopadeletras = await PreguntasAbiertas.query().where('evaluacion_id', evaluacion_id).where('is_deleted', false).orderBy('id', 'asc');
            return sopadeletras.length > 0 ? sopadeletras : null;
        } catch (error) {
            console.error('Error obteniendo todas las sopadeletras:', error);
            return null;
        }
    }

    async obtener_pregunta(id: number): Promise<PreguntasAbiertas | null> {
        try {
            return await PreguntasAbiertas.find(id); // Esto retorna una única instancia o null
        } catch (error) {
            console.error('Error al obtener materias:', error);
            return null;
        }
    }

    async editar_pregunta(id: number, pregunta: string, eliminada: boolean): Promise<PreguntasAbiertas | null> {
        try {  

            const response = await this.obtener_pregunta(id);
            if (!response) {
                console.error('pregunta no encontrada');
                return null;
            }

            if (eliminada) {
                const is_deleted = !response.is_deleted;
                response.is_deleted = is_deleted;
                response.deleted_at = is_deleted ? DateTime.now() : null;
            }

            response.pregunta = pregunta;

            return response.save();

        } catch (error) {
            console.error('Error editando pregunta:', error.message);
            return null;
        }
    }

}