import Semestre from '../../models/universidad/semestre.js'

export default class SemestreService {

    async crear_semestre(nombre: string, date_start: Date): Promise<Semestre | null> {
        try {
            return await Semestre.create({
                nombre,
                date_start, 
            })
        } catch (error) {
            console.error('Error creando semestre en SemestreService:', error.message)
            return null
        }
    }

    async obtenerSemestres(): Promise<Array<Semestre> | null> {
        try {
            const semestres = await Semestre.query().orderBy('id', 'desc');
            return semestres.length > 0 ? semestres : null;
        } catch (error) {
            console.error('Error obteniendo todos los semestres:', error);
            return null;
        }
    }

    async obtenerSemestreActivo(): Promise<Array<Semestre> | null> {
        try {
            const semestres = await Semestre.query().where('active', true).orderBy('id', 'desc');
            return semestres.length > 0 ? semestres : null;
        } catch (error) {
            console.error('Error obteniendo todos los semestres:', error);
            return null;
        }
    }

    async obtenerSemestreByID(id: number): Promise<Semestre | false> {
        try {
            const semestre = await Semestre.find(id); 
            if (!semestre) return false;
            return semestre;
        } catch (error) {
                console.error('Error obteniendo una Semestre:', error);
                return false; // Retorna false si ocurre un error
        }
    }

}