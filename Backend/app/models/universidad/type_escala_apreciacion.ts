import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class TypeEscalaApreciacion extends BaseModel {

  public static table = 'universidad.type_escala_apreciacion'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare type: string

}
