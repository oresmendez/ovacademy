import Aula from '../../models/universidad/aula.js'

export default class AulaService {

    async crearAula(nombre: string, ubicacion: string): Promise<Aula | null> {
        try {
            return await Aula.create({
                nombre,
                ubicacion
            })
        } catch (error) {
            console.error('Error creando Aula en AulaService:', error.message)
            return null
        }
    }

    async obtenerAulas(): Promise<Array<Aula> | false> {
        try {
            return await Aula.query().orderBy('id', 'asc');
        } catch (error) {
            console.error('Error obteniendo todos las Aulas:', error);
            return false;
        }
    }

}