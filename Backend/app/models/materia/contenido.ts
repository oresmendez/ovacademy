
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Unidad extends BaseModel {

  public static table = 'materias.contenido' 

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare nombre: string

  @column()
  declare descripcion: string

  @column()
  declare id_unidad: number

}