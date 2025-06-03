
import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'

export default class PreguntasAbiertas extends BaseModel {

    public static table = 'universidad.preguntas_abiertas'

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare evaluacion_id: number

    @column()
    declare pregunta: string

    @column()
    declare is_deleted: boolean;

    @column.dateTime({ serializeAs: null })
    declare deleted_at: DateTime | null;

}
