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
        

}