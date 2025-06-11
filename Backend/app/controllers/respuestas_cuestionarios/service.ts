import RespuestasCuestionarios from '../../models/universidad/respuestas_cuestionarios.js';

export default class RespuestasCuestionariosService {

    async create_respuesta_cuestionario(estudiante_id: number, cuestionario_id: number, semestre_id:number, respuesta:string): Promise<RespuestasCuestionarios | null> {
        const nombreFuncion = this.create_respuesta_cuestionario.name;
        try {
            const user = await RespuestasCuestionarios.create({
                estudiante_id,
                cuestionario_id,
                semestre_id,
                respuesta
            });
            return user;
        } catch (error) {
            console.error(`Error en la función ${nombreFuncion}:`, error.message);
            return null;
        }
    }

    async obtener_RespuestasCuestionario(ids: number[], estudiante_id: number, semestre_id:number): Promise<Array<RespuestasCuestionarios> | null> {
        try {
            const respuestas_cuestionario = await RespuestasCuestionarios.query()
                .whereIn('cuestionario_id', ids)
                .where('estudiante_id', estudiante_id)
                .where('semestre_id', semestre_id);
    
            return respuestas_cuestionario.length > 0 ? respuestas_cuestionario : null;
        } catch (error) {
            console.error('Error obteniendo las respuestas del cuestionario:', error);
            return null;
        }
    }
    

}