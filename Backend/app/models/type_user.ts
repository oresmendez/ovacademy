import { BaseModel, column } from '@adonisjs/lucid/orm'


export default class TypeUser extends BaseModel {
  public static table = 'authentication.type_user';

  @column({ isPrimary: true })
  declare id: number;

  @column()
  declare type: string;

}
