import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class EstudianteSemestre extends BaseModel {

  public static table = 'universidad.estudiante_aula'

  @column()
  declare semestre_profesor_aula_id: number

  @column({ isPrimary: true })
  declare semestre_id: number

  @column({ isPrimary: true })
  declare estudiante_id: number

  @column()
  declare nota_final: number;

  @column.dateTime({ autoUpdate: true })
  declare fecha_inscripcion: DateTime;

}
