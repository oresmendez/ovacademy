import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Contenido extends BaseModel {

  public static table = 'universidad.contenidos' 

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare id_unidad: number

  @column()
  declare nombre: string

  @column()
  declare descripcion: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoUpdate: true })
  declare update_at: DateTime;

  @column()
  declare status: boolean;

  @column()
  declare is_deleted: boolean;

  @column.dateTime({ serializeAs: null })
  declare deleted_at: DateTime | null;

}