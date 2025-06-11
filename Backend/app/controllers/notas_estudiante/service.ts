import NotaEstudiante from '../../models/universidad/notas_estudiante.js'

export default class NotaEstudianteService {

    async registrar_nota_estudiante(nota_evaluacion: number, estudiante_id: number,evaluacion_id: number, semestre_id: number,): Promise<NotaEstudiante | null> {
        try {
            return await NotaEstudiante.create({
                nota_evaluacion,
                estudiante_id,
                evaluacion_id,
                semestre_id
            })
        } catch (error) {
            console.error('Error creando Aula en AulaService:', error.message)
            return null
        }
    }

    async obtener_nota_estudiantes(estudiante_id: number, semestre_id: number): Promise<Array<any> | false> {
        try {

          return await NotaEstudiante
            .query()
            .from('universidad.notas_estudiante as ne')
            .join('universidad.evaluaciones as e', 'ne.evaluacion_id', 'e.id')
            .select(
              'ne.nota_evaluacion',
              'ne.estudiante_id',
              'ne.evaluacion_id',
              'ne.semestre_id',
              'ne.created_at',
              'ne.update_at',
              'e.id_unidad'
            ).where('estudiante_id', estudiante_id)
            .andWhere('semestre_id', semestre_id);


        } catch (error) {
          console.error('Error obteniendo las notas de los estudiantes:', error)
          return false
        }
    }

    async obtener_nota_estudiantes_by_unidad(estudiante_id: number, id_unidad: number, semestre_id: number): Promise<Array<any> | false> {
        try {

          return await NotaEstudiante
            .query()
            .from('universidad.notas_estudiante as ne')
            .join('universidad.evaluaciones as e', 'ne.evaluacion_id', 'e.id')
            .select(
              'ne.nota_evaluacion',
              'ne.estudiante_id',
              'ne.evaluacion_id',
              'ne.semestre_id',
              'ne.created_at',
              'ne.update_at',
              'e.id_unidad')
            .where('estudiante_id', estudiante_id)
            .where('id_unidad', id_unidad)
            .andWhere('semestre_id', semestre_id);


        } catch (error) {
          console.error('Error obteniendo las notas de los estudiantes:', error)
          return false
        }
    }

    async obtener_nota_estudiantes_by_evaluacion(estudiante_id: number, evaluacion_id: number, semestre_id: number): Promise<Array<any> | false> {
        try {

          return await NotaEstudiante
            .query()
            .from('universidad.notas_estudiante as ne')
            .join('universidad.evaluaciones as e', 'ne.evaluacion_id', 'e.id')
            .select(
              'ne.nota_evaluacion',
              'ne.estudiante_id',
              'ne.evaluacion_id',
              'ne.semestre_id',
              'ne.created_at',
              'ne.update_at',
              'e.id_unidad')
            .where('estudiante_id', estudiante_id)
            .where('evaluacion_id', evaluacion_id)
            .andWhere('semestre_id', semestre_id);


        } catch (error) {
          console.error('Error obteniendo las notas de los estudiantes:', error)
          return false
        }
    }

    async editar_nota(
      estudiante_id: number,
      evaluacion_id: number,
      semestre_id: number,
      nota_evaluacion: number
    ): Promise<boolean> {
      try {
        const resultado = await NotaEstudiante
          .query()
          .where('estudiante_id', estudiante_id)
          .andWhere('evaluacion_id', evaluacion_id)
          .andWhere('semestre_id', semestre_id)
          .update({ nota_evaluacion });
    
          return Array.isArray(resultado) ? resultado.length > 0 : resultado > 0;
    
      } catch (error) {
        console.error('Error al actualizar la nota:', error);
        return false;
      }
    }
    
    
    
      

}