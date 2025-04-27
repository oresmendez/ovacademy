import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Estudiante extends BaseModel {

  public static table = 'universidad.estudiante'

  @column({ isPrimary: true })
  declare user_id: number; 

  @column()
  declare habilitado: boolean;

  @column()
  declare estado: string;

}
