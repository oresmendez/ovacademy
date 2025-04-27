import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Evaluaciones extends BaseModel {

  public static table = 'universidad.evaluaciones'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare id_unidad: number

  @column()
  declare type_id: number

  @column()
  declare nota_evaluacion: number

  @column()
  declare status: boolean;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoUpdate: true })
  declare update_at: DateTime;

}
