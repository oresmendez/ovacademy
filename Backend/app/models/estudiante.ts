import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ApiToken extends BaseModel {

  public static table = 'authentication.estudiante'

  @column({ isPrimary: true })
  declare user_id: number; // UUID del usuario (relación con la tabla `users`)

  @column()
  declare semestre: string;

  @column()
  declare habilitado: boolean;

}
