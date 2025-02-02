import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Profesor extends BaseModel {

  public static table = 'authentication.profesor'

  @column({ isPrimary: true })
  declare user_id: number; // UUID del usuario (relación con la tabla `users`)

  @column()
  declare colegiado: string;

}
