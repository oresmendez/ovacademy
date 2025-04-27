import SemestreProfesorAula from '../../models/universidad/semestre_profesor_aula.js'

export default class SemestreProfesorAulaService {

    async crear_asociacion_profesorAulaSemestre(semestre_id: number, profesor_id: number, aula_id: number): Promise<SemestreProfesorAula | null> {
        try {
            return await SemestreProfesorAula.create({
                semestre_id,
                profesor_id, 
                aula_id
            })
        } catch (error) {
            console.error('Error creando semestre en SemestreService:', error.message)
            return null
        }
    }

    async obtenerAulaAsociadaProfesor(semestre_id: number, profesor_id: number) {
        try {
            const resultados = await SemestreProfesorAula
                .query()
                .join('universidad.aula', 'semestre_profesor_aula.aula_id', 'aula.id')
                .select(
                    'semestre_profesor_aula.id',
                    'semestre_profesor_aula.aula_id as aulaId',
                    'aula.nombre as nombreAula'
                )
                .where('semestre_profesor_aula.profesor_id', profesor_id)
                .where('semestre_profesor_aula.semestre_id', semestre_id)
                .orderBy('semestre_profesor_aula.aula_id', 'asc');
    
            return resultados.map((registro) => ({
                id: registro.id,
                aulaId: registro.$extras.aulaId,
                nombreAula: registro.$extras.nombreAula
            }));
        } catch (error) {
            console.error('Error obteniendo aulas:', error);
            return null;
        }
    }

    async obtener_todas_aulas_con_profesor(semestre_id: number): Promise<Array<SemestreProfesorAula> | null> {
        try {
            const semestres = await SemestreProfesorAula.query().where('semestre_profesor_aula.semestre_id', semestre_id).orderBy('id', 'asc');
            return semestres.length > 0 ? semestres : null;
        } catch (error) {
            console.error('Error obteniendo todos los semestres:', error);
            return null;
        }
    }

    async obtenerAulaByID(id: number): Promise<SemestreProfesorAula | false> {
        try {
            const registro = await SemestreProfesorAula.find(id); 
            if (!registro) return false;
            return registro;
        } catch (error) {
            console.error('Error obteniendo un aula:', error);
            return false;
        }
    }

    async obtener_detalles_profesor_aula(semestre_id: number, profesor_id: number, aula_id: number): Promise<SemestreProfesorAula | false> {
        try {
            const registro = await SemestreProfesorAula.query()
                .where({
                    semestre_id,
                    profesor_id,
                    aula_id,
                })
                .first();
    
            if (!registro) return false;
    
            return registro;
        } catch (error) {
            console.error('Error obteniendo un aula:', error);
            return false;
        }
    }

}