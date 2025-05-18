import Aula from '../../models/universidad/aula.js'

export default class AulaService {

    private readonly aulaModel = Aula;

    async crearAula(nombre: string, ubicacion: string): Promise<Aula | null> {
        try {
            return await this.aulaModel.create({
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
            return await this.aulaModel.query().orderBy('id', 'asc').where('active', 'true');
        } catch (error) {
            console.error('Error obteniendo todos las Aulas:', error);
            return false;
        }
    }
    
    async obtenerAulaByID(id: number): Promise<Aula | false> {
        try {
            const unidad = await this.aulaModel.find(id); 
            if (!unidad) return false;
            return unidad;
        } catch (error) {
                console.error('Error obteniendo una unidad:', error);
                return false; // Retorna false si ocurre un error
        }
    }
}