
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Materia extends BaseModel {

  public static table = 'materias.materia' 

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare descripcion: string

}