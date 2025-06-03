
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Unidad extends BaseModel {

  public static table = 'universidad.unidades' 

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare profesor_id: number

  @column()
  declare modulo: string

  @column()
  declare nombre: string

  @column()
  declare descripcion: string

  @column()
  declare nota_unidad: number

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