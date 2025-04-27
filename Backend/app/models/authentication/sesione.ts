import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Sesione extends BaseModel {

  public static table = 'authentication.sesiones' 

  @column({ isPrimary: true })
  declare id: number

  @column({ isPrimary: true })
  declare user_id: number

  @column()
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

}