
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class SopaDeLetras extends BaseModel {

    public static table = 'universidad.sopa_de_letras'

    @column({ isPrimary: true })
    declare id: number

    @column()
    declare evaluacion_id: number

    @column()
    declare palabras: string

}
