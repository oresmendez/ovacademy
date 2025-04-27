
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class PreguntasAbiertas extends BaseModel {

    public static table = 'universidad.preguntas_abiertas'

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare evaluacion_id: number

    @column()
    declare pregunta: string

}
