import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class NotasEstudiante extends BaseModel {

  public static table = 'universidad.notas_estudiante'

  @column()
  declare nota_evaluacion: number
  
  @column({ isPrimary: true })
  declare estudiante_id: number

  @column({ isPrimary: true })
  declare evaluacion_id: number
  
  @column({ isPrimary: true })
  declare semestre_id: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoUpdate: true })
  declare update_at: DateTime;

}
