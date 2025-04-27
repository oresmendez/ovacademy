import TypeEscalaApreciacion from '../../models/universidad/type_escala_apreciacion.js';


export default class TypeEscalaApreciacionService {

    async obtenerTypes(): Promise<Array<TypeEscalaApreciacion> | null> {
        try {
            const types = await TypeEscalaApreciacion.query().orderBy('id', 'asc');
            return types.length > 0 ? types : null;
        } catch (error) {
            console.error('Error obteniendo todos los types:', error);
            return null;
        }
    }

}