import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class SemestreProfesorAula extends BaseModel {

  public static table = 'universidad.semestre_profesor_aula'

  @column({ isPrimary: true })
  declare id: number

  @column()
  declare semestre_id: number;

  @column()
  declare profesor_id: number;

  @column()
  declare aula_id: number;

  @column()
  declare habilitado: boolean;

}