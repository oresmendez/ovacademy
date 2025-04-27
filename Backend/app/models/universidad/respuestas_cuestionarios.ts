import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class RespuestasCuestionarios extends BaseModel {

    public static table = 'universidad.respuestas_cuestionarios'

    @column({ isPrimary: true })
    declare semestre_id: number

    @column({ isPrimary: true })
    declare estudiante_id: number

    @column({ isPrimary: true })
    declare cuestionario_id: number

    @column()
    declare respuesta: string

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

}
