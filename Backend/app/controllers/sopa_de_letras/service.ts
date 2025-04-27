import SopaDeLetras from '../../models/universidad/sopa_de_letras.js';

export default class SopaDeLetrasService {

    async create_SopaDeLetras(evaluacion_id: number, palabras: string): Promise<SopaDeLetras | null> {
        try {
            const user = await SopaDeLetras.create({
                evaluacion_id,
                palabras,
            });
            return user;
        } catch (error) {
            console.error('Error creando la sopa de letras:', error.message);
            return null;
        }
    }

    async obtener_SopaDeLetras(evaluacion_id: number): Promise<Array<SopaDeLetras> | null> {
        try {
            const sopadeletras = await SopaDeLetras.query().where('evaluacion_id', evaluacion_id);
            return sopadeletras.length > 0 ? sopadeletras : null;
        } catch (error) {
            console.error('Error obteniendo todas las sopadeletras:', error);
            return null;
        }
    }

}