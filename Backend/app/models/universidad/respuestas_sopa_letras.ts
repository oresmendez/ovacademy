import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class RespuestaSopaDeLetras extends BaseModel {

    public static table = 'universidad.respuestas_sopa_letras'

    @column({ isPrimary: true })
    declare semestre_id: number

    @column({ isPrimary: true })
    declare estudiante_id: number

    @column({ isPrimary: true })
    declare sopa_id: number

    @column()
    declare matrix: string

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

}
