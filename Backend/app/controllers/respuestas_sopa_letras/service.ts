import RespuestasSopaDeLetras from '../../models/universidad/respuestas_sopa_letras.js';

export default class RespuestasSopaDeLetrasService {

    async create_respuesta_SopaDeLetras(estudiante_id: number, sopa_id: number, semestre_id:number, matrix:string): Promise<RespuestasSopaDeLetras | null> {
        const nombreFuncion = this.create_respuesta_SopaDeLetras.name;
        try {
            const user = await RespuestasSopaDeLetras.create({
                estudiante_id,
                sopa_id,
                semestre_id,
                matrix
            });
            return user;
        } catch (error) {
            console.error(`Error en la función ${nombreFuncion}:`, error.message);
            return null;
        }
    }

    async obtener_RespuestasSopaDeLetras(estudiante_id: number, sopa_id: number): Promise<Array<RespuestasSopaDeLetras> | null> {
        try {
            const respuestas_sopadeletras = await RespuestasSopaDeLetras.query().where('sopa_id', sopa_id).where('estudiante_id', estudiante_id);
            return respuestas_sopadeletras.length > 0 ? respuestas_sopadeletras : null;
        } catch (error) {
            console.error('Error obteniendo todas las sopadeletras:', error);
            return null;
        }
    }

}