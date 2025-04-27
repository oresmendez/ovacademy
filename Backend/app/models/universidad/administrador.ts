import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Administrador extends BaseModel {

  public static table = 'universidad.administrador'

  @column({ isPrimary: true })
  declare user_id: number; 

  @column()
  declare habilitado: boolean;

}
