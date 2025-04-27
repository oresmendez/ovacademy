import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Aula extends BaseModel {

  public static table = 'universidad.aula'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare ubicacion: string

}