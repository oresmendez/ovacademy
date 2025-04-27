import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Semestre extends BaseModel {

  public static table = 'universidad.semestre'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column.date()
  declare date_start: Date;
  
  @column.date()
  declare date_end: Date;

  @column()
  declare active: boolean;

}
