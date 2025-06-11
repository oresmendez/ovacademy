import { Database } from '@adonisjs/lucid/database'

import EstudianteAula from '../../models/universidad/estudiante_aula.js'

export default class EstudianteAulaService {

    async registrar_estudiante_aula(semestre_profesor_aula_id: number, semestre_id:number, estudiante_id: number): Promise<{ status: string, estudiante?: EstudianteAula | null }> {    
        try {
    
            const nuevoRegistro = await EstudianteAula.create({
                semestre_profesor_aula_id,
                semestre_id,
                estudiante_id, 
            });
    
            return { status: 'exito', estudiante: nuevoRegistro };
    
        } catch (error) {
            console.error('Error registrando un estudiante en EstudianteSemestreService:', error.message);
            return { status: 'error' };
        }
    }

    async obtener_estudiantes_inscritos_generales(semestre_id: number): Promise<Array<EstudianteAula> | false> {
        try {
            return await EstudianteAula.query()
            .where('semestre_id', semestre_id)
            .andWhere('nota_final', '<', 5);
        } catch (error) {
            console.error('Error obteniendo todos las Aulas:', error);
            return false;
        }
    }

    async obtener_estudiantes_inscritos_by_aula(semestreId: number, aulaId: number) {
        try {
          const estudiantes = await EstudianteAula
            .query()
            .from('universidad.estudiante_aula') // Indicar el esquema correcto
            .join('universidad.semestre_profesor_aula', 'estudiante_aula.semestre_profesor_aula_id', 'semestre_profesor_aula.id')
            .join('universidad.estudiante', 'estudiante_aula.estudiante_id', 'estudiante.user_id')
            .join('authentication.user', 'estudiante.user_id', 'user.id')
            .where('estudiante_aula.semestre_id', semestreId)
            .andWhere('semestre_profesor_aula.aula_id', aulaId)
            .select(
              'user.id',
              'user.name',
              'user.surname',
              'user.email',
              'estudiante_aula.nota_final'
            )
      
          return estudiantes
        } catch (error) {
          console.error('Error obteniendo estudiantes:', error)
          return false
        }
    }

	async obtener_un_estudiante_inscrito(semestre_id: number, estudiante_id: number): Promise<EstudianteAula | false> {
        
		try {
			const registro = await EstudianteAula
			  .query()
			  .where('semestre_id', semestre_id)
			  .where('estudiante_id', estudiante_id)
			  .first()
		
			return registro ?? false

        } catch (error) {
            console.error('Error obteniendo todos las Aulas:', error);
            return false;
        }
    }

	async obtener_detalles_del_aula(semestre_id: number, semestre_profesor_aula_id: number): Promise<EstudianteAula[] | false> {
        
		try {
			const registro = await EstudianteAula
			  .query()
			  .where('semestre_id', semestre_id)
			  .where('semestre_profesor_aula_id', semestre_profesor_aula_id)
		
			return registro ?? false

        } catch (error) {
            console.error('Error obteniendo todos las Aulas:', error);
            return false;
        }
    }
      
    
    
}