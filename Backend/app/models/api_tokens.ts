import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ApiToken extends BaseModel {

  public static table = 'authentication.api_tokens'

  @column({ isPrimary: true })
  declare id: number; // Corresponde al campo SERIAL de la tabla

  @column()
  declare user_id: number; // UUID del usuario (relación con la tabla `users`)

  @column()
  declare type_id: number;

  @column()
  declare token: string; // Token generado (único)

  @column.dateTime()
  declare expires_at: DateTime; // Fecha de expiración del token (opcional)
  
  @column.dateTime({ autoCreate: true })
  declare created_at: DateTime; // Fecha de creación
}
