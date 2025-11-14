
import type { HttpContext } from '@adonisjs/core/http'
import MateriaService from '../../controllers/materia/service.js'

export default class MateriasController { 

    private readonly MateriaService_: MateriaService;

    constructor() {
        this.MateriaService_ = new MateriaService();
    }
    
    public async get_Materia() {
        return await this.MateriaService_.getMateria();
    } 

    public async edit_Materia({ request, response }: HttpContext) {
        try {
            
            let materia = await this.MateriaService_.getMateria();
            if (!materia) {
                return response.status(404).json({
                    message: 'No existe Materia',
                    success: false,
                });
            }

            try {
                const { nombre, objetivo, descripcion } = request.only(['nombre', 'objetivo','descripcion']);
                materia.merge({ nombre, objetivo, descripcion });
                await materia.save();

                return response.status(200).json({
                    message: 'Materia actualizada con éxito',
                    data: materia,
                });

            } catch (saveError) {
                console.error(`Error al guardar la materia: ${saveError.message}`);
                return response.status(500).json({
                    message: 'Error al guardar los cambios de la materia',
                    success: false,
                    error: saveError.message,
                });
            }

        } catch (error) {
            console.error(`Error en edit: ${error.message}`);
            return response.status(500).json({
                message: 'Error interno del servidor',
                success: false,
                error: error.message,
            });
        }
    }
}