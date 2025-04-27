import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class RespuestaPreguntasAbiertas extends BaseModel {

    public static table = 'universidad.respuestas_preguntas_abiertas'

    @column({ isPrimary: true })
    declare semestre_id: number

    @column({ isPrimary: true })
    declare estudiante_id: number

    @column({ isPrimary: true })
    declare preguntas_abiertas_id: number

    @column()
    declare respuesta: string

    @column()
    declare id_escala_apreciacion: number

    @column.dateTime({ autoCreate: true })
    declare createdAt: DateTime;

}
