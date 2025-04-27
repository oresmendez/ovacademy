import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  public static table = 'authentication.user';

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare email: string;

  @column()
  declare name: string;

  @column()
  declare surname: string;

  @column()
  declare phone: string;

  @column()
  declare status_logico: boolean;

  @column()
  declare type_id: number;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoUpdate: true })
  declare update_at: DateTime;

}
