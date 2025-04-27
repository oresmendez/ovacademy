import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class TypeEvaluaciones extends BaseModel {

  public static table = 'universidad.type_evaluaciones'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare type: string

}
