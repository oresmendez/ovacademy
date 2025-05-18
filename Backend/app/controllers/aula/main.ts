import type { HttpContext } from '@adonisjs/core/http'
import AulaService from '../../controllers/aula/service.js'

const AulaService_ = new AulaService();

export default class AulaController {

    public async create_aula({ request, response }: HttpContext) {

        try {

            const { nombre, ubicacion } = request.only(['nombre', 'ubicacion'])
            
            if (!await AulaService_.crearAula(nombre, ubicacion)) {
                return response.badRequest({ message: 'Error en crear el aula' });
            }

            return response.created({ message: 'aula creada' });
            
        } catch (error) {return response.internalServerError({ message: 'Error interno del servidor' });}

    }

    public async list_aulas({ response }: HttpContext) {

        try {
            
            const aulas = await AulaService_.obtenerAulas();
    
            if (!aulas) {return response.badRequest({ message: 'Error al obtener las aulas' });}
            
            return response.ok({ message: 'listado de aulas', data: aulas });         
            
        } catch (error) {return response.internalServerError({ message: 'Error interno del servidor' });}

    }

    public async get_AulabyID({ params, response }: HttpContext) {

        try {

            const aula = await AulaService_.obtenerAulaByID(params.id);
    
            if (!aula) {
                return response.status(404).json({ message: 'Seccion no encontrada' });
            }
    
            return response.status(200).json({
                message: '',
                data: aula
            });
        } catch (error) {
            console.error('Error obteniendo el aula:', error);
            return response.status(500).json({ message: 'Error interno del servidor', error });
        }
    }

    public async edit_aula({ request, response }: HttpContext) {
        try {
            const { id, nombre, ubicacion } = request.only(['id', 'nombre','ubicacion']);
            const aula = await AulaService_.obtenerAulaByID(id);
            if (!aula) {
                return response.status(404).json({
                    message: 'No existe Aula',
                    success: false,
                });
            }

            try {
                
                aula.merge({ nombre, ubicacion });
                await aula.save();

                return response.status(200).json({
                    message: 'Aula actualizada con éxito',
                    data: aula,
                });

            } catch (saveError) {
                console.error(`Error al guardar del aula: ${saveError.message}`);
                return response.status(500).json({
                    message: 'Error al guardar los cambios del aula',
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

    public async habilitar_or_deshabilitar_aula({ params, response }: HttpContext) {
                
        try {
            
            const aula = await AulaService_.obtenerAulaByID(params.id);
    
            if (!aula) {
                return response.status(404).json({
                    message: 'aula no encontrada',
                });
            }
    
            aula.active = !aula.active
    
            await aula.save();
    
            return response.status(200).json({
                success: true,
            });

        } catch (error) {
            console.error(error);
            return response.status(500)
        }
    }
        

}