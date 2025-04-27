
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Cuestionarios extends BaseModel {

    public static table = 'universidad.cuestionarios'

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare evaluacion_id: number

    @column()
    declare pregunta: string

    @column()
    declare opciones: string

    @column()
    declare respuesta_correcta: string

}
