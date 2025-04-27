import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Profesor extends BaseModel {

  public static table = 'universidad.profesor'

  @column({ isPrimary: true })
  declare user_id: number;

  @column()
  declare habilitado: boolean;

}
