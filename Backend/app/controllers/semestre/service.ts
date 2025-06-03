import { DateTime } from 'luxon';
import Semestre from '../../models/universidad/semestre.js'

export default class SemestreService {

    private readonly _Semestre = Semestre;

    async create_semestre(nombre: string, date_start: DateTime): Promise<Semestre | null> {
        try {
            return await this._Semestre.create({
                nombre,
                date_start, 
            })
        } catch (error) {
            console.error('Error creando semestre en SemestreService:', error.message)
            return null
        }
    }

    async obtenerSemestres(): Promise<Semestre[] | null> {
        try {
            const semestres = await this._Semestre.query().orderBy('id', 'desc');
            return semestres.length > 0 ? semestres : null;
        } catch (error) {
            console.error('Error obteniendo todos los semestres:', error);
            return null;
        }
    }

    async get_semestre_active(): Promise<Semestre | null> {
        try {
            const semestre = await this._Semestre.query().where('active', true).first();
            return semestre ?? null;
        } catch (error) {
            console.error('Error obteniendo el semestre activo:', error);
            return null;
        }
    }

    async get_id(id: number): Promise<Semestre | null> {
        try {
            return await this._Semestre.find(id) ?? null;
        } catch (error: unknown) {
            console.error('Error buscando semestre por ID:', error);
            return null;
        }
    }

    async update(id: number, nombre: string, date_start: DateTime): Promise<true | null> {
        try {
            const semestre = await this.get_id(id);
            if (!semestre) {return null}
            semestre.merge({ nombre, date_start });
            await semestre.save();
            return true
        } catch (error: unknown) {
            console.error('Error al actualizar el semestre:', error);
            return null;
        }
    }

    async update_element(id: number, data: Partial<{ nombre: string; date_start: Date; date_end: Date; active: boolean }>): Promise<true | null> {
        try {
            const semestre = await this.get_id(id);
            if (!semestre) return null;

            const datosConvertidos: Partial<typeof semestre> = {
            ...('nombre' in data ? { nombre: data.nombre } : {}),
            ...('active' in data ? { active: data.active } : {}),
            ...('date_start' in data ? { date_start: DateTime.fromJSDate(data.date_start!) } : {}),
            ...('date_end' in data ? { date_end: DateTime.fromJSDate(data.date_end!) } : {}),
            };

            semestre.merge(datosConvertidos);
            await semestre.save();

            return true;
        } catch (error: unknown) {
            console.error('Error al actualizar el semestre:', error);
            return null;
        }
    }




}