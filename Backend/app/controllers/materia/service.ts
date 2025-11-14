import Materia from '../../models/universidad/materia.js'

export default class MateriaService {

    private readonly materiaModel = Materia;

    async getMateria(): Promise<Materia | false> {
        try {
            const materia = await this.materiaModel.first()
            if (!materia) {
                return false
            }
            return materia
        } catch (error) {
            console.error('Error obteniendo materia:', error)
            return false // Retorna false si ocurre algún error
        }
    }


    async ObtenerDatosDeUnaMateria(id: number): Promise<{ nombre: string; descripcion: string } | null> {
        try {
            const response = await this.materiaModel.query().where('id', id).first();

            if (!response) {
                return null;
            }

            return {
                nombre: response.nombre,
                descripcion: response.descripcion,
            };
        } catch (error) {
            console.error('Error al obtener los datos de la materia:', error);
            return null; // Devuelve null en caso de error
        }
    }

    async editar_materia(id: number): Promise<Materia | null> {
        try {
            return await this.materiaModel.findByOrFail('id', id);
        } catch (error) {
            console.error('Error al editar una materia:', error.message);
            return null;
        }
    }
}